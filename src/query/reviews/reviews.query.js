import axios from "../../axios";

export async function getAllReviews(data) {
  return await axios.get(
    `/admin/review/v1?start=${data.nStart}&limit=${data?.nLimit}`
  );
}

export async function getReviewsById(id) {
  return await axios.get(`/admin/review/${id}/v1`);
}
