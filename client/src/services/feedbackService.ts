import { api } from "./api";

export async function submitFeedback({ analysisId, feedbackText, rating }: {
  analysisId: string,
  feedbackText: string,
  rating: number,
}) {
  const res = await api.post("/feedback", {
    analysis_id: analysisId,
    feedback_text: feedbackText,
    rating,
  });
  return res.data;
}
