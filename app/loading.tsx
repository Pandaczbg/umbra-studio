import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <main
      className="fixed inset-0 z-[300] flex min-h-screen items-center justify-center overflow-hidden bg-[var(--umbra-bg)] text-[#F1EDE4]"
      aria-label="Umbra Studio učitavanje"
    >
      {/* ATMOSPHERE */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C7A96B]/[0.035] blur-[140px]" />

        <div className="absolute inset-0 opacity-[0.018] [background-image:linear-gradient(rgba(255,255,255,.4)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.4)_1px,transparent_1px)] [background-size:90px_90px]" />
      </div>

      {/* CENTER */}
      <div className="relative flex flex-col items-center">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-white/[0.08]" />

          <LoaderCircle
            size={28}
            strokeWidth={1}
            className="animate-spin text-[#C7A96B]"
          />

          <span className="absolute h-1 w-1 rounded-full bg-[#C7A96B] shadow-[0_0_12px_rgba(199,169,107,0.75)]" />
        </div>

        <div className="mt-7 flex items-center gap-3">
          <span className="h-px w-7 bg-[#C7A96B]/55" />

          <span className="text-[8px] font-medium uppercase tracking-[0.4em] text-[#C7A96B]">
            Umbra Studio
          </span>

          <span className="h-px w-7 bg-[#C7A96B]/55" />
        </div>

        <p className="mt-3 text-[7px] uppercase tracking-[0.3em] text-white/16">
          Priče koje ostavljaju senku
        </p>
      </div>

      {/* BOTTOM LINE */}
      <div className="absolute bottom-7 left-6 right-6 sm:left-10 sm:right-10">
        <div className="h-px overflow-hidden bg-white/[0.05]">
          <div className="h-full w-1/3 animate-[umbra-loading_1.8s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-[#C7A96B]/50 to-transparent" />
        </div>

        <div className="mt-3 flex items-center justify-between text-[6px] uppercase tracking-[0.28em] text-white/10">
          <span>Loading archive</span>
          <span>Umbra / 001</span>
        </div>
      </div>
    </main>
  );
}
