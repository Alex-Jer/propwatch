import axios, { AxiosError } from "axios";
import { signOut } from "next-auth/react";
import { errorNotification } from "~/components/PropertyCard";
import { env } from "~/env.mjs";
import { type AxiosErrorResponse, type User } from "~/types";

const API_URL = env.NEXT_PUBLIC_API_URL;

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type LoginResponseData = {
  message: string;
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
  hasFiles = false,
  manageErrors = true,
  unkErrTxt = "An unknown error has occurred."
) => {
  const headers = {
    Accept: "application/json",
    "Content-Type": hasFiles ? "multipart/form-data" : "application/x-www-form-urlencoded",
    "X-Requested-With": "XMLHttpRequest",
    Authorization: "",
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const url = `${API_URL}/api/${route}`;

  let res = null;

  switch (method) {
    case "POST":
      res = await axios.post(url, formData, { headers, withCredentials: true });
      break;
    case "PUT":
      if (!formData) {
        res = await axios.put(url, formData, { headers });
        break;
      }
      formData.append("_method", method.toUpperCase());
      res = await axios.post(url, formData, { headers });
      break;
    case "PATCH":
      if (!formData) {
        res = await axios.patch(url, formData, { headers });
        break;
      }
      formData.append("_method", method.toUpperCase());
      res = await axios.post(url, formData, { headers });
      break;
    case "DELETE":
      if (!formData) {
        res = await axios.delete(url, { headers });
        break;
      }
      formData.append("_method", method.toUpperCase());
      res = await axios.post(url, formData, { headers });
      break;
    case "GET":
    default:
      res = await axios.get(url, { headers });
      break;
  }

  if (res) {
    if ((res.status >= 200 && res.status < 300) || !manageErrors) return res.data;

    switch (res.status) {
      case 401:
      case 444: // 444 - our own unauthenticated error code
        // User is no longer authenticated, maybe the token expired or was revoked
        errorNotification("Your session has expired. Please sign in again.");
        await signOut({ redirect: false });
      case 403:
        // User is authenticated, but does not have the required permissions
        throw new Error("You are not authorized to perform this action.");
      case 404:
        // The requested resource was not found
        throw new Error("The requested resource was not found.");
      case 400:
      // The request was malformed or invalid
      case 422:
        // The request was well-formed but was unable to be followed due to semantic errors
        if (res.data?.message) {
          throw new Error(res.data.message);
        }
      case 500:
      // Internal server error
      default:
        throw new Error(unkErrTxt);
    }
  }

  return null;
};

export const processRequestError = (error: Error) => {
  errorNotification(error.message);
};

export const processAxiosError = (error: AxiosErrorResponse, defaultError = "An unknown error has occurred") => {
  if ((error.response?.status == 422 || error.response?.status == 400) && error.response?.data?.message)
    errorNotification(error.response.data.message);
  else if (error.response?.status == 401 || error.response?.status == 444) {
    errorNotification("Your session has expired. Please sign in again.");
    void signOut();
  } else errorNotification(defaultError);
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
  return res.data as LoginResponseData;
};

export const logout = async (accessToken: string) => {
  const url = `${API_URL}/logout`;
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${accessToken}`,
  };

  const res = await axios.delete(url, { headers });
  return res.data as LogoutResponseData;
};

export const register = async (
  name: string,
  email: string,
  password: string,
  passwordConfirmation: string,
  deviceName: string
) => {
  const url = `${API_URL}/register`;
  const formData = new FormData();

  formData.append("name", name);
  formData.append("email", email);
  formData.append("password", password);
  formData.append("password_confirmation", passwordConfirmation);
  formData.append("device_name", deviceName);

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const res = await axios.post(url, formData, { headers });
  return res.data as LoginResponseData;
};

export const pageRequest = async (pageUrl: string) => {
  const headers = {
    Accept: "application/json",
  };
  const res = await axios.get(pageUrl, { headers });
  return res;
};
