import { notFound } from "next/navigation";
import { characters } from "@/data/characters";

export function generateStaticParams() {
  return characters.map((character) => ({ slug: character.slug }));
}

export default async function EnglishCharacterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const character = characters.find((item) => item.slug === slug);
  if (!character) notFound();

  return (
    <main className="min-h-screen bg-[#050505]">
      <section className="relative min-h-[100svh] overflow-hidden">
        <img src={character.image} alt={character.name} className="absolute inset-0 h-full w-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative mx-auto flex min-h-[100svh] max-w-[1500px] items-end px-5 pb-20 sm:px-8 lg:px-12 lg:pb-28">
          <div>
            <div className="text-[8px] uppercase tracking-[.34em] text-white/35">{character.projectTitle} · {character.category}</div>
            <h1 className="mt-6 text-[clamp(4.5rem,11vw,11rem)] font-medium leading-[.8] tracking-[-.08em]">{character.name}</h1>
            <p className="mt-8 max-w-2xl text-base leading-8 text-white/48">{character.shortDescription}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
