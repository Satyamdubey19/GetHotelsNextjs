import OpenAI from "openai";
import { prisma } from "@/lib/prisma";
import type { AIHotelCard, AITourCard } from "@/types/ai-chat";

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY!,
  baseURL: "https://api.groq.com/openai/v1",
});

const MODEL = "llama-3.3-70b-versatile";

export async function POST(req: Request) {
  const { message, history = [] } = await req.json() as {
    message: string;
    history?: { role: string; content: string }[];
  };

  const [availableCities, totalHotels, totalTours] = await Promise.all([
    prisma.hotel.findMany({
      where: { isActive: true, isApproved: true },
      select: { city: true },
      distinct: ["city"],
    }),
    prisma.hotel.count({ where: { isActive: true, isApproved: true } }),
    prisma.tour.count({ where: { isActive: true } }).catch(() => 0),
  ]);

  const cityList = availableCities.map((c) => c.city).join(", ");

  const ai = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content: `You are a friendly, helpful AI travel assistant for GetHotels — a hotel and tour booking website.

AVAILABLE ON THIS WEBSITE:
- ${totalHotels} hotels across: ${cityList || "various Indian cities"}
- ${totalTours} tours available
- Car rentals and activities

RULES:
1. You MUST call one of the provided tools for EVERY response.
2. For ANY question about hotels, stays, budget, prices, cities, tours, travel, recommendations — call the appropriate search tool.
3. For casual greetings like "hi", "hello", "show me", "yes", "okay" — use search_hotels with no filters to show popular options.
4. For follow-up questions referencing previous results (e.g. "show me", "which one is best") — re-call search_hotels using context from conversation history.
5. Only call reject_question for completely off-topic questions (coding, news, sports, math) that have zero relation to travel.
6. Always be warm, positive, and helpful.`,
      },
      ...history.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
      { role: "user" as const, content: message },
    ],
    tools: [
      {
        type: "function",
        function: {
          name: "search_hotels",
          description: "Search hotels on this website by city and/or max price per night. Call with no arguments to show popular hotels.",
          parameters: {
            type: "object",
            properties: {
              city: {
                type: "string",
                description: "City name (e.g. Goa, Dehradun, Jaipur, Rishikesh, Mussoorie)",
              },
              max_price: {
                type: "number",
                description: "Maximum price per night in INR",
              },
            },
          },
        },
      },
      {
        type: "function",
        function: {
          name: "search_tours",
          description: "Search tours available on this website",
          parameters: {
            type: "object",
            properties: {
              city: {
                type: "string",
                description: "City or destination for the tour",
              },
            },
          },
        },
      },
      {
        type: "function",
        function: {
          name: "reject_question",
          description: "Only for completely off-topic questions with zero relation to travel, hotels, or tourism",
          parameters: {
            type: "object",
            properties: {
              reason: { type: "string" },
            },
            required: ["reason"],
          },
        },
      },
    ],
    tool_choice: "required",
  });

  const toolCall = ai.choices[0].message.tool_calls?.[0] as
    | { function: { name: string; arguments: string } }
    | undefined;

  const fnName = toolCall?.function.name;

  if (!toolCall || fnName === "reject_question") {
    return Response.json({
      message: "I'm here to help you find great hotels and tours on GetHotels! Try asking: 'Find hotels in Goa' or 'Show budget stays under ₹2000'.",
    });
  }

  if (fnName === "search_hotels") {
    const args = JSON.parse(toolCall.function.arguments) as {
      city?: string;
      max_price?: number;
    };

    const hotels = await prisma.hotel.findMany({
      where: {
        isActive: true,
        isApproved: true,
        ...(args.city ? { city: { contains: args.city, mode: "insensitive" } } : {}),
        ...(args.max_price
          ? { Room: { some: { pricePerNight: { lte: args.max_price } } } }
          : {}),
      },
      select: {
        title: true,
        city: true,
        averageRating: true,
        slug: true,
        HotelImage: { select: { url: true }, orderBy: { sortOrder: "asc" }, take: 1 },
        Room: {
          where: { isActive: true },
          select: { pricePerNight: true },
          orderBy: { pricePerNight: "asc" },
          take: 1,
        },
      },
      orderBy: { averageRating: "desc" },
      take: 6,
    });

    if (hotels.length === 0) {
      return Response.json({
        message: args.city
          ? `No hotels found in ${args.city} right now. We have hotels in: ${cityList}.`
          : "No hotels match your criteria right now. Try a different city or budget!",
      });
    }

    const cards: AIHotelCard[] = hotels.map((h) => ({
      name: h.title,
      city: h.city,
      rating: h.averageRating,
      startingFrom: h.Room[0]?.pricePerNight ? Number(h.Room[0].pricePerNight) : null,
      link: `/hotels/${h.slug}`,
      image: h.HotelImage[0]?.url ?? "",
    }));

    const label = args.city && args.max_price
      ? `Found ${hotels.length} hotels in ${args.city} under ₹${args.max_price.toLocaleString()}`
      : args.city
      ? `Here are ${hotels.length} great hotels in ${args.city}`
      : args.max_price
      ? `Found ${hotels.length} hotels under ₹${args.max_price.toLocaleString()}`
      : `Here are ${hotels.length} popular hotels on GetHotels`;

    return Response.json({ message: label, hotels: cards });
  }

  if (fnName === "search_tours") {
    const args = JSON.parse(toolCall.function.arguments) as { city?: string };

    const tours = await prisma.tour
      .findMany({
        where: {
          isActive: true,
          ...(args.city ? { city: { contains: args.city, mode: "insensitive" } } : {}),
        },
        select: {
          title: true,
          city: true,
          pricePerPerson: true,
          duration: true,
          slug: true,
        },
        take: 6,
      })
      .catch(() => []);

    if (tours.length === 0) {
      return Response.json({
        message: args.city
          ? `No tours found in ${args.city} right now. Check back soon!`
          : "No tours are currently listed. Check back soon!",
      });
    }

    const cards: AITourCard[] = tours.map((t) => ({
      name: t.title,
      city: t.city ?? null,
      price: Number(t.pricePerPerson),
      duration: t.duration,
      link: `/tours/${t.slug}`,
    }));

    return Response.json({
      message: `Here are ${tours.length} tours${args.city ? ` in ${args.city}` : ""} on GetHotels`,
      tours: cards,
    });
  }

  return Response.json({
    message: "I'm here to help you find hotels and tours on GetHotels!",
  });
}
