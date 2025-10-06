export default function Header() {
  return (
    <div className="sticky top-0 flex-shrink-0 paper-texture border-b border-dashed w-full" style={{ borderColor: 'var(--line-color)', zIndex: 10 }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-12 lg:px-20 py-2 sm:py-3 md:py-4">
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 flex-shrink-0" style={{ borderColor: 'var(--shadow-color)', backgroundColor: 'var(--paper-color)' }} />
          <div className="handwriting min-w-0 flex-1">
            <h1 className="text-base sm:text-lg md:text-2xl font-bold truncate" style={{ color: 'var(--foreground)' }}>Canvas Marketing</h1>
            <p className="text-[10px] sm:text-xs md:text-sm opacity-75 truncate">เพื่อนคู่คิดด้าน Marketing ของคุณ</p>
          </div>
        </div>
      </div>
    </div>
  );
}
