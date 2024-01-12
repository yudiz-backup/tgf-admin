import axios from "../../axios";
export async function getContactUsData() {
    return await axios.get("/admin/home/v1?ePage=CONTACTUS");
  }

  export async function updateContactUsData(data) {
    return await axios.put("/admin/contact-us/v1", data);
  }

  export async function getUserContactUsData(data) {
    return await axios.get(`/admin/contact-us/v1?start=${data.nStart}&limit=${data?.nLimit}`);
  }