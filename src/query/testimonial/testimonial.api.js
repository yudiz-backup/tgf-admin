import axios from "../../axios";

export async function getAllTestimonial(data) {
  return await axios.get(
    `/admin/testimonial/v1?start=${data.nStart}&limit=${data?.nLimit}&type=${data?.type}`
  );
}

export async function addTestimonial(data) {
  return await axios.post("/admin/testimonial/v1", data);
}

export async function getTestimonialById(id) {
  return await axios.get(`/admin/testimonial/${id}/v1`);
}

export async function editTestimonial({ id, payload }) {
  return await axios.put(`/admin/testimonial/${id}/v1`, payload);
}

export async function deleteTestimonial(id) {
  return await axios.delete(`/admin/testimonial/${id}/v1`);
}
