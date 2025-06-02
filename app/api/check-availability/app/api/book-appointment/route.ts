import { type NextRequest, NextResponse } from "next/server"

const CAL_API_KEY = process.env.CAL_API_KEY!
const EVENT_TYPE_ID = process.env.EVENT_TYPE_ID!

export async function POST(request: NextRequest) {
  try {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    }
    
    const body = await request.json()
    const { slotId, name, email, phone, company, dailyCalls } = body
    
    console.log("Booking attempt:", { name, email, slotId })
    
    const bookingData = {
      eventTypeId: Number.parseInt(EVENT_TYPE_ID),
      start: slotId,
      responses: {
        name: name,
        email: email,
        phone: phone,
      },
      metadata: {
        company: company,
        dailyCalls: dailyCalls,
        source: "elevenlabs_agent",
        bookedAt: new Date().toISOString(),
      },
      timeZone: "America/Toronto",
    }
    
    const response = await fetch("https://api.cal.com/v1/bookings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CAL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    })
    
    const result = await response.json()
    
    if (response.ok && result.uid) {
      const bookingDate = new Date(slotId)
      const confirmationText = `Perfect! I've successfully booked your demo for ${bookingDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} at ${bookingDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}. You'll receive a confirmation email at ${email} within 60 seconds with the meeting link.`
      
      // Send to Zapier if configured
      if (process.env.ZAPIER_WEBHOOK) {
        fetch(process.env.ZAPIER_WEBHOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "booking_created",
            booking: result,
            metadata: { name, email, phone, company, dailyCalls },
          }),
        }).catch((err) => console.error("Zapier webhook error:", err))
      }
      
      return NextResponse.json(
        {
          success: true,
          bookingId: result.uid,
          message: confirmationText,
        },
        { headers }
      )
    } else {
      throw new Error(result.message || "Booking failed")
    }
  } catch (error) {
    console.error("Booking error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "I couldn't complete the booking right now. Let me send you our calendar link instead: cal.com/jean-samuel-leboeuf-llvtwm/ai-demo",
      },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}
