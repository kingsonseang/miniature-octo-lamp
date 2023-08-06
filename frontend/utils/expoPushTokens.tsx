import api from "./api";

const register = (pushToken: any | string, token: any | string) =>
  api.post(
    '/users/set-push-token',
    { newPublicId: pushToken },
    { headers: { Authorization: `Bearer ${token}` } }
  );

export default {
  register,
};
