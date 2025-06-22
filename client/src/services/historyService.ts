import { api } from "./api";

export async function fetchHistory({ page = 1, caption = "", date = "" }) {
  const params: any = { page };
  if (caption) params.caption = caption;
  if (date) params.date = date;

  const res = await api.get("/history", { params });
  return res.data;
}

export async function deleteHistory(id: string) {
  return await api.delete(`/history/${id}`);
}
