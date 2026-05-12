import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { sendBookingConfirmationEmail } from "@/lib/mail"
import {
  checkRoomAvailability,
  releaseReservedRoomInventory,
  reserveRoomInventory,
  type AvailabilityInput,
} from "@/services/availability.service"
import type { CreateHotelBookingInput } from "@/validators/booking.validators"

const TAX_RATE = 0.12
const HOLD_MINUTES = 15
const PLATFORM_FEE_RATE = 0.1

function generateBookingCode() {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).slice(2, 7).toUpperCase()
  return `GH${timestamp}${random}`
}

function toMoney(value: number) {
  return Number(value.toFixed(2))
}

export async function getBookingById(id: string) {
  return prisma.booking.findUnique({
    where: { id },
    include: {
      Hotel: { select: { id: true, title: true, city: true, slug: true } },
      BookingRoom: { include: { Room: { select: { id: true, name: true, pricePerNight: true } } } },
      BookingTimeline: { orderBy: { createdAt: "asc" } },
      InventoryReservation: true,
      Payment: true,
    },
  })
}

export async function listBookingsForUser(userId: string) {
  return prisma.booking.findMany({
    where: { userId },
    include: {
      Hotel: { select: { id: true, title: true, city: true, slug: true } },
      BookingRoom: { include: { Room: { select: { id: true, name: true, pricePerNight: true } } } },
      Payment: { select: { status: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function createHotelBooking(userId: string, input: CreateHotelBookingInput) {
  const booking = await prisma.$transaction(async (tx) => {
    const room = await tx.room.findFirst({
      where: {
        id: input.roomId,
        hotelId: input.hotelId,
        isActive: true,
        Hotel: {
          isActive: true,
          isApproved: true,
          status: "ACTIVE",
          deletedAt: null,
        },
      },
      include: {
        Hotel: { select: { id: true, hostId: true, title: true, city: true } },
      },
    })

    if (!room) throw new Error("Room not found or hotel is not available for booking")
    if (input.adults > room.maxAdults || input.children > room.maxChildren) {
      throw new Error("Guest count exceeds room capacity")
    }

    const availabilityInput: AvailabilityInput = {
      roomId: room.id,
      checkIn: input.checkIn,
      checkOut: input.checkOut,
      quantity: input.quantity,
    }

    const quote = await checkRoomAvailability(availabilityInput, tx)
    if (!quote.available) throw new Error(quote.reason ?? "Room is not available")

    await reserveRoomInventory(availabilityInput, tx)

    const taxes = toMoney(quote.subtotal * TAX_RATE)
    const totalAmount = toMoney(quote.subtotal + taxes)
    const platformFee = toMoney(totalAmount * PLATFORM_FEE_RATE)
    const hostEarnings = toMoney(totalAmount - platformFee)
    const expiresAt = new Date(Date.now() + HOLD_MINUTES * 60 * 1000)
    const bookingCode = generateBookingCode()

    return tx.booking.create({
      data: {
        bookingCode,
        userId,
        hostId: room.Hotel.hostId,
        hotelId: room.Hotel.id,
        checkIn: input.checkIn,
        checkOut: input.checkOut,
        totalGuests: input.adults + input.children + input.infants,
        adults: input.adults,
        children: input.children,
        infants: input.infants,
        contactName: input.contactName,
        contactEmail: input.contactEmail,
        contactPhone: input.contactPhone,
        specialRequests: input.specialRequests ?? null,
        subtotal: new Prisma.Decimal(quote.subtotal),
        taxes: new Prisma.Decimal(taxes),
        discount: new Prisma.Decimal(0),
        totalAmount: new Prisma.Decimal(totalAmount),
        currency: "INR",
        status: "PENDING",
        expiresAt,
        BookingRoom: {
          create: {
            roomId: room.id,
            roomName: room.name,
            roomType: String(room.type),
            pricePerNight: new Prisma.Decimal(toMoney(quote.subtotal / quote.nights / input.quantity)),
            originalPrice: room.originalPrice ?? room.pricePerNight,
            quantity: input.quantity,
            adults: input.adults,
            children: input.children,
            checkIn: input.checkIn,
            checkOut: input.checkOut,
            nights: quote.nights,
            total: new Prisma.Decimal(quote.subtotal),
            inventoryReserved: true,
          },
        },
        InventoryReservation: {
          create: {
            roomId: room.id,
            checkIn: input.checkIn,
            checkOut: input.checkOut,
            quantity: input.quantity,
            expiresAt,
            status: "ACTIVE",
          },
        },
        Payment: {
          create: {
            userId,
            hostId: room.Hotel.hostId,
            amount: new Prisma.Decimal(totalAmount),
            hostEarnings: new Prisma.Decimal(hostEarnings),
            platformFee: new Prisma.Decimal(platformFee),
            currency: "INR",
            provider: "razorpay",
            status: "PENDING",
          },
        },
        BookingTimeline: {
          create: {
            type: "CREATED",
            title: "Booking hold created",
            message: `Inventory reserved for ${HOLD_MINUTES} minutes while payment is pending.`,
            metadata: { roomId: room.id, quantity: input.quantity, hotel: room.Hotel.title },
          },
        },
      },
      include: {
        Hotel: { select: { id: true, title: true, city: true } },
        BookingRoom: true,
        InventoryReservation: true,
        Payment: true,
      },
    })
  }, {
    isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    maxWait: 10000,
    timeout: 20000,
  })

  await sendBookingConfirmationEmail({
    to: booking.contactEmail,
    guestName: booking.contactName,
    bookingCode: booking.bookingCode,
    hotelName: booking.Hotel?.title ?? "GetHotels stay",
    city: booking.Hotel?.city,
    checkIn: booking.checkIn ?? input.checkIn,
    checkOut: booking.checkOut ?? input.checkOut,
    totalAmount: booking.totalAmount,
    currency: booking.currency,
    rooms: booking.BookingRoom.map((room) => ({
      roomName: room.roomName,
      quantity: room.quantity,
      nights: room.nights,
      pricePerNight: room.pricePerNight,
      total: room.total,
    })),
    bookingUrl: `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/profile`,
  }).catch((error) => {
    console.error("Failed to send booking confirmation email:", error)
  })

  return booking
}

export async function cancelHotelBooking(userId: string, id: string, reason = "Cancelled by guest") {
  return prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findFirst({
      where: { id, userId },
      include: {
        BookingRoom: true,
        InventoryReservation: true,
        Payment: true,
      },
    })

    if (!booking) throw new Error("Booking not found")
    if (booking.status === "CANCELLED") return booking
    if (!["PENDING", "CONFIRMED"].includes(booking.status)) {
      throw new Error("This booking can no longer be cancelled")
    }

    for (const bookingRoom of booking.BookingRoom) {
      if (!bookingRoom.inventoryReserved) continue

      await releaseReservedRoomInventory({
        roomId: bookingRoom.roomId,
        checkIn: bookingRoom.checkIn,
        checkOut: bookingRoom.checkOut,
        quantity: bookingRoom.quantity,
      }, tx)
    }

    await tx.inventoryReservation.updateMany({
      where: { bookingId: booking.id, status: "ACTIVE" },
      data: { status: "CANCELLED" },
    })

    await tx.bookingRoom.updateMany({
      where: { bookingId: booking.id },
      data: { inventoryReserved: false },
    })

    if (booking.Payment && booking.Payment.status !== "REFUNDED") {
      await tx.payment.update({
        where: { bookingId: booking.id },
        data: {
          status: booking.Payment.status === "SUCCESS" ? "REFUNDED" : "FAILED",
          refundedAt: booking.Payment.status === "SUCCESS" ? new Date() : null,
          refundReason: booking.Payment.status === "SUCCESS" ? reason : null,
        },
      })
    }

    return tx.booking.update({
      where: { id: booking.id },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date(),
        cancellationReason: reason,
        BookingTimeline: {
          create: {
            type: "CANCELLED",
            title: "Booking cancelled",
            message: "Reserved room inventory was released back to the calendar.",
          },
        },
      },
      include: {
        Hotel: { select: { id: true, title: true, city: true } },
        BookingRoom: { include: { Room: { select: { id: true, name: true } } } },
        Payment: true,
      },
    })
  }, {
    isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    maxWait: 10000,
    timeout: 20000,
  })
}
