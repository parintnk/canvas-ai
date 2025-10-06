'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'สวัสดีค่ะ! 👋 ยินดีต้อนรับสู่ Canvas Marketing Agency นะคะ\n\nเรายินดีเป็นเพื่อนคู่คิดด้าน Marketing ให้คุณ มีอะไรอยากคุยหรือปรึกษาเกี่ยวกับ Marketing ไหมคะ? ☺️',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: messages.slice(-6),
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';

      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;

            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                assistantMessage += parsed.text;
                setMessages((prev) => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1].content = assistantMessage;
                  return newMessages;
                });
              }
            } catch (e) {
              // Ignore parsing errors
            }
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'ขออภัยนะ เกิดข้อผิดพลาดบางอย่าง ลองใหม่อีกครั้งได้ไหม?',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-between min-h-screen">
      {/* Header */}
      <div className="sticky top-0 left-0 right-0 paper-texture border-b-2 border-dashed" style={{ borderColor: 'var(--line-color)', zIndex: 10 }}>
        <div className="max-w-4xl mx-auto px-20 py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border-2" style={{ borderColor: 'var(--shadow-color)', backgroundColor: 'var(--paper-color)' }} />
            <div className="handwriting">
              <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Canvas Marketing</h1>
              <p className="text-sm opacity-75">เพื่อนคู่คิดด้าน Marketing ของคุณ</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="max-w-4xl mx-auto px-20 pt-32 pb-40">
        <div className="space-y-8">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`relative ${
                message.role === 'user' ? 'text-right' : 'text-left'
              }`}
            >
              {/* Hole punches */}
              <div className="hole-punch" style={{ top: `${80 + index * 120}px` }} />
              
              {/* Message */}
              <div className={`inline-block max-w-[80%] p-4 handwriting ${
                message.role === 'user' 
                  ? 'bg-yellow-100 border-l-4 border-yellow-600 ml-auto' 
                  : 'bg-blue-50 border-l-4 border-blue-400'
              }`} style={{ boxShadow: '2px 2px 8px rgba(139, 115, 85, 0.1)' }}>
                <div className="text-xs font-semibold mb-2 opacity-60">
                  {message.role === 'user' ? 'คุณ' : 'Canvas'}
                </div>
                <p className="whitespace-pre-wrap" style={{ color: 'var(--foreground)' }}>
                  {message.content}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="relative text-left">
              <div className="hole-punch" style={{ top: `${80 + messages.length * 120}px` }} />
              <div className="inline-block max-w-[80%] p-4 bg-blue-50 border-l-4 border-blue-400 handwriting" style={{ boxShadow: '2px 2px 8px rgba(139, 115, 85, 0.1)' }}>
                <div className="text-xs font-semibold mb-2 opacity-60">Canvas</div>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--shadow-color)', animation: 'bounce 1.4s infinite' }}></div>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--shadow-color)', animation: 'bounce 1.4s infinite 0.2s' }}></div>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--shadow-color)', animation: 'bounce 1.4s infinite 0.4s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="fixed bottom-0 left-0 right-0 paper-texture border-t-2 border-dashed" style={{ borderColor: 'var(--line-color)' }}>
        <div className="max-w-4xl mx-auto px-20 py-6">
          <form onSubmit={sendMessage} className="relative flex items-center gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="พิมพ์ข้อความ..."
              disabled={isLoading}
              className="flex-1 px-6 py-4 handwriting text-lg bg-transparent border-0 outline-none placeholder-opacity-50"
              style={{
                color: 'var(--foreground)',
                borderBottom: '2px dashed var(--line-color)',
                backgroundColor: 'transparent'
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-12 h-12 rounded-full border-2 hover:scale-110 transition-transform disabled:opacity-30 flex items-center justify-center font-bold text-xl shadow-md flex-shrink-0"
              style={{
                borderColor: '#8B7355',
                backgroundColor: '#F5E6D3',
                color: '#8B7355'
              }}
            >
              ➤
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
