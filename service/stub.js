import axios from "../config/axios";

export const sendRequest = async (data, headers) => {
  console.log("in axios")
  return axios.post("", { data }, { headers, withCredentials: true });
};

export const sendRestRequest = async (data, headers) => {
  console.log("in axios")
  data['isREST'] = true;
  return axios.post("",  data, { headers, withCredentials: true });
};

export const uploadFile = async (formData, params) => {
  return axios.post("", formData, {
    params,
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
  });
};
