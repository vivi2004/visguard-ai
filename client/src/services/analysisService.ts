import { api } from "./api";

export async function analyzeImage(imageUrl: string) {
  const res = await api.post("/analyze", { imageUrl });
  return res.data;
}

