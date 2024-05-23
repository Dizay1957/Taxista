import { useState, useEffect } from "react";
import useAxios from "../../../../api/useAxios.js";
import axios from "axios";
import useGetContext from "../../../../context/useGetContext";

const useBookRide = () => {
    const [loadingState, setLoadingState] = useState(false);
    const api = useAxios();
    const { userDecodedToken } = useGetContext();
    const [siteSettings, setSiteSettings] = useState({});
    const [rideDetails, setRideDetails] = useState({
        rideDistance: 0,
        rideDuration: 0,
        ridePrice: 0,
    });

    useEffect(() => {
        console.log("User Decoded Token in useBookRide:", userDecodedToken); // Add this line to log userDecodedToken
    }, [userDecodedToken]);

    const getCoordinates = async (address) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_MAPBOX_URL_ENDPOINT}/geocoding/v5/mapbox.places/${address}.json?access_token=${import.meta.env.VITE_MAPBOX_API_KEY}&autocomplete=true`
            );
            if (response.data && response.data.features && response.data.features[0]) {
                const [longitude, latitude] = response.data.features[0].center;
                return { latitude, longitude };
            } else {
                throw new Error("Invalid response structure");
            }
        } catch (error) {
            console.error('Error fetching coordinates:', error);
            return null;
        }
    };

    const getSiteSettings = async () => {
        try {
            const response = await api.get("app/site/");
            setSiteSettings(response.data[0]);
        } catch (err) {
            console.log(err);
        }
    };

    const isValidCoordinate = (coord) => {
        return coord.latitude >= -90 && coord.latitude <= 90 && coord.longitude >= -180 && coord.longitude <= 180;
    };

    const startRideBooking = async (pickUpAddress, destinationAddress) => {
        setLoadingState(true);
        const pickUp = await getCoordinates(pickUpAddress);
        const dropOff = await getCoordinates(destinationAddress);

        if (!pickUp || !dropOff || !isValidCoordinate(pickUp) || !isValidCoordinate(dropOff)) {
            console.error("Invalid coordinates:", pickUp, dropOff);
            setLoadingState(false);
            return;
        }

        const distanceBetweenPoints = getDistance(pickUp.latitude, pickUp.longitude, dropOff.latitude, dropOff.longitude);
        console.log(`Distance between points: ${distanceBetweenPoints} km`);

        if (distanceBetweenPoints > 1000) {
            console.error("Invalid coordinates or too far apart:", pickUp, dropOff);
            setLoadingState(false);
            return;
        }

        try {
            const responseRoute = await axios.get(`${import.meta.env.VITE_MAPBOX_URL_ENDPOINT}/directions/v5/mapbox/driving/${pickUp.longitude},${pickUp.latitude};${dropOff.longitude},${dropOff.latitude}?access_token=${import.meta.env.VITE_MAPBOX_API_KEY}`);
            const rideDuration = responseRoute.data.routes[0].duration / 60;
            const rideDistance = responseRoute.data.routes[0].distance / 1000;
            const durationValue = siteSettings.price_minute * rideDuration;
            const distanceValue = siteSettings.price_km * rideDistance;
            const totalPrice = Number(siteSettings.base_price) + durationValue + distanceValue;

            setRideDetails({
                ...rideDetails,
                rideDistance: rideDistance.toFixed(2),
                rideDuration: rideDuration.toFixed(2),
                ridePrice: totalPrice.toFixed(2),
                pickUp_long_lat: `${pickUp.longitude}, ${pickUp.latitude}`,
                dropOff_long_lat: `${dropOff.longitude}, ${dropOff.latitude}`,
            });
        } catch (error) {
            console.error('Error fetching route:', error);
        } finally {
            setLoadingState(false);
        }
    };

    const getDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the Earth in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            0.5 - Math.cos(dLat) / 2 +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            (1 - Math.cos(dLon)) / 2;

        return R * 2 * Math.asin(Math.sqrt(a));
    };

    useEffect(() => {
        getSiteSettings();
    }, []);

    return { getSiteSettings, loadingState, siteSettings, startRideBooking, rideDetails };
};

export default useBookRide;