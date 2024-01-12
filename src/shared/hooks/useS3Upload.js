/* eslint-disable no-undef */
import axios from "../../axios";
import Axios from "axios";
export const useS3Upload = () => {
  async function uploadFile(eType, payload) {
    try {
      const presignedData = await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/admin/presigned/v1`,
        { eType: eType, aImages: payload }
      );
      if (presignedData?.data?.data) {
        const data = presignedData?.data?.data; // Assuming you have your object here
        const keys = Object.keys(data);
        const lastKey = keys[keys.length - 1];
        for (const key in data) {
          try {
            const file = payload.find((i) => i.sFlag == key)?.file;
            const contentType = file?.type || "";
            const result = await Axios.put(
              presignedData?.data?.data[key]?.sUrl,
              file,
              { headers: { "Content-Type": contentType } }
            );
            if (key === lastKey && result) {
              return presignedData?.data?.data;
            }
          } catch (err) {
            console.log("err", err);
          }
        }
      }
    } catch (err) {
      console.log("err", err);
      return { err };
    }
  }

  const getImage = async (filepath, token) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/v1/getUrl-for-private`,
        { data: filepath },
        { headers: { Authorization: token } }
      );
      return response?.data; // Return the URL here
    } catch (error) {
      console.log("error", error);
      throw error; // Rethrow the error to handle it elsewhere if needed
    }
  };

  return {
    uploadFile,
    getImage,
  };
};
