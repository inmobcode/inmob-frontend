import { apiFetch } from "./client";

export type RecommendationPriority = "LOW" | "MEDIUM" | "HIGH";
export type RecommendationStatus = "PROPOSED" | "APPROVED" | "DONE";

export interface Recommendation {
  id: string;
  propertyId: string;
  title: string;
  details?: string | null;
  priority: RecommendationPriority;
  estCost?: number | null;
  pdfUrl?: string | null;
  status: RecommendationStatus;
  createdAt: string;
}

export function listRecommendations(token: string, propertyId: string) {
  return apiFetch<Recommendation[]>(
    `/api/properties/${propertyId}/recommendations`,
    { token },
  );
}

export function createRecommendation(
  token: string,
  propertyId: string,
  payload: {
    title: string;
    details?: string;
    priority?: RecommendationPriority;
    estCost?: number;
  },
) {
  return apiFetch<Recommendation>(
    `/api/properties/${propertyId}/recommendations`,
    {
      method: "POST",
      token,
      body: JSON.stringify(payload),
    },
  );
}

export function updateRecommendation(
  token: string,
  propertyId: string,
  recommendationId: string,
  payload: Partial<{
    title: string;
    details: string;
    priority: RecommendationPriority;
    estCost: number;
    status: RecommendationStatus;
  }>,
) {
  return apiFetch<Recommendation>(
    `/api/properties/${propertyId}/recommendations/${recommendationId}`,
    { method: "PATCH", token, body: JSON.stringify(payload) },
  );
}

export function deleteRecommendation(
  token: string,
  propertyId: string,
  recommendationId: string,
) {
  return apiFetch<void>(
    `/api/properties/${propertyId}/recommendations/${recommendationId}`,
    {
      method: "DELETE",
      token,
    },
  );
}
