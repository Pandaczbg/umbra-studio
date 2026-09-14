import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Umbra Studio",
    short_name: "Umbra",
    description:
      "Priče koje ostavljaju senku — filmske priče, mini-serije i ekranizacije.",
    start_url: "/",
    display: "standalone",
    background_color: "#030303",
    theme_color: "#030303",
    lang: "sr",
    icons: [
      {
        src: "/umbra-avatar.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
