import { type NextRequest, NextResponse } from "next/server"

const CAL_API_KEY = process.env.CAL_API_KEY!
const EVENT_TYPE_ID = process.env.EVENT_TYPE_ID!
const CAL_USERNAME = process.env.CAL_USERNAME!

export async function GET(request: NextRequest) {
  try {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    }

    // Get next 14 days
    const start = new Date()
    const end = new Date()
    end.setDate(end.getDate() + 14)
    
    // Format dates properly
    const startDate = start.toISOString()
    const endDate = end.toISOString()
    
    // Build URL with all necessary parameters
    const url = `https://api.cal.com/v1/availability` +
      `?eventTypeId=${EVENT_TYPE_ID}` +
      `&username=${CAL_USERNAME}` +
      `&dateFrom=${startDate}` +
      `&dateTo=${endDate}` +
      `&timeZone=America/Toronto`
    
    console.log('🔍 Fetching availability from:', url)
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${CAL_API_KEY}`,
        'Content-Type': 'application/json'
      }
    })
    
    const data = await response.json()
    console.log('📊 Cal.com response:', JSON.stringify(data).slice(0, 200))
    
    // Format slots for agent
    const slots = (data.slots || []).slice(0, 5).map((slot: any) => {
      const date = new Date(slot.time || slot)
      return {
        id: slot.time || slot,
        display: date.toLocaleString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
          timeZone: 'America/Toronto'
        })
      }
    })
    
    return NextResponse.json(
      {
        success: true,
        slots: slots,
        message: slots.length > 0 
          ? `I have ${slots.length} openings available. ${slots.slice(0,3).map((s: any) => s.display).join(', ')}. Which works best for you?`
          : "I'm having trouble accessing the calendar. Let me give you our booking link: cal.com/jean-samuel-leboeuf-llvtwm/ai-demo",
        debug: {
          slotsFound: data.slots?.length || 0,
          eventTypeId: EVENT_TYPE_ID,
          username: CAL_USERNAME
        }
      },
      { headers }
    )
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Let me give you our booking link instead: cal.com/jean-samuel-leboeuf-llvtwm/ai-demo",
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
