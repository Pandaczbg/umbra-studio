/**
 * UMBRA STUDIO — V6
 * Archive queries
 *
 * Read-only archive facade over the canonical V6 content registry.
 *
 * Responsibilities:
 * - expose public archive entries
 * - resolve archive entries by id
 * - resolve archive entries related to a project
 *
 * Rules:
 * - No UI logic
 * - No routing logic
 * - No data mutation
 * - No legacy-data access
 * - Public visibility is enforced here
 */

import {
  umbraContent,
} from "@/lib/content";

import type {
  ArchiveEntryContent,
} from "@/lib/content/types";

function isPublic(
  item: ArchiveEntryContent,
): item is ArchiveEntryContent & {
  visibility: "public";
} {
  return item.visibility === "public";
}

export function getArchiveEntries():
  readonly ArchiveEntryContent[] {
  return umbraContent.archive.filter(
    isPublic,
  );
}

export function getArchiveEntryById(
  id: string,
): ArchiveEntryContent | undefined {
  const entry =
    umbraContent.getArchiveEntry(
      id,
    );

  return entry &&
    isPublic(entry)
    ? entry
    : undefined;
}

export function getArchiveEntriesForProject(
  projectId: string,
): readonly ArchiveEntryContent[] {
  return umbraContent
    .getArchiveForProject(
      projectId,
    )
    .filter(isPublic);
}