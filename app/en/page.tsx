import CharactersScene from "@/components/CharactersScene";
import CurrentProjectScene from "@/components/CurrentProjectScene";
import Footer from "@/components/Footer";
import HomeHero from "@/components/HomeHero";
import StudioManifesto from "@/components/StudioManifesto";
import StudioScene from "@/components/StudioScene";
import WatchScene from "@/components/WatchScene";

export default function EnglishHomePage() {
  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#050505]">
      {/* ================================================================
          01 — INTRO
          Brand statement / cinematic opening
          ================================================================ */}
      <HomeHero locale="en" />

      {/* ================================================================
          02 — CURRENT PROJECT
          Flagship production
          ================================================================ */}
      <CurrentProjectScene locale="en" />

      {/* ================================================================
          03 — CHARACTERS
          Character world / cast
          ================================================================ */}
      <CharactersScene locale="en" />

      {/* ================================================================
          04 — STUDIO
          Manifesto / philosophy / creative system
          ================================================================ */}
      <StudioScene locale="en" />

      {/* ================================================================
          05 — WATCH
          YouTube / moving image
          ================================================================ */}
      <WatchScene locale="en" />

      {/* ================================================================
          06 — CLOSING FRAME
          Closing statement before the footer
          ================================================================ */}
      <StudioManifesto locale="en" />

      {/* ================================================================
          07 — FOOTER
          Global navigation / social / legal
          ================================================================ */}
      <Footer locale="en" />
    </main>
  );
}