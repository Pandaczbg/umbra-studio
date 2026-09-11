import HomeHero from "@/components/HomeHero";
import CurrentProjectScene from "@/components/CurrentProjectScene";
import CharactersScene from "@/components/CharactersScene";
import StudioScene from "@/components/StudioScene";
import WatchScene from "@/components/WatchScene";
import StudioManifesto from "@/components/StudioManifesto";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="umbra-home min-h-screen overflow-x-clip bg-[#050505]">
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