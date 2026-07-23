import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentName, phone, score, category, courseRequested, collegeId } = body;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: college } = await supabase
      .from('colleges')
      .select('name, paid_client')
      .eq('id', collegeId)
      .single();

    const telegramMessage = `
*NEW STUDENT ADMISSION LEAD*
=====
*Name:* ${studentName}
*Phone:* ${phone}
*Merit Score:* ${score}% (${category})
*Course:* ${courseRequested}
*College Target:* ${college?.name || 'Unknown'}
*Client Status:* ${college?.paid_client ? 'Premium Paid Client' : 'Free Tier'}
    `.trim();

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (botToken && chatId) {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: telegramMessage,
          parse_mode: 'Markdown',
        }),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
