import axios from "axios";
import {REACT_APP_BASE_URL, REACT_APP_CMS_URL} from './options'
// const {
//   REACT_APP_BASE_URL,
//   REACT_APP_CMS_URL,
// } = process.env;

export const baseServerURL = `${REACT_APP_BASE_URL}`;

export const serverCMsURL = `${baseServerURL}${REACT_APP_CMS_URL}`;
 
const instance = axios.create({ baseURL: serverCMsURL });
console.log("serverCMsURL")
console.log(serverCMsURL)
instance.interceptors.request.use((request) => {
  request.headers['set-cookie'] = []
  return request;
});
 
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log(error)
    return Promise.reject(error); 
  },
);

instance.defaults.headers.common["Content-Type"] = "application/json";
instance.defaults.headers.common.Accept = "application/json";
instance.defaults.headers.common["Accept-Language"] = "en";
instance.defaults.headers['set-cookie'] = []
instance.defaults.withCredentials = true;

export default instance; 
