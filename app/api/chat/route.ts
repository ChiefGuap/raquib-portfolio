// app/api/chat/route.ts
import { createClient } from '@/utils/supabase/server';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_MODEL = 'tngtech/deepseek-r1t2-chimera:free';

export async function POST(req: Request): Promise<Response> {
  try {
    const { messages, context } = await req.json();

    // ========================================
    // SUPABASE LOGIC (unchanged)
    // ========================================
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let systemPrompt = '';

    // === DASHBOARD MODE (Tutor Assistant) ===
    if (context === 'dashboard' && user) {
      const { data: sessions, error: sessionsError } = await supabase
        .from('bookings')
        .select('topic, session_notes, start_time')
        .eq('student_id', user.id)
        .eq('status', 'completed')
        .order('start_time', { ascending: false })
        .limit(5);

      let historyText = 'No past sessions found.';
      if (!sessionsError && sessions && sessions.length > 0) {
        historyText = sessions
          .map(
            (s) =>
              `- ${new Date(s.start_time).toLocaleDateString()}: Topic: "${s.topic}". Notes: ${
                s.session_notes || 'No notes recorded.'
              }`
          )
          .join('\n');
      }

      systemPrompt = `You are GuapBot, a helpful AI tutor assistant for Alam's Tutoring.

Logistics & Business Rules:
- Payments: Payments are made via Venmo (@Raquib-Alam) or Zelle after each session.
- Pricing: First session was free. Subsequent sessions are $30-$60/hr depending on workload.
- Booking: To book a new session, tell them to click the "Book New Session" button on their dashboard. You cannot book it for them.

Academic Context (Session History):
${historyText}

Your Role:
- Answer questions about past sessions and topics covered.
- Answer logistical questions (payments, rates) using the rules above.
- Be encouraging, supportive, and brief.
- If the answer isn't in the notes, say you don't have that info recorded.`;
    } else {
      // === LANDING MODE (Sales Assistant) ===
      systemPrompt = `You are GuapBot, the virtual assistant for Alam's Tutoring.

About Alam's Tutoring:
- Raquib Alam offers personalized 1-on-1 STEM mentorship.
- Pricing: The FIRST session is completely FREE. After that, rates range from $30-$60/hr depending on the grade level, subject, and workload.
- Subjects: Math, Physics, Chemistry, CS (Middle School to College).
- Format: Online sessions via Zoom.

Your role:
- Answer questions about tutoring services and pricing.
- Be helpful, professional, and encouraging.
- IMPORTANT: You CANNOT book sessions or take personal info here.
- If a user wants to book, explicitly say: "I can't schedule sessions in the chat. Please click the 'Book a Session' button to schedule your free intro with Raquib!"`;
    }

    // ========================================
    // OPENROUTER API CALL (non-streaming)
    // ========================================
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Missing OPENROUTER_API_KEY on the server' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const upstream = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.OPENROUTER_SITE_URL || '',
        'X-Title': process.env.OPENROUTER_APP_NAME || 'GuapBot',
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        stream: false,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
      }),
    });

    // Handle upstream errors
    if (!upstream.ok) {
      const text = await upstream.text();
      console.error('OpenRouter error:', upstream.status, text);
      return new Response(
        JSON.stringify({ error: 'Upstream model error', details: text }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Return the JSON response
    const json = await upstream.json();
    return new Response(JSON.stringify(json), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('CHAT API ERROR:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const isQuotaError =
      errorMessage.includes('quota') || errorMessage.includes('429');

    return new Response(
      JSON.stringify({
        error: isQuotaError
          ? 'Service temporarily unavailable. Please try again later.'
          : 'Something went wrong. Please try again.',
        code: isQuotaError ? 'QUOTA_EXCEEDED' : 'SERVER_ERROR',
      }),
      {
        status: isQuotaError ? 429 : 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
