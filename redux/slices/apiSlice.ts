import { createApi, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import axiosInstance from "@/api/axiosInstance";
import { getToken } from "@/utils/storage";
import { AxiosRequestConfig, AxiosError } from "axios";

const axiosBaseQuery: BaseQueryFn<
  {
    url: string;
    method: AxiosRequestConfig["method"];
    data?: AxiosRequestConfig["data"];
    params?: AxiosRequestConfig["params"];
  },
  unknown,
  unknown
> = async ({ url, method, data, params }) => {
  try {
    const apiKey = await getToken();
    const result = await axiosInstance({
      url,
      method,
      data,
      params: { ...params, key: apiKey },
    });
    return { data: result };
  } catch (axiosError) {
    const error = axiosError as AxiosError;
    return {
      error: {
        status: error.response?.status,
        data: error.response?.data || error.message,
      },
    };
  }
};

export const pixabayApi = createApi({
  reducerPath: "pixabayApi",
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    fetchData: builder.query<
      any,
      { query: string; page: number; perPage: number }
    >({
      query: ({ query, page, perPage }) => ({
        url: "",
        method: "GET",
        params: {
          q: query,
          image_type: "photo",
          page,
          per_page: perPage,
        },
      }),
    }),
  }),
});

export const { useFetchDataQuery } = pixabayApi;
