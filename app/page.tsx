import HomeHero from "@/components/HomeHero";
import CurrentProjectScene from "@/components/CurrentProjectScene";
import CharactersScene from "@/components/CharactersScene";
import StudioScene from "@/components/StudioScene";
import WatchScene from "@/components/WatchScene";
import StudioManifesto from "@/components/StudioManifesto";
import Footer from "@/components/Footer";

/* ==========================================================================
   UMBRA STUDIO
   HOME
   V5 FINAL SYSTEM

   Page composition
   --------------------------------------------------------------------------
   01. Hero
   02. Current projects
   03. Characters
   04. Studio method
   05. Watch
   06. Closing manifesto
   07. Footer

   Architecture
   --------------------------------------------------------------------------
   The page is intentionally a composition layer only.

   Global systems are owned by:
   - layout
   - UmbraMotionSystem
   - UmbraSceneDirector
   - UmbraAtmosphere
   - Header
   - UmbraScrollbar
   - transition systems

   Individual scenes own their own:
   - content
   - scene markers
   - interaction
   - responsive composition

   The home page does not duplicate motion, scene tracking, or visual systems.
   ========================================================================== */

export default function HomePage() {
  return (
    <main
      id="main-content"
      className="umbra-home min-h-screen overflow-x-clip"
    >
      <HomeHero locale="sr" />

      <CurrentProjectScene locale="sr" />

      <CharactersScene locale="sr" />

      <StudioScene locale="sr" />

      <WatchScene locale="sr" />

      <StudioManifesto locale="sr" />

      <Footer locale="sr" />
    </main>
  );
}
