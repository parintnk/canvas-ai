import { RefObject } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatBoxProps {
  messages: Message[];
  isLoading: boolean;
  messagesEndRef: RefObject<HTMLDivElement | null>;
}

export default function ChatBox({ messages, isLoading, messagesEndRef }: ChatBoxProps) {
  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 md:px-12 lg:px-20 py-4 md:py-6">
        <div className="space-y-6 md:space-y-8">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`relative ${
                message.role === 'user' ? 'text-right' : 'text-left'
              }`}
            >
              {/* Hole punches - hidden on mobile */}
              <div className="hole-punch hidden md:block" style={{ top: `${80 + index * 120}px` }} />

              {/* Message */}
              <div className={`inline-block max-w-[95%] sm:max-w-[85%] md:max-w-[80%] p-3 md:p-4 handwriting text-sm md:text-base ${
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
              <div className="hole-punch hidden md:block" style={{ top: `${80 + messages.length * 120}px` }} />
              <div className="inline-block max-w-[95%] sm:max-w-[85%] md:max-w-[80%] p-3 md:p-4 bg-blue-50 border-l-4 border-blue-400 handwriting" style={{ boxShadow: '2px 2px 8px rgba(139, 115, 85, 0.1)' }}>
                <div className="text-xs font-semibold mb-2 opacity-60">Canvas</div>
                <div className="flex gap-2">
                  <div className="w-2 h-2 md:w-3 md:h-3 rounded-full" style={{ backgroundColor: 'var(--shadow-color)', animation: 'bounce 1.4s infinite' }}></div>
                  <div className="w-2 h-2 md:w-3 md:h-3 rounded-full" style={{ backgroundColor: 'var(--shadow-color)', animation: 'bounce 1.4s infinite 0.2s' }}></div>
                  <div className="w-2 h-2 md:w-3 md:h-3 rounded-full" style={{ backgroundColor: 'var(--shadow-color)', animation: 'bounce 1.4s infinite 0.4s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
}
