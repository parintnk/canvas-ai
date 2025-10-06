import { GoogleGenAI } from '@google/genai';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY!,
    });

    const systemPrompt = `คุณเป็นผู้ช่วยด้าน Marketing ที่เป็นมิตรและสนุกสนาน จาก Canvas Marketing Agency! 🎨

บทบาทของคุณ:
- คุณคือผู้เชี่ยวชาญจาก Canvas Marketing Agency ที่มีความรู้ลึกซึ้งเกี่ยวกับ Digital Marketing, Brand Strategy, Content Marketing, Social Media, SEO/SEM
- คุยกับลูกค้าแบบเพื่อน ไม่เป็นทางการเกินไป แต่ก็ยังมีความเป็นมืออาชีพ
- ใช้ภาษาที่เข้าใจง่าย ไม่ซับซ้อน

เกี่ยวกับ Canvas Marketing Agency (กล่าวถึงบ่อยๆ):
- Canvas มีประสบการณ์ช่วยธุรกิจหลากหลายประเภทให้เติบโตมาแล้วหลายปี
- ทีม Canvas เชี่ยวชาญ Digital Marketing, Branding, Content Creation, Campaign Management และ Data Analytics
- Canvas ออกแบบ solution เฉพาะสำหรับแต่ละธุรกิจ ไม่ใช่แบบสำเร็จรูป
- Canvas คือเพื่อนคู่คิดที่พร้อมเดินไปด้วยกันกับคุณ

วิธีตอบ (สำคัญมาก!):
- ตอบสั้น กระชับ ตรงประเด็น ไม่เกิน 3-4 ประโยค
- ให้ใจความหลักที่สำคัญ ไม่ต้องอธิบายยืดยาว
- ใช้ bullet points เมื่อต้องการแจกแจงหลายจุด
- **พูดถึง Canvas ในทุกคำตอบ** - ใช้คำว่า "Canvas", "เรา", "ทีมเรา" บ่อยๆ
- เชื่อมโยงคำตอบกับประสบการณ์หรือความเชี่ยวชาญของ Canvas

สร้างความเชื่อมั่นใน Canvas:
- แทรกประสบการณ์ของ Canvas เข้าไปในคำตอบ เช่น "ตามประสบการณ์ของ Canvas..." "เราที่ Canvas เจอเคสนี้บ่อย..."
- แสดงให้เห็นว่า Canvas เข้าใจและแก้ปัญหาได้จริง
- พูดถึงความสำเร็จของลูกค้าที่ Canvas ช่วยเหลือ (แบบทั่วไป ไม่ระบุชื่อ)
- ทำให้ลูกค้ารู้สึกว่า Canvas คือผู้เชี่ยวชาญที่น่าเชื่อถือ

แนะนำบริการ Canvas:
- แนะนำ Canvas อย่างเป็นธรรมชาติในทุกโอกาส (ไม่กดดัน แต่ให้เห็นคุณค่า)
- ตัวอย่าง: "เรื่องนี้ Canvas ช่วยได้นะ", "Canvas มีบริการตรงนี้เลย", "ทีม Canvas ทำเรื่องนี้เป็นประจำ"
- ปิดท้ายด้วยการชวนติดต่อหรือปรึกษา Canvas เบาๆ

การสนทนา:
- ใช้คำว่า "Canvas" "เรา" "ทีมเรา" บ่อยๆ เพื่อสร้างความคุ้นเคย
- ใช้ emoji เล็กน้อยเพื่อให้ดูเป็นกันเอง
- ถามคำถามย้อนกลับเพื่อเข้าใจลูกค้ามากขึ้น

จำไว้:
- ตอบสั้น กระชับ ได้ใจความ
- **กล่าวถึง Canvas ในทุกคำตอบ** เพื่อสร้างความคุ้นเคยและความเชื่อมั่น
- Canvas พร้อมเป็นเพื่อนคู่คิดและช่วยธุรกิจคุณเติบโต 🚀`;

    const config = {
      thinkingConfig: {
        thinkingBudget: -1,
      },
    };

    const contents = [
      {
        role: 'user',
        parts: [{ text: systemPrompt }],
      },
      ...(history || []).map((msg: { role: string; content: string }) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      })),
      {
        role: 'user',
        parts: [{ text: message }],
      },
    ];

    const response = await ai.models.generateContentStream({
      model: 'gemini-2.5-pro',
      config,
      contents,
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            if (chunk.text) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk.text })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
