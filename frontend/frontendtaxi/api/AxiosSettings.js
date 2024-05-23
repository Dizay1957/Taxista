import axios from "axios";

export const baseURL = "http://127.0.0.1:8000/";

export const axiosInstancePublic = axios.create({
    baseURL,
});

const axiosInstancePrivate = axios.create({
    baseURL,
});

axiosInstancePrivate.interceptors.request.use(
    (config) => {
        const accessToken = JSON.parse(localStorage.getItem("access_token"));
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(new Error(error))
);

axiosInstancePrivate.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = JSON.parse(localStorage.getItem("refresh_token"));
                const response = await axios.post(`${baseURL}api/token/refresh/`, { refresh: refreshToken });

                const newAccessToken = response.data.access;
                const newRefreshToken = response.data.refresh;

                localStorage.setItem('access_token', JSON.stringify(newAccessToken));
                localStorage.setItem('refresh_token', JSON.stringify(newRefreshToken));

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return axios(originalRequest);
            } catch (error) {
                localStorage.clear();
                window.location.href = "/login";
            }
        }

        
    }
);

export default axiosInstancePrivate;