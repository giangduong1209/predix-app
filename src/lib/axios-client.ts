import axios, { AxiosError, AxiosResponse } from "axios";
import isEmpty from "lodash";
import { toast } from "react-hot-toast";

/**
 * * Define axios config when request and response
 * ! DO NOT DELETE CONFIG
 */

export const axiosClient = axios.create({
  baseURL: "https://jellyfish-app-p44gl.ondigitalocean.app/",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * request
 * * Define request config before send axios
 * TODO: Define authorization with bearer token in headers
 */

axiosClient.interceptors.request.use(function (config) {
  const token = localStorage.getItem("token");
  if (!isEmpty(token)) config.headers.Authorization = "Bearer " + token;
  return config;
});

/**
 * response
 * * Define return data and show error notification based on status http
 * TODO: Using if to check status and toast to show notification type and message error
 */
axiosClient.interceptors.response.use(
  function (res: AxiosResponse) {
    return res.data;
  },
  (err: AxiosError) => {
    if (err.response && err.response.status === 429) {
      toast.error("Operation too fast.");
    }
  }
);
