import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  member: null,
  validUntil: null,
  serviceIds: [],
  isAuthenticated: false,
  roles: [],
  permissions: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const { member, valid_until, service_ids, roles, permissions } =
        action.payload;

      state.member = member;
      state.validUntil = valid_until;
      state.serviceIds = service_ids;
      state.isAuthenticated = true;
      state.roles = roles;
      state.permissions = permissions;
    },

    logout: (state) => {
      state.member = null;
      state.validUntil = null;
      state.serviceIds = [];
      state.roles = [];
      state.permissions = [];
      state.isAuthenticated = false;

      localStorage.clear();
    },
    updateMember: (state, action) => {
      state.member = action.payload;
    },
  },
});

export const { login, logout, updateMember } = authSlice.actions;
export default authSlice.reducer;
