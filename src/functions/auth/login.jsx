import { toast } from "react-toastify";
// import { getStore, postStore } from "../../config/store";
import axiosInstance from "..";

//Login By User Data
export const loginByData = async (data) => {
  try {
    const response = await axiosInstance.post("/auth/login", data);
    if (response.data) {
      console.log(response.data);
      return response.data;
    }
    toast.error(response.data.message);
    return null;
  } catch (error) {
    toast.error(`${error}`);
  }
};

