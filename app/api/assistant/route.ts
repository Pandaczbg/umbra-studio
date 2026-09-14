import { createAssistantHandler, readConfig, RequestBudget } from "@/lib/assistant/core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const budget = new RequestBudget();

export async function GET(request: Request) {
  return createAssistantHandler(readConfig(process.env), budget)(request);
}

export async function POST(request: Request) {
  return createAssistantHandler(readConfig(process.env), budget)(request);
}
