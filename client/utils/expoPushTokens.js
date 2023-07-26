import api from "./api";

const register = (pushToken, token) => api.post('/users/set-push-token', { newPublicId: pushToken }, { headers: `Bearer ${token}` });

export default {
    register,
}