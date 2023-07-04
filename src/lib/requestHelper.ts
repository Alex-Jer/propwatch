import axios, { type AxiosError } from "axios";
import { env } from "~/env.mjs";
import { type User } from "~/types";

const API_URL = env.NEXT_PUBLIC_API_URL;

// const checkForAuthError = (res, storedToken) => {
//   if (res.status === 444 && storedToken) {
//     // When the user was suppoused to be logged in, but is not. Then "logout".
//     // Example: token revoked, token expired, blocked account, etc.
//     const userStore = useUserStore();
//     userStore.clearUser();
//   }
// };

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type LoginResponseData = {
  user: User;
  access_token: string;
};

type LogoutResponseData = {
  message: string;
};

export const makeRequest = async (
  route: string,
  method: Method = "GET",
  accessToken: string | null = null,
  formData: FormData | null = null,
  hasFiles = false
) => {
  const headers = {
    Accept: "application/json",
    "Content-Type": hasFiles ? "multipart/form-data" : "application/x-www-form-urlencoded",
    Authorization: "",
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const url = `${API_URL}/api/${route}`;

  let res;

  switch (method) {
    case "POST":
      res = await axios.post(url, formData, { headers });
      break;
    case "PUT":
      if (!formData) {
        res = await axios.put(url, formData, { headers });
        break;
      }
      /* eslint-disable-next-line no-param-reassign */
      // formData._method = method.toUpperCase();
      formData.append("_method", method.toUpperCase());
      res = await axios.post(url, formData, { headers });
      break;
    case "PATCH":
      if (!formData) {
        res = await axios.patch(url, formData, { headers });
        break;
      }
      /* eslint-disable-next-line no-param-reassign */
      // formData._method = method.toUpperCase();
      formData.append("_method", method.toUpperCase());
      res = await axios.post(url, formData, { headers });
      break;
    case "DELETE":
      res = await axios.delete(url, { headers }).catch((error: AxiosError) => {
        return error.response;
      });
      break;
    case "GET":
    default:
      res = await axios.get(url, { headers });
      break;
  }

  if (res) {
    return res.data;
  }

  return null;
};

export const login = async (email: string, password: string, deviceName: string) => {
  const url = `${API_URL}/login`;
  const formData = new FormData();

  formData.append("email", email);
  formData.append("password", password);
  formData.append("device_name", deviceName);

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const res = await axios.post(url, formData, { headers });

  /* return res.data as LoginResponseData; */
  return res;
};

export const logout = async (accessToken: string) => {
  const url = `${API_URL}/logout`;
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${accessToken}`,
  };

  const res = await axios.delete(url, { headers });

  console.log("res.data", res.data);

  return res.data as LogoutResponseData;
};

export const pageRequest = async (pageUrl: string) => {
  const headers = {
    Accept: "application/json",
  };

  const res = await axios.get(pageUrl, { headers });

  // checkForAuthError(res, storedToken);

  return res;
};

// export const processGeneralError = (error, model) => {
//   const actualError = error.response ? error.response : error;
//   if (!actualError.status) {
//     toast.error("Couldn't connect to the server! Please try again later.");
//     return;
//   }
//   const capitalModel = model.charAt(0).toUpperCase() + model.slice(1);
//   if (actualError.status === 404) {toast.error(`${capitalModel} was not found!`);
//   else if (actualError.data?.message) toast.error(actualError.data.message);
//   else toast.error("An unknown server error has occurred!");
// };
