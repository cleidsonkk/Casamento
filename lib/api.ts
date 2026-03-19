import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

export type ApiErrorInit = {
  status?: number;
  code?: string;
  details?: unknown;
  requestId?: string;
};

export function createRequestId() {
  return randomUUID().slice(0, 8);
}

export function apiSuccess<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function apiError(message: string, init: ApiErrorInit = {}) {
  const requestId = init.requestId ?? createRequestId();
  return NextResponse.json(
    {
      error: message,
      code: init.code ?? "API_ERROR",
      requestId,
      details: init.details,
    },
    { status: init.status ?? 500 },
  );
}

export function logApiError(scope: string, error: unknown, requestId: string) {
  console.error(`[${scope}] request=${requestId}`, error);
}
