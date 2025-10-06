interface InputSectionProps {
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function InputSection({ input, setInput, isLoading, onSubmit }: InputSectionProps) {
  return (
    <div className="flex-shrink-0 paper-texture border-t border-dashed w-full" style={{ borderColor: 'var(--line-color)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-12 lg:px-20 py-2 sm:py-3 md:py-4">
        <form onSubmit={onSubmit} className="flex items-center gap-2 sm:gap-3 w-full">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="พิมพ์ข้อความ..."
            disabled={isLoading}
            className="flex-1 min-w-0 px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 handwriting bg-transparent border-0 outline-none placeholder-opacity-50"
            style={{
              color: 'var(--foreground)',
              borderBottom: '1px dashed var(--line-color)',
              backgroundColor: 'transparent',
              fontSize: '16px'
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 hover:scale-110 active:scale-95 transition-transform disabled:opacity-30 flex items-center justify-center font-bold text-sm sm:text-base md:text-xl shadow-md flex-shrink-0"
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
  );
}
