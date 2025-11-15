import http from "../http";

export const CommentsApi = {

  async add(imageId: string, data: { subject: string; body: string }) {
    const res = await http.post(`/categories/comments/${imageId}`, data);
    return res.data;
  },

  async getByImage(imageId: string) {
    const res = await http.get(`/categories/comments/${imageId}`);
    return res.data?.valueOrDefault ?? [];
  },

  async delete(commentId: string) {
    const res = await http.delete(`/categories/comments/${commentId}`);
    return res.data;
  }
};
