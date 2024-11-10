import { mockLogin } from "@/utils/mockApi";
import { createApi } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: async (args) => {
    const response = await mockLogin(args.username, args.password);
    return { data: response };
  },
  endpoints: (builder) => ({
    login: builder.mutation<
      { token: string | null; message: string },
      { username: string; password: string }
    >({
      query: (credentials) => credentials,
    }),
  }),
});

export const { useLoginMutation } = authApi;
