import axios from "../../axios";

export async function addReview(data) {
  return await axios.post("/admin/review/v1", data);
}

export async function editReview({ id, payload }) {
  return await axios.put(`/admin/review/${id}/v1`, payload);
}

export async function deleteReview(id) {
  return await axios.delete(`/admin/review/${id}/v1`);
}
