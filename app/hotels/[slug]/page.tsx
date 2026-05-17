'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header/Header'
import Footer from '@/components/layout/Footer/Footer'
import type { FilledIconProps, IconProps } from '@/types/component-props'
import type { Hotel } from '@/lib/hotels'
import { useWishlist } from '@/contexts/WishlistContext'
import HotelGallery from '@/components/hotel/HotelGallery'
import HotelReviews from '@/components/hotel/HotelReviews'
import MapSection from '@/components/hotel/MapSection'
import api, { getApiErrorMessage } from '@/lib/axios'
import {
  BadgeCheck,
  Banknote,
  ConciergeBell,
  CreditCard,
  MapPinned,
  MessageCircle,
  ShieldCheck,
  Sparkles as LucideSparkles,
} from 'lucide-react'

const StarIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" /></svg>
)
const MapPinIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
)
const HeartIcon = ({ className = 'w-5 h-5', filled = false }: FilledIconProps) => (
  <svg className={className} fill={filled ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
)
const ShareIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" /></svg>
)
const CheckCircleIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
)
const CalendarIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
)
const UsersIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
)
const ShieldIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
)
const CameraIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" /></svg>
)
const ClockIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
)
const SparklesIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" /></svg>
)
const BoltIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
)
const XMarkIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
)

const PoolIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 20.25c1.5 0 2.25-.75 3-1.5s1.5-1.5 3-1.5 2.25.75 3 1.5 1.5 1.5 3 1.5 2.25-.75 3-1.5 1.5-1.5 3-1.5M3 16.5c1.5 0 2.25-.75 3-1.5s1.5-1.5 3-1.5 2.25.75 3 1.5 1.5 1.5 3 1.5 2.25-.75 3-1.5 1.5-1.5 3-1.5M6 3v10M18 3v10" /></svg>
)
const UtensilsIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.38a48.474 48.474 0 00-6-.37c-2.032 0-4.034.126-6 .37m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.17c0 .62-.504 1.124-1.125 1.124H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12.265 3.11a.375.375 0 11-.53 0L12 2.845l.265.265z" /></svg>
)
const DumbbellIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" /></svg>
)
const WifiIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" /></svg>
)
const CarIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>
)
const BellIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>
)
const HomeIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
)
const ThermometerIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
)

const amenityIcons: Record<string, typeof PoolIcon> = {
  'Swimming Pool': PoolIcon,
  'Restaurant': UtensilsIcon,
  'Gym': DumbbellIcon,
  'WiFi': WifiIcon,
  'Parking': CarIcon,
  'Concierge': BellIcon,
  'Daily Housekeeping': HomeIcon,
  'Climate Control': ThermometerIcon,
}

const amenityColors: Record<string, string> = {
  'Swimming Pool': 'text-blue-600 bg-blue-50',
  'Restaurant': 'text-orange-600 bg-orange-50',
  'Gym': 'text-emerald-600 bg-emerald-50',
  'WiFi': 'text-violet-600 bg-violet-50',
  'Parking': 'text-slate-600 bg-slate-100',
  'Concierge': 'text-amber-600 bg-amber-50',
  'Daily Housekeeping': 'text-rose-600 bg-rose-50',
  'Climate Control': 'text-cyan-600 bg-cyan-50',
}

const amenityList = [
  'Swimming Pool', 'Restaurant', 'Gym', 'WiFi',
  'Parking', 'Concierge', 'Daily Housekeeping', 'Climate Control',
]

type HotelRoom = {
  id: string
  name: string
  type: string
  description?: string | null
  pricePerNight: number | string
  originalPrice?: number | string | null
  capacity: number
  totalRooms: number
  availableRooms?: number
  dateAvailableRooms?: number
  isAvailableForDates?: boolean
  bedConfiguration?: string | null
  sizeSqFt?: number | null
  viewType?: string | null
  amenities?: string[]
  images?: string[]
}

type HotelDetail = Hotel & {
  Room?: HotelRoom[]
}

const getDateInputValue = (offsetDays = 0) => {
  const date = new Date()
  date.setDate(date.getDate() + offsetDays)
  return date.toISOString().split('T')[0]
}

const todayInputValue = getDateInputValue()
const tomorrowInputValue = getDateInputValue(1)

const BedIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" /></svg>
)
const ExpandIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" /></svg>
)

export default function HotelDetailPage() {
  const params = useParams()
  const slug = typeof params.slug === 'string' ? params.slug : ''
  const [hotel, setHotel] = useState<HotelDetail | null>(null);
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const liked = isInWishlist(slug, 'hotel')
  const handleWishlist = () => {
    if (liked) {
      removeFromWishlist(slug, 'hotel')
    } else {
      addToWishlist({
        id: hotel?.id ?? slug,
        slug: hotel?.slug ?? slug,
        title: hotel?.title ?? '',
        image: hotel?.image ?? '',
        price: hotel?.price ?? 0,
        type: 'hotel',
      })
    }
  }
  const [copied, setCopied] = useState(false)
  const [showStickyNav, setShowStickyNav] = useState(false)
  const [guests, setGuests] = useState(1)
  const [activeTab, setActiveTab] = useState<'rooms' | 'amenities' | 'reviews' | 'rules'>('rooms')
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [bookingStep, setBookingStep] = useState<1 | 2 | 3>(1)
  const [selectedRoom, setSelectedRoom] = useState('')
  const [checkIn, setCheckIn] = useState(todayInputValue)
  const [checkOut, setCheckOut] = useState(tomorrowInputValue)
  const [specialRequests, setSpecialRequests] = useState('')
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [bookingConfirmed, setBookingConfirmed] = useState(false)
  const [bookingId, setBookingId] = useState('')
  const [bookingError, setBookingError] = useState('')
  const [bookingLoading, setBookingLoading] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowStickyNav(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(()=>{
    const fetchbySlug = async () => {
      try {
        const params = new URLSearchParams()
        if (checkIn && checkOut) {
          params.set('checkIn', checkIn)
          params.set('checkOut', checkOut)
        }
        const { data } = await api.get(`/hotel/${slug}${params.toString() ? `?${params.toString()}` : ''}`)
          const raw = data.data
          const minPrice = raw.Room?.length
            ? Math.min(...raw.Room.map((r: { pricePerNight: number }) => r.pricePerNight))
            : 0
          const normalized = {
            ...raw,
            title: raw.title ?? raw.name,
            gallery: (raw.HotelImage ?? []).map((img: { url: string }) => img.url),
            price: minPrice,
            rating: raw.averageRating ?? 0,
            location: raw.address ? `${raw.address}, ${raw.city}` : raw.city,
            reviews: (raw.Review ?? []).map((r: { id: string; rating: number; comment: string; createdAt: string; User?: { name?: string } }) => ({
              id: r.id,
              name: r.User?.name ?? 'Guest',
              rating: r.rating,
              text: r.comment ?? '',
              date: new Date(r.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            })),
            rules: (raw.HotelRule ?? []).map((r: { rule: string }) => r.rule),
          }
          setHotel(normalized)
          const rooms = (raw.Room ?? []) as HotelRoom[]
          if (rooms.length > 0 && (!selectedRoom || !rooms.some((room) => room.id === selectedRoom))) {
            setSelectedRoom(rooms[0].id)
          }
      } catch (error) {
        console.error('Error fetching hotel data:', error)
      }
    }
    if (slug) {
      fetchbySlug()
    }
  }, [slug, checkIn, checkOut, selectedRoom]);

  useEffect(() => {
    if (showBookingModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [showBookingModal])


  if (!hotel) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4 animate-fade-in-up">
            <div className="w-20 h-20 mx-auto rounded-full bg-slate-100 flex items-center justify-center">
              <BedIcon className="w-8 h-8 text-slate-400" />
            </div>
            <h1 className="text-2xl font-semibold text-slate-900">Hotel Not Found</h1>
            <p className="text-slate-500">The property you&apos;re looking for doesn&apos;t exist.</p>
            <Link href="/hotels" className="inline-flex items-center gap-2 text-sm font-medium text-slate-900 hover:underline">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Browse all hotels
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: hotel.title, url: window.location.href })
    } else {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const todayStr = todayInputValue
  const tomorrowStr = tomorrowInputValue
  const rooms = hotel.Room ?? []
  const firstRoom = rooms[0]
  const secondRoom = rooms[1]
  const selectedRoomData = rooms.find((room) => room.id === selectedRoom) ?? rooms[0]
  const hasDateRange = Boolean(checkIn && checkOut)
  const selectedRoomAvailableCount = hasDateRange
    ? selectedRoomData?.dateAvailableRooms ?? selectedRoomData?.totalRooms ?? 0
    : selectedRoomData?.totalRooms ?? 0
  const selectedRoomIsAvailable = Boolean(selectedRoomData && selectedRoomAvailableCount > 0)

  const roomPrice = Number(selectedRoomData?.pricePerNight ?? hotel.price)
  const nights = checkIn && checkOut ? Math.max(1, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000)) : 1
  const subtotal = roomPrice * nights
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0
  const tax = Math.round((subtotal - discount) * 0.12)
  const total = subtotal - discount + tax
  const stayHighlights = [
    {
      icon: ShieldCheck,
      title: 'Verified host',
      text: 'Property details, amenities, and guest policies are reviewed for cleaner decisions.',
      color: 'bg-emerald-50 text-emerald-700',
    },
    {
      icon: CreditCard,
      title: 'Secure checkout',
      text: 'Transparent taxes, promo savings, and room totals before confirmation.',
      color: 'bg-blue-50 text-blue-700',
    },
    {
      icon: ConciergeBell,
      title: 'Stay support',
      text: 'Get help with check-in, room requests, and local arrangements during your trip.',
      color: 'bg-violet-50 text-violet-700',
    },
    {
      icon: MapPinned,
      title: 'Prime area',
      text: `Easy access around ${hotel.city} with nearby experiences and flexible tour planning.`,
      color: 'bg-rose-50 text-rose-700',
    },
  ]
  const localConfidence = [
    { label: 'Check-in flow', value: 'Digital + desk', icon: BadgeCheck },
    { label: 'Best for', value: 'Couples, families', icon: ConciergeBell },
    { label: 'Payments', value: 'Cards and UPI', icon: CreditCard },
  ]
  const arrivalPlan = [
    'Reserve room and confirm guest details',
    `Reach ${hotel.city} and use the in-app location guide`,
    'Meet the concierge for local dining and activity picks',
  ]

  const openBooking = (roomId?: string) => {
    if (roomId) setSelectedRoom(roomId)
    setBookingStep(1)
    setBookingConfirmed(false)
    setBookingError('')
    setShowBookingModal(true)
  }

  const handleApplyPromo = () => {
    if (promoCode.trim().toLowerCase() === 'gethotels10') {
      setPromoApplied(true)
    }
  }

  const handleConfirmBooking = async () => {
    if (!selectedRoomData) return

    setBookingLoading(true)
    setBookingError('')

    try {
      const { data: result } = await api.post('/booking', {
          hotelId: hotel.id,
          roomId: selectedRoomData.id,
          checkIn,
          checkOut,
          quantity: 1,
          adults: guests,
          children: 0,
          infants: 0,
          contactName,
          contactEmail,
          contactPhone,
          specialRequests,
      })

      setBookingId(result?.data?.bookingCode ?? result?.data?.id ?? '')
      setBookingStep(3)
      setBookingConfirmed(true)
    } catch (error) {
      setBookingError(getApiErrorMessage(error, 'Could not create booking'))
    } finally {
      setBookingLoading(false)
    }
  }

  const closeBookingModal = () => {
    setShowBookingModal(false)
    if (bookingConfirmed) {
      setBookingStep(1)
      setBookingConfirmed(false)
      setPromoCode('')
      setPromoApplied(false)
      setSpecialRequests('')
      setContactName('')
      setContactEmail('')
      setContactPhone('')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Header />
      <main>

        <section className="relative h-[50vh] min-h-[380px] max-h-[520px] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 scale-105"
            style={{ backgroundImage: `url(${hotel.gallery[0]})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

          {/* Top bar */}
          <div className="absolute top-0 inset-x-0 z-10">
            <div className="container mx-auto px-4 max-w-7xl py-5 flex items-center justify-between">
              <nav className="flex items-center gap-2 text-sm">
                <Link href="/" className="text-white/70 hover:text-white transition">Home</Link>
                <span className="text-white/40">/</span>
                <Link href="/hotels" className="text-white/70 hover:text-white transition">Hotels</Link>
                <span className="text-white/40">/</span>
                <span className="text-white font-medium truncate max-w-[180px]">{hotel.title}</span>
              </nav>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleWishlist}
                  className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 duration-200"
                >
                  <HeartIcon className={`w-5 h-5 transition-colors ${liked ? 'text-red-400 fill-red-400' : 'text-white'}`} filled={liked} />
                </button>
                <button
                  onClick={handleShare}
                  className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 duration-200 relative"
                >
                  <ShareIcon className="w-5 h-5 text-white" />
                  {copied && (
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded whitespace-nowrap">
                      Link copied!
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Hero content */}
          <div className="absolute bottom-0 inset-x-0">
            <div className="container mx-auto px-4 max-w-7xl pb-8">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="space-y-3 animate-fade-in-up">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-medium border border-white/20">
                    <SparklesIcon className="w-3.5 h-3.5" />
                    Premium Property
                  </span>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight drop-shadow-lg">
                    {hotel.title}
                  </h1>
                  <div className="flex items-center gap-4 flex-wrap text-sm">
                    <div className="flex items-center gap-1.5">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon key={i} className={`w-4 h-4 ${i < Math.floor(hotel.rating) ? 'text-amber-400' : 'text-white/30'}`} />
                        ))}
                      </div>
                      <span className="text-white font-semibold">{hotel.rating.toFixed(1)}</span>
                      <span className="text-white/60">({hotel.reviews?.length || 0} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white/80">
                      <MapPinIcon className="w-4 h-4" />
                      <span>{hotel.location}</span>
                    </div>
                  </div>
                </div>

                {/* Price card */}
                <div className="glass-white rounded-2xl px-6 py-4 shadow-xl min-w-[180px] text-center animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Starting from</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">₹{hotel.price.toLocaleString()}</p>
                  <p className="text-xs text-slate-500 mt-0.5">per night</p>
                  <button onClick={() => openBooking()} className="mt-3 w-full py-2 rounded-xl bg-gradient-to-r from-slate-900 to-slate-700 text-white text-sm font-semibold hover:shadow-lg transition-shadow">
                    Reserve Now
                  </button>
                </div>
              </div>

              <button className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-medium border border-white/20 hover:bg-white/25 transition">
                <CameraIcon className="w-4 h-4" />
                {hotel.gallery.length} Photos
              </button>
            </div>
          </div>
        </section>

        {/* ── Sticky Nav ───────────────────────────────── */}
        <div className={`sticky top-[72px] z-40 transition-all duration-300 ${showStickyNav ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}>
          <div className="bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm">
            <div className="container mx-auto px-4 max-w-7xl">
              <div className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                    <BedIcon className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-slate-900 truncate max-w-[200px] md:max-w-none">{hotel.title}</h2>
                    <p className="text-xs text-slate-500">₹{hotel.price.toLocaleString()} per night</p>
                  </div>
                </div>
                <button onClick={() => openBooking()} className="px-5 py-2 bg-gradient-to-r from-slate-900 to-slate-700 text-white font-semibold rounded-xl text-xs hover:shadow-lg transition-shadow">
                  Reserve Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Quick Stats ──────────────────────────────── */}
        <section className="bg-white border-b border-slate-100">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100">
              {[
                { icon: StarIcon, label: 'Rating', value: `${hotel.rating.toFixed(1)}/5`, color: 'text-amber-600 bg-amber-50' },
                { icon: UsersIcon, label: 'Reviews', value: `${hotel.reviews?.length || 0} reviews`, color: 'text-blue-600 bg-blue-50' },
                { icon: MapPinIcon, label: 'Location', value: hotel.city, color: 'text-rose-600 bg-rose-50' },
                { icon: ClockIcon, label: 'Support', value: '24/7 Available', color: 'text-emerald-600 bg-emerald-50' },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-3 py-6 px-4 first:pl-0 last:pr-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                    <p className="text-sm font-semibold text-slate-900">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-10 md:py-14 max-w-7xl">

          <section className="mb-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stayHighlights.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                <div className={`mb-4 flex size-11 items-center justify-center rounded-xl ${item.color}`}>
                  <item.icon className="size-5" />
                </div>
                <h2 className="text-base font-bold text-slate-900">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
              </div>
            ))}
          </section>

          <section className="mb-14 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
              <div className="bg-[linear-gradient(135deg,#0f172a_0%,#1f2937_52%,#0e7490_100%)] p-6 text-white sm:p-8">
                <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/75">
                  <LucideSparkles className="size-3.5" />
                  Stay planner
                </p>
                <h2 className="mt-5 max-w-xl text-2xl font-bold tracking-tight sm:text-3xl">A more complete stay view before you book.</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
                  Compare the room, area, support, and arrival experience in one place so the page feels closer to a real booking product.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {localConfidence.map((item) => (
                    <div key={item.label} className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                      <item.icon className="size-5 text-cyan-200" />
                      <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45">{item.label}</p>
                      <p className="mt-1 text-sm font-bold text-white">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Arrival checklist</p>
                <div className="mt-5 space-y-4">
                  {arrivalPlan.map((item, index) => (
                    <div key={item} className="flex gap-4">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-950">{item}</p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">This keeps the booking journey clear and less generic.</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── Gallery ────────────────────────────────── */}
          <section className="mb-14">
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <HotelGallery gallery={hotel.gallery} title={hotel.title} />
            </div>
          </section>

          {/* ── About + Map row ────────────────────────── */}
          <section className="mb-14 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            {/* About */}
            <div className="space-y-5 animate-fade-in-up">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-slate-900">About This Property</h2>
                <div className="w-16 h-1 rounded-full bg-gradient-to-r from-slate-900 to-slate-500 mt-3" />
              </div>
              <p className="text-base text-slate-600 leading-relaxed">{hotel.description}</p>
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200">
                {[
                  { icon: StarIcon, value: hotel.rating.toFixed(1), label: 'Guest Rating', color: 'text-amber-500' },
                  { icon: UsersIcon, value: `${hotel.reviews?.length || 0}`, label: 'Reviews', color: 'text-blue-500' },
                  { icon: ShieldIcon, value: '24/7', label: 'Support', color: 'text-emerald-500' },
                ].map((stat, i) => (
                  <div key={i} className="text-center bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
                    <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
                    <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-slate-900">Location</h2>
                  <div className="w-16 h-1 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 mt-3" />
                </div>
              </div>
              <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-3 shadow-sm">
                <MapSection hotelId={hotel.slug} title={hotel.title} price={hotel.price} location={hotel.location} city={hotel.city} rating={hotel.rating} image={hotel.gallery?.[0]} />
              </div>
            </div>
          </section>

          {/* ── Tab Navigation ─────────────────────────── */}
          <section className="mb-2">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1 border-b border-slate-200">
              {[
                { key: 'rooms' as const, label: 'Rooms', icon: BedIcon },
                { key: 'amenities' as const, label: 'Amenities', icon: SparklesIcon },
                { key: 'reviews' as const, label: 'Reviews', icon: StarIcon },
                { key: 'rules' as const, label: 'House Rules', icon: ShieldIcon },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-2 px-5 py-3 font-medium text-xs uppercase tracking-wider transition-all rounded-lg my-1 whitespace-nowrap ${
                    activeTab === key
                      ? 'text-slate-900 bg-slate-100 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </section>

          {/* ── Main Content Grid ──────────────────────── */}
          <div className="grid gap-10 lg:grid-cols-3 pt-8">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-14">

              {/* Rooms Tab */}
              {activeTab === 'rooms' && (
                <section className="animate-fade-in-up">
                  <div className="mb-8">
                    <h2 className="text-2xl lg:text-3xl font-bold text-slate-900">Select Your Room</h2>
                    <div className="w-16 h-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 mt-3" />
                    <p className="text-slate-500 mt-3">Choose from our carefully designed room types</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Deluxe Room */}
                    <div className="group rounded-2xl border border-slate-200 bg-white overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-slate-300">
                      <div className="h-44 bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
                        {hotel.gallery[1] && (
                          <img src={hotel.gallery[1]} alt="Deluxe Room" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        )}
                        <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-bold text-slate-900 shadow-sm">
                          Most Popular
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-1">Deluxe Room</h3>
                        <p className="text-xs text-slate-500 mb-5">King bed with city view</p>
                        <div className="flex items-end justify-between mb-5">
                          <div>
                            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Per Night</p>
                            <div className="flex items-baseline gap-2">
                              <p className="text-2xl font-bold text-slate-900">₹{hotel.price.toLocaleString()}</p>
                              <span className="text-xs text-slate-400 line-through">₹{Math.round(hotel.price * 1.2).toLocaleString()}</span>
                            </div>
                          </div>
                          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                            <CheckCircleIcon className="w-3.5 h-3.5" />
                            Available
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-5 pb-5 border-b border-slate-100">
                          <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600">
                            <ExpandIcon className="w-3.5 h-3.5" /> 40 m²
                          </span>
                          <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600">
                            <UsersIcon className="w-3.5 h-3.5" /> 2 guests
                          </span>
                          <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600">
                            <WifiIcon className="w-3.5 h-3.5" /> Free WiFi
                          </span>
                        </div>
                        <button
                          onClick={() => firstRoom && ((hasDateRange ? firstRoom.dateAvailableRooms ?? firstRoom.totalRooms : firstRoom.totalRooms) > 0) ? openBooking(firstRoom.id) : undefined}
                          disabled={!firstRoom || ((hasDateRange ? firstRoom.dateAvailableRooms ?? firstRoom.totalRooms : firstRoom.totalRooms) <= 0)}
                          className={`w-full py-2.5 px-3 rounded-xl text-sm font-semibold transition-shadow ${firstRoom && ((hasDateRange ? firstRoom.dateAvailableRooms ?? firstRoom.totalRooms : firstRoom.totalRooms) > 0) ? 'bg-gradient-to-r from-slate-900 to-slate-700 text-white hover:shadow-lg' : 'bg-slate-200 text-slate-500 cursor-not-allowed'}`}
                        >
                          {firstRoom && ((hasDateRange ? firstRoom.dateAvailableRooms ?? firstRoom.totalRooms : firstRoom.totalRooms) > 0) ? 'Select Room' : 'Not available'}
                        </button>
                      </div>
                    </div>

                    {/* Premium Suite */}
                    <div className="group rounded-2xl border border-slate-200 bg-white overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-slate-300">
                      <div className="h-44 bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
                        {hotel.gallery[2] && (
                          <img src={hotel.gallery[2]} alt="Premium Suite" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        )}
                        <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-xs font-bold text-white shadow-sm">
                          Premium
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-1">Premium Suite</h3>
                        <p className="text-xs text-slate-500 mb-5">Spacious with lounge area & balcony</p>
                        <div className="flex items-end justify-between mb-5">
                          <div>
                            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Per Night</p>
                            <div className="flex items-baseline gap-2">
                              <p className="text-2xl font-bold text-slate-900">₹{Math.round(hotel.price * 1.5).toLocaleString()}</p>
                              <span className="text-xs text-slate-400 line-through">₹{Math.round(hotel.price * 1.8).toLocaleString()}</span>
                            </div>
                          </div>
                          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                            <CheckCircleIcon className="w-3.5 h-3.5" />
                            Available
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-5 pb-5 border-b border-slate-100">
                          <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600">
                            <ExpandIcon className="w-3.5 h-3.5" /> 60 m²
                          </span>
                          <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600">
                            <UsersIcon className="w-3.5 h-3.5" /> 3 guests
                          </span>
                          <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600">
                            <BedIcon className="w-3.5 h-3.5" /> King Bed
                          </span>
                        </div>
                        <button
                          onClick={() => secondRoom && ((hasDateRange ? secondRoom.dateAvailableRooms ?? secondRoom.totalRooms : secondRoom.totalRooms) > 0) ? openBooking(secondRoom.id) : undefined}
                          disabled={!secondRoom || ((hasDateRange ? secondRoom.dateAvailableRooms ?? secondRoom.totalRooms : secondRoom.totalRooms) <= 0)}
                          className={`w-full py-2.5 px-3 rounded-xl text-sm font-semibold transition-shadow ${secondRoom && ((hasDateRange ? secondRoom.dateAvailableRooms ?? secondRoom.totalRooms : secondRoom.totalRooms) > 0) ? 'bg-gradient-to-r from-slate-900 to-slate-700 text-white hover:shadow-lg' : 'bg-slate-200 text-slate-500 cursor-not-allowed'}`}
                        >
                          {secondRoom && ((hasDateRange ? secondRoom.dateAvailableRooms ?? secondRoom.totalRooms : secondRoom.totalRooms) > 0) ? 'Select Room' : 'Not available'}
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Amenities Tab */}
              {activeTab === 'amenities' && (
                <section className="animate-fade-in-up">
                  <div className="mb-8">
                    <h2 className="text-2xl lg:text-3xl font-bold text-slate-900">Hotel Amenities</h2>
                    <div className="w-16 h-1 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 mt-3" />
                    <p className="text-slate-500 mt-3">Everything you need for a comfortable stay</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {amenityList.map((name, idx) => {
                      const Icon = amenityIcons[name] || SparklesIcon
                      const color = amenityColors[name] || 'text-slate-600 bg-slate-100'
                      return (
                        <div
                          key={idx}
                          className="group p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-md transition-all duration-300"
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color} group-hover:scale-110 transition-transform`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <h4 className="text-sm font-semibold text-slate-900">{name}</h4>
                          <p className="text-[11px] text-slate-400 mt-1">Available 24/7</p>
                        </div>
                      )
                    })}
                  </div>

                  {/* Why Stay With Us */}
                  <div className="mt-10 rounded-2xl bg-white border border-slate-200 p-7">
                    <h3 className="text-xl font-bold text-slate-900 mb-6">Why Stay With Us</h3>
                    <div className="grid sm:grid-cols-2 gap-5">
                      {[
                        { icon: ShieldIcon, title: 'Secure Booking', desc: 'SSL encrypted payments & full refund on cancellation', color: 'text-emerald-600 bg-emerald-50' },
                        { icon: BoltIcon, title: 'Instant Confirmation', desc: 'Get confirmed booking within seconds', color: 'text-blue-600 bg-blue-50' },
                        { icon: ClockIcon, title: '24/7 Support', desc: 'Round-the-clock concierge assistance', color: 'text-purple-600 bg-purple-50' },
                        { icon: CheckCircleIcon, title: 'Best Price', desc: 'Price match guarantee across all platforms', color: 'text-amber-600 bg-amber-50' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${item.color}`}>
                            <item.icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 text-sm">{item.title}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <section className="animate-fade-in-up">
                  <div className="mb-8">
                    <h2 className="text-2xl lg:text-3xl font-bold text-slate-900">Guest Reviews</h2>
                    <div className="w-16 h-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 mt-3" />
                    <p className="text-slate-500 mt-3">What our guests are saying</p>
                  </div>
                  <HotelReviews initialReviews={hotel.reviews || []} />
                </section>
              )}

              {/* House Rules Tab */}
              {activeTab === 'rules' && (
                <section className="animate-fade-in-up">
                  <div className="mb-8">
                    <h2 className="text-2xl lg:text-3xl font-bold text-slate-900">House Rules</h2>
                    <div className="w-16 h-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 mt-3" />
                    <p className="text-slate-500 mt-3">Please review our property guidelines</p>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 p-7 shadow-sm">
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100 p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                            <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Check-in</p>
                            <p className="font-bold text-slate-900">2:00 PM onwards</p>
                          </div>
                        </div>
                      </div>
                      <div className="rounded-xl bg-gradient-to-br from-rose-50 to-red-50 border border-rose-100 p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center">
                            <svg className="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Check-out</p>
                            <p className="font-bold text-slate-900">Before 12:00 PM</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {(hotel.rules || [
                        'Check-in from 2:00 PM',
                        'Check-out by 12:00 PM',
                        'No smoking in rooms',
                        'Pets not allowed',
                        'Quiet hours from 11:00 PM to 7:00 AM',
                      ]).map((rule, i) => (
                        <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-slate-50/80 hover:bg-slate-50 transition-colors">
                          <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-slate-600">{i + 1}</span>
                          </div>
                          <p className="text-sm text-slate-700 font-medium">{rule}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}
            </div>

            {/* ── Sidebar ──────────────────────────────── */}
            <aside className="space-y-6">
              <div className="lg:sticky lg:top-36 space-y-6 lg:max-h-[calc(100vh-10rem)] lg:overflow-y-auto scrollbar-thin">
                {/* Booking Card */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
                  <div className="border-b border-slate-100 bg-slate-950 p-5 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
                          <LucideSparkles className="size-3.5" />
                          Best available rate
                        </p>
                        <h3 className="mt-2 text-lg font-bold">Book Your Stay</h3>
                      </div>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-200">
                        <BadgeCheck className="size-3.5" />
                        Available
                      </span>
                    </div>
                    <div className="mt-5 flex items-end justify-between">
                      <div>
                        <p className="text-xs text-white/55">Starts from</p>
                        <p className="text-2xl font-bold">Rs. {hotel.price.toLocaleString()}</p>
                      </div>
                      <p className="text-xs font-medium text-white/55">per night</p>
                    </div>
                  </div>
                  <div className="p-6">

                  {/* Date Selection */}
                  <div className="space-y-3 mb-5 pb-5 border-b border-slate-100">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">Check In</label>
                      <div className="relative">
                        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="date"
                          min={todayStr}
                          value={checkIn}
                          onChange={(e) => {
                            setCheckIn(e.target.value)
                            if (checkOut && e.target.value >= checkOut) setCheckOut('')
                          }}
                          className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">Check Out</label>
                      <div className="relative">
                        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="date"
                          min={checkIn || tomorrowStr}
                          value={checkOut}
                          onChange={(e) => setCheckOut(e.target.value)}
                          className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">Guests</label>
                      <div className="flex items-center gap-2 border border-slate-200 rounded-xl p-1">
                        <button
                          onClick={() => setGuests(Math.max(1, guests - 1))}
                          className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition text-sm font-semibold text-slate-700"
                        >
                          −
                        </button>
                        <div className="flex-1 text-center">
                          <span className="text-sm font-bold text-slate-900">{guests}</span>
                          <span className="text-xs text-slate-400 ml-1">{guests === 1 ? 'guest' : 'guests'}</span>
                        </div>
                        <button
                          onClick={() => setGuests(Math.min(8, guests + 1))}
                          className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition text-sm font-semibold text-slate-700"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-2.5 mb-5 pb-5 border-b border-slate-100">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">{selectedRoomData?.name ?? 'Room'} × {nights} {nights === 1 ? 'night' : 'nights'}</span>
                      <span className="font-semibold text-slate-900">₹{subtotal.toLocaleString()}</span>
                    </div>
                    {promoApplied && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-emerald-600">Promo discount</span>
                        <span className="font-semibold text-emerald-600">-₹{discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Taxes & fees (12%)</span>
                      <span className="font-semibold text-slate-900">₹{tax.toLocaleString()}</span>
                    </div>
                    <div className="pt-3 flex justify-between items-center border-t border-slate-200">
                      <span className="font-bold text-slate-900 text-sm">Total</span>
                      <span className="text-lg font-bold text-slate-900">₹{total.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <button onClick={() => openBooking()} className="w-full py-3 rounded-xl bg-gradient-to-r from-slate-900 to-slate-700 text-white font-semibold text-sm hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 mb-2">
                    <CalendarIcon className="w-4 h-4" />
                    Reserve Now
                  </button>

                  <button
                    onClick={handleWishlist}
                    className={`w-full py-2.5 rounded-xl border text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                      liked
                        ? 'border-red-200 bg-red-50 text-red-600'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <HeartIcon className="w-4 h-4" filled={liked} />
                    {liked ? 'Saved to Wishlist' : 'Add to Wishlist'}
                  </button>

                  {/* Trust Badges */}
                  <div className="mt-5 pt-5 border-t border-slate-100 space-y-2.5">
                    {[
                      { icon: CheckCircleIcon, text: 'Free cancellation up to 48 hours' },
                      { icon: MessageCircle, text: 'Host and trip support included' },
                      { icon: Banknote, text: 'Best price guaranteed' },
                    ].map((badge) => (
                      <div key={badge.text} className="flex items-center gap-2 text-xs">
                        <badge.icon className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span className="text-slate-600">{badge.text}</span>
                      </div>
                    ))}
                  </div>
                  </div>
                </div>

                {/* Property Details */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                  <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
                    Property Details
                  </h4>
                  <div className="space-y-3 text-sm">
                    {[
                      { label: 'Location', value: hotel.location, icon: MapPinIcon },
                      { label: 'Check-in', value: '2:00 PM onwards', icon: ClockIcon },
                      { label: 'Check-out', value: 'Before 12:00 PM', icon: ClockIcon },
                    ].map((info, i) => (
                      <div key={i} className={`flex items-center gap-3 ${i < 2 ? 'pb-3 border-b border-slate-100' : ''}`}>
                        <info.icon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{info.label}</p>
                          <p className="font-medium text-slate-900 text-sm">{info.value}</p>
                        </div>
                      </div>
                    ))}

                    {/* Rating in details */}
                    <div className="pt-3 border-t border-slate-100">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Rating</p>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50">
                          <StarIcon className="w-4 h-4 text-amber-500" />
                          <span className="text-sm font-bold text-amber-700">{hotel.rating.toFixed(1)}</span>
                        </div>
                        <span className="text-xs text-slate-500">{hotel.reviews?.length || 0} reviews</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reviews Summary */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-slate-900">Reviews Summary</h4>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50">
                      <StarIcon className="w-4 h-4 text-amber-500" />
                      <span className="text-sm font-bold text-amber-700">{hotel.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mb-4">Based on {hotel.reviews?.length || 0} verified reviews</p>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const pct = star === 5 ? 60 : star === 4 ? 25 : star === 3 ? 10 : star === 2 ? 3 : 2
                      return (
                        <div key={star} className="flex items-center gap-2.5 text-xs">
                          <div className="flex items-center gap-0.5 w-10">
                            <span className="text-slate-600 font-medium">{star}</span>
                            <StarIcon className="w-3 h-3 text-amber-400" />
                          </div>
                          <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div className="bg-gradient-to-r from-amber-400 to-amber-500 h-2 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-slate-400 w-8 text-right font-medium">{pct}%</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* ── Floating CTA ─────────────────────────────── */}
        <button className="fixed bottom-6 right-6 z-50 group" onClick={() => openBooking()}>
          <div className="flex items-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-slate-900 to-slate-700 text-white font-semibold rounded-2xl shadow-2xl shadow-slate-900/25 hover:shadow-slate-900/40 transition-all duration-300 hover:scale-105 active:scale-95 text-sm">
            <CalendarIcon className="w-4 h-4" />
            Reserve · ₹{hotel.price.toLocaleString()}/night
          </div>
        </button>

        {/* ── Booking Modal ────────────────────────────── */}
        {showBookingModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeBookingModal} />

            {/* Modal */}
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in-up">
              {/* Close */}
              <button onClick={closeBookingModal} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition">
                <XMarkIcon className="w-4 h-4 text-slate-600" />
              </button>

              {/* Header */}
              <div className="px-6 pt-6 pb-4 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 pr-8">
                  {bookingConfirmed ? 'Booking Confirmed!' : 'Complete Your Reservation'}
                </h2>
                <p className="text-sm text-slate-500 mt-1">{hotel.title}</p>

                {/* Steps indicator */}
                {!bookingConfirmed && (
                  <div className="flex items-center gap-2 mt-4">
                    {[1, 2, 3].map((step) => (
                      <div key={step} className="flex items-center gap-2 flex-1">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                          bookingStep >= step
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-400'
                        }`}>
                          {bookingStep > step ? (
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          ) : step}
                        </div>
                        {step < 3 && <div className={`flex-1 h-0.5 rounded-full ${bookingStep > step ? 'bg-slate-900' : 'bg-slate-200'}`} />}
                      </div>
                    ))}
                  </div>
                )}
                {!bookingConfirmed && (
                  <div className="flex justify-between mt-1.5 px-1">
                    <span className="text-[10px] text-slate-400 font-medium">Room & Dates</span>
                    <span className="text-[10px] text-slate-400 font-medium">Guest Info</span>
                    <span className="text-[10px] text-slate-400 font-medium">Confirm</span>
                  </div>
                )}
              </div>

              <div className="px-6 py-5">

                {/* ── Step 1: Room & Dates ────── */}
                {bookingStep === 1 && !bookingConfirmed && (
                  <div className="space-y-5">
                    {/* Room Selection */}
                    <div>
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2.5">Select Room</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => firstRoom && ((hasDateRange ? firstRoom.dateAvailableRooms ?? firstRoom.totalRooms : firstRoom.totalRooms) > 0) ? setSelectedRoom(firstRoom.id) : undefined}
                          disabled={!firstRoom || ((hasDateRange ? firstRoom.dateAvailableRooms ?? firstRoom.totalRooms : firstRoom.totalRooms) <= 0)}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            selectedRoom === firstRoom?.id
                              ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900/10'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <BedIcon className="w-4 h-4 text-slate-600" />
                            <span className="text-sm font-bold text-slate-900">Deluxe</span>
                          </div>
                          <p className="text-xs text-slate-500 mb-2">King bed · 40 m²</p>
                          <p className="text-base font-bold text-slate-900">₹{hotel.price.toLocaleString()}<span className="text-xs font-normal text-slate-400">/night</span></p>
                        </button>
                        <button
                          onClick={() => secondRoom && ((hasDateRange ? secondRoom.dateAvailableRooms ?? secondRoom.totalRooms : secondRoom.totalRooms) > 0) ? setSelectedRoom(secondRoom.id) : undefined}
                          disabled={!secondRoom || ((hasDateRange ? secondRoom.dateAvailableRooms ?? secondRoom.totalRooms : secondRoom.totalRooms) <= 0)}
                          className={`p-4 rounded-xl border-2 text-left transition-all relative overflow-hidden ${
                            selectedRoom === secondRoom?.id
                              ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900/10'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <span className="absolute top-0 right-0 px-2 py-0.5 text-[9px] font-bold bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-bl-lg">PREMIUM</span>
                          <div className="flex items-center gap-2 mb-1">
                            <SparklesIcon className="w-4 h-4 text-amber-600" />
                            <span className="text-sm font-bold text-slate-900">Suite</span>
                          </div>
                          <p className="text-xs text-slate-500 mb-2">King bed · 60 m²</p>
                          <p className="text-base font-bold text-slate-900">₹{Math.round(hotel.price * 1.5).toLocaleString()}<span className="text-xs font-normal text-slate-400">/night</span></p>
                        </button>
                      </div>
                    </div>

                    {/* Date Selection */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1.5">Check In</label>
                        <div className="relative">
                          <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="date"
                            min={todayStr}
                            value={checkIn}
                            onChange={(e) => {
                              setCheckIn(e.target.value)
                              if (checkOut && e.target.value >= checkOut) setCheckOut('')
                            }}
                            className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1.5">Check Out</label>
                        <div className="relative">
                          <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="date"
                            min={checkIn || tomorrowStr}
                            value={checkOut}
                            onChange={(e) => setCheckOut(e.target.value)}
                            className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Guests */}
                    <div>
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1.5">Guests</label>
                      <div className="flex items-center gap-2 border border-slate-200 rounded-xl p-1">
                        <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition text-sm font-semibold text-slate-700">−</button>
                        <div className="flex-1 text-center">
                          <span className="text-sm font-bold text-slate-900">{guests}</span>
                          <span className="text-xs text-slate-400 ml-1">{guests === 1 ? 'guest' : 'guests'}</span>
                        </div>
                        <button onClick={() => setGuests(Math.min(8, guests + 1))} className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition text-sm font-semibold text-slate-700">+</button>
                      </div>
                    </div>

                    {/* Promo Code */}
                    <div>
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1.5">Promo Code</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => { setPromoCode(e.target.value); setPromoApplied(false) }}
                          placeholder="Enter code"
                          className="flex-1 px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition"
                        />
                        <button
                          onClick={handleApplyPromo}
                          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                            promoApplied
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-900 text-white hover:bg-slate-800'
                          }`}
                        >
                          {promoApplied ? '✓ Applied' : 'Apply'}
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1.5">Try <span className="font-mono font-semibold">GETHOTELS10</span> for 10% off</p>
                    </div>

                    {/* Price Summary */}
                    <div className="rounded-xl bg-slate-50 p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">{selectedRoomData?.name ?? 'Room'} × {nights} {nights === 1 ? 'night' : 'nights'}</span>
                        <span className="font-semibold text-slate-900">₹{subtotal.toLocaleString()}</span>
                      </div>
                      {promoApplied && (
                        <div className="flex justify-between text-sm">
                          <span className="text-emerald-600">Promo discount (10%)</span>
                          <span className="font-semibold text-emerald-600">-₹{discount.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Taxes & fees (12%)</span>
                        <span className="font-semibold text-slate-900">₹{tax.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm pt-2 border-t border-slate-200">
                        <span className="font-bold text-slate-900">Total</span>
                        <span className="text-lg font-bold text-slate-900">₹{total.toLocaleString()}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => checkIn && checkOut && selectedRoomIsAvailable ? setBookingStep(2) : undefined}
                      disabled={!checkIn || !checkOut || !selectedRoomIsAvailable}
                      className={`w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                        checkIn && checkOut && selectedRoomIsAvailable
                          ? 'bg-gradient-to-r from-slate-900 to-slate-700 text-white hover:shadow-xl'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {selectedRoomIsAvailable ? 'Continue to Guest Details' : 'Room not available for selected dates'}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                    </button>
                  </div>
                )}

                {/* ── Step 2: Guest Info ────── */}
                {bookingStep === 2 && !bookingConfirmed && (
                  <div className="space-y-5">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1.5">Full Name</label>
                      <div className="relative">
                        <UsersIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="Enter your full name"
                          className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1.5">Email</label>
                      <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                        <input
                          type="email"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1.5">Phone Number</label>
                      <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                        <input
                          type="tel"
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1.5">Special Requests <span className="text-slate-400 font-normal normal-case">(optional)</span></label>
                      <textarea
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        placeholder="Early check-in, extra pillows, airport pickup..."
                        rows={3}
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition resize-none"
                      />
                    </div>

                    {/* Booking Summary */}
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Booking Summary</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Room</span>
                          <span className="font-medium text-slate-900">{selectedRoomData?.name ?? 'Room'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Dates</span>
                          <span className="font-medium text-slate-900">{new Date(checkIn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} → {new Date(checkOut).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Guests</span>
                          <span className="font-medium text-slate-900">{guests}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-slate-200">
                          <span className="font-bold text-slate-900">Total</span>
                          <span className="font-bold text-slate-900">₹{total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {bookingError && (
                      <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                        {bookingError}
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={() => setBookingStep(1)}
                        className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" /></svg>
                        Back
                      </button>
                      <button
                        onClick={() => contactName && contactEmail && contactPhone ? handleConfirmBooking() : undefined}
                        disabled={!contactName || !contactEmail || !contactPhone || bookingLoading}
                        className={`flex-[2] py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                          contactName && contactEmail && contactPhone && !bookingLoading
                            ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:shadow-xl'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <ShieldIcon className="w-4 h-4" />
                        {bookingLoading ? 'Checking availability...' : 'Confirm Booking'}
                      </button>
                    </div>
                  </div>
                )}

                {/* ── Step 3: Confirmation ──── */}
                {bookingConfirmed && (
                  <div className="text-center space-y-5 py-4">
                    {/* Success animation */}
                    <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 flex items-center justify-center animate-fade-in-up">
                      <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Booking Confirmed!</h3>
                      <p className="text-sm text-slate-500 mt-1">Your reservation has been successfully placed</p>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 text-left space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Booking ID</span>
                        <span className="font-mono font-bold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-sm">{bookingId}</span>
                      </div>
                      <div className="space-y-2 text-sm border-t border-slate-200 pt-3">
                        <div className="flex justify-between">
                          <span className="text-slate-500 flex items-center gap-1.5"><BedIcon className="w-3.5 h-3.5" /> Room</span>
                          <span className="font-medium text-slate-900">{selectedRoomData?.name ?? 'Room'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 flex items-center gap-1.5"><CalendarIcon className="w-3.5 h-3.5" /> Check-in</span>
                          <span className="font-medium text-slate-900">{new Date(checkIn).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 flex items-center gap-1.5"><CalendarIcon className="w-3.5 h-3.5" /> Check-out</span>
                          <span className="font-medium text-slate-900">{new Date(checkOut).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 flex items-center gap-1.5"><UsersIcon className="w-3.5 h-3.5" /> Guests</span>
                          <span className="font-medium text-slate-900">{guests}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 flex items-center gap-1.5"><UsersIcon className="w-3.5 h-3.5" /> Guest</span>
                          <span className="font-medium text-slate-900">{contactName}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-slate-200">
                          <span className="font-bold text-slate-900">Amount Paid</span>
                          <span className="text-lg font-bold text-emerald-600">₹{total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 justify-center text-xs text-slate-500 bg-slate-50 rounded-lg p-3">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                      Confirmation sent to <strong className="text-slate-700">{contactEmail}</strong>
                    </div>

                    <button
                      onClick={closeBookingModal}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-slate-900 to-slate-700 text-white font-semibold text-sm hover:shadow-xl transition-all"
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
