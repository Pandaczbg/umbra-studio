import HomeHero from "@/components/HomeHero";
import CurrentProjectScene from "@/components/CurrentProjectScene";
import CharactersScene from "@/components/CharactersScene";
import StudioScene from "@/components/StudioScene";
import WatchScene from "@/components/WatchScene";
import StudioManifesto from "@/components/StudioManifesto";
import Footer from "@/components/Footer";
import {
  getCharacterMedia,
  getCharacters,
  getProjects,
} from "@/lib/content/queries";
import {
  getLatestPublishedContent,
} from "@/lib/content/latest";

export default function HomePage() {
  const characters = getCharacters();
  const projects = getProjects();
  const latestContent = getLatestPublishedContent(2);

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
    <main
      id="main-content"
      className="umbra-home min-h-screen overflow-x-clip"
    >
      <HomeHero
        locale="sr"
        latestContent={latestContent}
      />

      <CurrentProjectScene
        locale="sr"
        projects={projects}
      />

      <CharactersScene
        locale="sr"
        characters={characters}
        projects={projects}
        characterImages={characterImages}
      />

      <StudioScene locale="sr" />

      <WatchScene locale="sr" />

      <StudioManifesto locale="sr" />

      <Footer locale="sr" />
    </main>
  );
}
