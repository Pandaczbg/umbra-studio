/**
 * UMBRA STUDIO — V6
 * Relationship queries
 *
 * Read-only relationship facade over the canonical V6 content registry.
 *
 * Responsibilities:
 * - expose public relationships
 * - resolve relationships by id
 * - resolve relationships related to a project
 * - resolve relationships between canonical content entities
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
  RelationshipContent,
} from "@/lib/content/types";

function isPublic(
  item: RelationshipContent,
): item is RelationshipContent & {
  visibility: "public";
} {
  return item.visibility === "public";
}

export function getRelationships():
  readonly RelationshipContent[] {
  return umbraContent.relationships.filter(
    isPublic,
  );
}

export function getRelationshipById(
  id: string,
): RelationshipContent | undefined {
  const relationship =
    umbraContent.getRelationship(
      id,
    );

  return relationship &&
    isPublic(relationship)
    ? relationship
    : undefined;
}

export function getProjectRelationships(
  projectId: string,
): readonly RelationshipContent[] {
  return umbraContent
    .getRelationshipsForProject(
      projectId,
    )
    .filter(isPublic);
}

export function getRelationshipsForEntity(
  entityId: string,
): readonly RelationshipContent[] {
  return getRelationships().filter(
    (relationship) =>
      relationship.sourceId ===
        entityId ||
      relationship.targetId ===
        entityId,
  );
}

export function getRelationshipsFromEntity(
  entityId: string,
): readonly RelationshipContent[] {
  return getRelationships().filter(
    (relationship) =>
      relationship.sourceId ===
      entityId,
  );
}

export function getRelationshipsToEntity(
  entityId: string,
): readonly RelationshipContent[] {
  return getRelationships().filter(
    (relationship) =>
      relationship.targetId ===
      entityId,
  );
}