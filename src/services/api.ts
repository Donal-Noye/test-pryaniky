import axios from "axios";
import {AuthResponse, CreateOrUpdateResponse, DeleteResponse, FetchDataBody, FetchDataResponse} from "../types.ts";

const API_URL = "https://test.v5.pryaniky.com/ru/data/v3/testmethods/docs";

export const api = axios.create({
  baseURL: API_URL,
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["x-auth"] = token;
  } else {
    delete api.defaults.headers.common["x-auth"];
  }
};

export const login = async (username: string, password: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/login", { username, password });
  return response.data;
};

export const fetchData = async (): Promise<FetchDataResponse> => {
  const response = await api.get<FetchDataResponse>("/userdocs/get");
  return response.data;
};

export const createRecord = async (data: FetchDataBody): Promise<CreateOrUpdateResponse> => {
  const response = await api.post<CreateOrUpdateResponse>("/userdocs/create", data);
  return response.data;
};

export const updateRecord = async (id: string, data: FetchDataBody): Promise<CreateOrUpdateResponse> => {
  const response = await api.post<CreateOrUpdateResponse>(`/userdocs/set/${id}`, data);
  return response.data;
};

export const deleteRecord = async (id: string): Promise<DeleteResponse> => {
  const response = await api.post<DeleteResponse>(`/userdocs/delete/${id}`);
  return response.data;
};
