import axios from "../../axios";

export async function getAllFaqCategory(data) {
  return await axios.get(
    `/admin/faq-category/v1?start=${data.nStart}&limit=${data?.nLimit}`
  );
}

export async function getCategoryById(id) {
  return await axios.get(`/admin/faq-category/${id}/v1`);
}

export async function editCategoryById({ id, payload }) {
  return await axios.put(`/admin/faq-category/${id}/v1`, payload);
}

export async function addCategory(data) {
  return await axios.post("/admin/faq-category/v1", data);
}

export async function deleteCategory(id) {
  return await axios.delete(`/admin/faq-category/${id}/v1`);
}

export async function getAllFaqCategoryDropdown() {
  return await axios.get(
    `/admin/faq-category/v1`
  );
}

export async function getAllQuestions(queryParams) {
  const param = {
    start:queryParams.nStart,
    limit:queryParams.nLimit
  }
  if(queryParams?.id){
    param.id = queryParams.id
  }
  const queryString = Object.keys(param)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(param[key])}`)
    .join('&');

  return await axios.get(`/admin/question/v1?${queryString}`);
}


export async function addQuestion(data) {
  return await axios.post("/admin/question/v1", data);
}

export async function editQuestion({data,id}) {
  return await axios.put(`/admin/question/${id}/v1`, data);
}

export async function getQuestionById(id) {
  return await axios.get(`/admin/question/${id}/v1`);
}

export async function getFAQData() {
  return await axios.get("/admin/home/v1?ePage=FAQ");
}

export async function updateFAQData(data) {
  return await axios.put("/admin/faq/v1", data);
}


