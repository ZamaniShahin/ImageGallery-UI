import http from "../http";
import type { Comment } from "../../types/comment";
import type { Paged } from "../../types/common";

export const CommentsApi = {
  async add(imageId: string, data: { subject: string; body: string }) {
    const res = await http.post(`/categories/comments/${imageId}`, data);
    return res.data;
  },

  async listByImage(
    imageId: string,
    p: { pageNumber?: number; pageSize?: number } = {},
  ): Promise<Paged<Comment>> {
    const res = await http.get(`/categories/comments/${imageId}`, {
      params: { pageNumber: p.pageNumber ?? 1, pageSize: p.pageSize ?? 20 },
    });
    return res.data;
  },

  async delete(commentId: string) {
    const res = await http.delete(`/categories/comments/${commentId}`);
    return res.data;
  },
};
