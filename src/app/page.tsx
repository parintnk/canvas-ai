'use client';

import { useState, useRef, useEffect } from 'react';
import Header from '@/components/Header';
import ChatBox from '@/components/ChatBox';
import InputSection from '@/components/InputSection';

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
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      <ChatBox messages={messages} isLoading={isLoading} messagesEndRef={messagesEndRef} />
      <InputSection input={input} setInput={setInput} isLoading={isLoading} onSubmit={sendMessage} />

      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
