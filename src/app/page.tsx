import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-black">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-center text-center">
        {/* Logo */}
        <Image
          className="dark:invert"
          src="/storemate.jpg" 
          alt="StoreMate logo"
          width={180}
          height={38}
          priority
        />

        {/* Coming Soon Message */}
        <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
          StoreMate - Coming Soon
        </h1>
        <p className="text-lg sm:text-xl text-white/90 max-w-lg">
          Revolutionize your shopping experience with StoreMate! We're building the ultimate solution for seamless store management and shopping.
        </p>

       
      </main>

      {/* Footer */}
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center text-white/70 text-sm">
        <p>&copy; 2025 StoreMate. All rights reserved.</p>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://x.com/storemate"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/x-icon.svg" // Replace with X or social media icon path
            alt="X icon"
            width={16}
            height={16}
          />
          Follow us on X
        </a>
      </footer>
    </div>
  );
}

