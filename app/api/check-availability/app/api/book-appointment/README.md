# Autoscale AI Booking API

Production-ready Cal.com integration for ElevenLabs AI agent to automatically book appointments.

## 🚀 Quick Deploy

### Deploy to Vercel (Recommended)
1. Push this code to GitHub
2. Go to [Vercel](https://vercel.com/new)
3. Import your GitHub repository
4. Add these environment variables:
   - `CAL_API_KEY=cal_live_e7f24f1eab131ba927de8e70b8912da1`
   - `EVENT_TYPE_ID=2575862`
   - `CAL_USERNAME=jean-samuel-leboeuf-llvtwm`
   - `ZAPIER_WEBHOOK=https://hooks.zapier.com/hooks/catch/22548528/2vs0423/`
5. Deploy!

## 📋 API Endpoints

- `GET /api/check-availability` - Get available time slots
- `POST /api/book-appointment` - Create a booking
- `POST /api/webhook/zapier` - Zapier webhook handler
- `GET /api/health` - Health check
- `GET /api/status` - System status

## 🔧 ElevenLabs Configuration

### Tool 1: checkAvailability
```json
{
  "name": "checkAvailability",
  "method": "GET",
  "url": "https://your-app.vercel.app/api/check-availability"
}
