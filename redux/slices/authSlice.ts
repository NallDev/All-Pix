import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  message: string | null;
}

const initialState: AuthState = {
  token: null,
  message: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
    setMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },
    resetAuth: (state) => {
      state.token = null;
      state.message = null;
    },
  },
});

export const { setToken, setMessage, resetAuth } = authSlice.actions;
export default authSlice.reducer;
