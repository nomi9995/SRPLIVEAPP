import * as ACTION_TYPES from "../types";

export const setAuthUser = (payload) => ({
  type: ACTION_TYPES.LOGIN,
  payload: payload,
});

export const setSession = (payload) => ({
  type: ACTION_TYPES.SESSION,
  payload: payload,
});
