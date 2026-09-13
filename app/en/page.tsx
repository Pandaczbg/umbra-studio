import CharactersScene from "@/components/CharactersScene";
import CurrentProjectScene from "@/components/CurrentProjectScene";
import Footer from "@/components/Footer";
import HomeHero from "@/components/HomeHero";
import StudioManifesto from "@/components/StudioManifesto";
import StudioScene from "@/components/StudioScene";
import WatchScene from "@/components/WatchScene";
import {
  getCharacterMedia,
  getCharacters,
  getProjects,
} from "@/lib/content/queries";

export default function EnglishHomePage() {
  const characters = getCharacters();
  const projects = getProjects();

  const characterImages = Object.fromEntries(
    characters.map((character) => {
      const media = getCharacterMedia(character.id);

      return [
        character.id,
        media[0]?.src ?? null,
      ];
    }),
  );

  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#050505]">
      {/* ================================================================
          01 — INTRO
          Brand statement / cinematic opening
          ================================================================ */}
      <HomeHero
        locale="en"
        projects={projects}
      />

      {/* ================================================================
          02 — CURRENT PROJECT
          Flagship production
          ================================================================ */}
      <CurrentProjectScene
        locale="en"
        projects={projects}
      />

      {/* ================================================================
          03 — CHARACTERS
          Character world / cast
          ================================================================ */}
      <CharactersScene
        locale="en"
        characters={characters}
        projects={projects}
        characterImages={characterImages}
      />

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
