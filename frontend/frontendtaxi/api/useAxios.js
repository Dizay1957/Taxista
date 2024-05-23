import axiosInstancePrivate, { baseURL } from "./AxiosSettings";
import useGetContext from "../context/useGetContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const useAxios = () => {
    const { setUserToken, userToken, setErrorAPI } = useGetContext();
    const navigate = useNavigate();

    axiosInstancePrivate.interceptors.request.use(
        (config) => {
            const accessToken = JSON.parse(localStorage.getItem("access_token"));
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
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

                    setUserToken({
                        ...userToken,
                        access: newAccessToken,
                        refresh: newRefreshToken
                    });

                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return axios(originalRequest);
                } catch (error) {
                    setErrorAPI("Authentication failed, you will be redirected to login");
                    localStorage.clear();
                    setUserToken({
                        ...userToken,
                        access: "",
                        refresh: "",
                    });
                    navigate("/login");
                }
            }

            return Promise.reject(error);
        }
    );

    return axiosInstancePrivate;
};

export default useAxios;