import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate data
    if (!data.email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Forward to Google Sheets Webhook (Apps Script)
    const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
    
    if (webhookUrl) {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          ...data
        }),
      });

      if (!response.ok) {
        console.error('Webhook failed:', await response.text());
        // We still return 200 to the user but log the error
      }
    }

    // Also log to console for debugging in Vercel logs
    console.log('New Lead Received:', data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
