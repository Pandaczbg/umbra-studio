"use client";

export default function GlobalError({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <html lang="sr">
      <body className="min-h-screen bg-[#030303] text-white">
        <main className="flex min-h-screen items-center justify-center px-6 py-20">
          <section className="w-full max-w-[620px] border border-white/[0.09] bg-white/[0.02] p-8 text-center shadow-[0_30px_100px_rgba(0,0,0,.45)] sm:p-12">
            <p className="font-mono text-[7px] uppercase tracking-[0.32em] text-[#ead39a]/65">
              UMBRA / SYSTEM ERROR
            </p>
            <h1 className="mt-6 text-[clamp(2.4rem,8vw,5.5rem)] font-[430] uppercase leading-[0.84] tracking-[-0.07em]">
              Something went wrong
            </h1>
            <p className="mx-auto mt-6 max-w-[430px] text-[11px] leading-6 text-white/[0.35]">
              The interface hit an unexpected error. Reload the current route
              without leaving the Umbra system.
            </p>
            <button
              type="button"
              onClick={() => reset()}
              className="mt-8 inline-flex min-h-11 items-center border border-[#ead39a]/25 px-5 text-[7px] font-semibold uppercase tracking-[0.24em] text-[#ead39a]/75 outline-none transition-colors hover:border-[#ead39a]/45 hover:text-[#ead39a] focus-visible:ring-1 focus-visible:ring-[#ead39a]/65"
            >
              Reload interface
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}
