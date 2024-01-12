import axios from "../../axios";

export async function gerPlayStoreData() {
  return await axios.get("/admin/home/v1?ePage=PLAYSTORE");
}

export async function editPlayStoreData(data) {
  return await axios.put(`/admin/play-store/v1`, data);
}

export async function editApkData(data) {
  return await axios.put(`/admin/download-btn/v1`, data);
}

export async function getApkData() {
  return await axios.get("/admin/home/v1?ePage=DOWNLOAD");
}
