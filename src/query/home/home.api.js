import axios from "../../axios";

export async function getHomeData() {
  return await axios.get("/admin/home/v1?ePage=HOME");
}

export async function updateHomeData(data) {
  return await axios.put("/admin/home/v1", data);
}

export async function getHowToPlayData() {
  return await axios.get("/admin/home/v1?ePage=HOWTOPLAY");
}

export async function updateHowToPlayData(data) {
  return await axios.put("/admin/how-to-play/v1", data);
}

export async function getFooterData() {
  return await axios.get("/admin/home/v1?ePage=FOOTER");
}

export async function updateFooterData(data) {
  return await axios.put("/admin/footer/v1", data);
}

export async function getMediaglimpseData() {
  return await axios.get("/admin/home/v1?ePage=MEDIAGLIM");
}

export async function updateMediaglimpseData(data) {
  return await axios.put("/admin/media-glims/v1",data);
}

export async function getFeatureImageData() {
  return await axios.get("/admin/home/v1?ePage=FEATURE");
}

export async function updateFeatureImageData(data) {
  return await axios.put("/admin/app-feature/v1", data);
}
