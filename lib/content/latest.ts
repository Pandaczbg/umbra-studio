import {
  getCharacters,
  getEpisodes,
  getProjects,
  getStories,
} from "@/lib/content/queries";
import { selectLatest, type EditorialContent } from "@/lib/content/publication";
export type LatestContent = EditorialContent;
export function getLatestPublishedContent(limit = 2): readonly LatestContent[] {
  return selectLatest(
    [...getProjects(), ...getEpisodes(), ...getCharacters(), ...getStories()],
    limit,
  );
}
