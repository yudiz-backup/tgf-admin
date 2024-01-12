import axios from "../../axios";

export async function getAboutUsData() {
  return await axios.get("/admin/home/v1?ePage=ABOUTUS");
}

export async function updateAboutUsData(data) {
  return await axios.put("/admin/about-us/v1", data);
}
