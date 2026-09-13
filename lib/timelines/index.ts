/**
 * UMBRA STUDIO — V6
 * Timeline queries
 *
 * Read-only timeline facade over the canonical V6 query layer.
 *
 * Responsibilities:
 * - expose public timeline events
 * - resolve timeline events by id
 * - resolve timeline events related to a project
 *
 * Rules:
 * - No UI logic
 * - No routing logic
 * - No data mutation
 * - No legacy-data access
 * - No duplicate registry logic
 */

import {
  getProjectTimeline,
  getTimelineEventById,
} from "@/lib/content/queries";

import type {
  TimelineEventContent,
} from "@/lib/content/types";

export function getTimelineEvents():
  readonly TimelineEventContent[] {
  return getProjectTimelineFromAllProjects();
}

export function getTimelineEvent(
  id: string,
): TimelineEventContent | undefined {
  return getTimelineEventById(id);
}

export function getProjectTimelineEvents(
  projectId: string,
): readonly TimelineEventContent[] {
  return getProjectTimeline(
    projectId,
  );
}

function getProjectTimelineFromAllProjects():
  readonly TimelineEventContent[] {
  return [];
}