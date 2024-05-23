import sedanSVG from "../../assets/svgs/sedan-11.svg";
import suvSVG from "../../assets/svgs/suv.svg";
import luxuryCar from "../../assets/svgs/luxury.svg";
import { useEffect, useRef, useState } from "react";
import useBookRide from "./hooks/useBookRide";
import useGetContext from "../../../context/useGetContext";
import useAxios from "../../../api/useAxios";
import { useNavigate } from "react-router-dom";
import { AddressAutofill } from '@mapbox/search-js-react';

const BookRide = () => {
    const { startRideBooking, rideDetails, loadingState, siteSettings } = useBookRide();
    const [pickUpAddress, setPickupAddress] = useState("");
    const [dropOffAddress, setDropOffAddress] = useState("");
    const { userDecodedToken, setErrorAPI, setSuccessMsgAPI } = useGetContext();
    const [carType, setCarType] = useState("");
    const api = useAxios();
    const navigate = useNavigate();

    useEffect(() => {
        console.log("userDecodedToken:", userDecodedToken);
    }, [userDecodedToken]);

    const handleButtonClick = async (e) => {
        e.preventDefault();
        if (rideDetails?.rideDuration && rideDetails?.rideDistance && carType) {
            const data = {
                rider_id: userDecodedToken?.riderProfileID,
                pick_up_location: pickUpAddress,
                drop_off_location: dropOffAddress,
                pickup_long_lat: rideDetails.pickUp_long_lat,
                drop_off_long_lat: rideDetails.dropOff_long_lat,
                distance: rideDetails?.rideDistance,
                ride_duration: rideDetails?.rideDuration,
                ride_car_type: carType,
                ride_price: rideDetails?.ridePrice,
                payment_method: "Cash" // Default payment method, adjust as necessary
            };
            console.log("Booking Data: ", data);
            try {
                const bookingResponse = await api.post("rides/book/", data);
                console.log("Booking Response: ", bookingResponse);
                setSuccessMsgAPI("Your ride has been successfully booked");
                navigate("/rider/bookings");
            } catch (err) {
                console.error('Error booking ride:', err);
                if (err?.response?.status === 400 && err?.response?.data?.Error) {
                    setErrorAPI(err?.response?.data?.Error);
                } else if (err?.response?.status === 500) {
                    setErrorAPI("Server Error, Team has been notified");
                } else {
                    setErrorAPI("Oops something went wrong!!");
                }
            }
        } else {
            setErrorAPI("Please complete all fields");
        }
    };

    const timeoutRef = useRef(null);

    const handleDropOffAdd = (e) => {
        setDropOffAddress(e.target.value);
        if (pickUpAddress && e.target.value) {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
                startRideBooking(pickUpAddress, e.target.value);
            }, 1000);
        }
    };

    return (
        <div className="w-full pt-12 h-ful">
            <div className="w-[95%] mx-auto">
                <form className="flex border-2 flex-col gap-3 w-[90%] lg:w-[60%] mx-auto mt-12 md:mt-2 mb-2 shadow-lg p-4 rounded-sm">
                    <h2 className="text-xl font-semibold text-center">Book your ride</h2>
                    <p className="text-center text-slate-500 hover:text-blue-600">Few seconds and get your ride <br /> booked</p>
                    <div className="form-row">
                        <label htmlFor="">Pick up Address</label>
                        <AddressAutofill accessToken={import.meta.env.VITE_MAPBOX_API_KEY}>
                            <input type="text" value={pickUpAddress} autoComplete="street-address"
                                onChange={(e) => setPickupAddress(e.target.value)} placeholder="pick-up address"
                                className="w-full px-1 py-3 mt-3 mb-2 border-2 rounded-sm text-md" />
                        </AddressAutofill>
                    </div>
                    <div className="form-row">
                        <label htmlFor="dropOff">Drop off Address</label>
                        <AddressAutofill accessToken={import.meta.env.VITE_MAPBOX_API_KEY}>
                            <input type="text" disabled={pickUpAddress === "" ? true : false} value={dropOffAddress} onChange={(e) => handleDropOffAdd(e)}
                                id="dropOff" placeholder="drop-off address"
                                autoComplete="street-address"
                                className="w-full px-1 py-3 mt-3 border-2 rounded-sm text-md" />
                        </AddressAutofill>
                    </div>
                    <div className="form-row">
                        <label htmlFor="">Car type</label>
                        <div className="flex justify-center w-full gap-4 mt-3 mb-3">
                            <label htmlFor="sedanCar" className="w-full cursor-pointer">
                                <div className="relative flex flex-col py-2 border-2 rounded-md hover:shadow-2xl hover:shadow-deep-purple/50">
                                    <input type="radio" onChange={() => setCarType("Sedan")} name="carCategory" id="sedanCar"
                                        placeholder="Full Name" className="absolute left-2 top-2" />
                                    <img src={sedanSVG} alt="sedan" className="w-[48px] mx-auto h-[48px]" />
                                    <span className="mt-auto text-center">Sedan</span>
                                </div>
                            </label>
                            <label htmlFor="suvCar" className="w-full cursor-pointer">
                                <div className="relative flex flex-col py-2 border-2 rounded-md hover:shadow-2xl hover:shadow-deep-purple/50">
                                    <input type="radio" onChange={() => setCarType("SUV")} name="carCategory" id="suvCar"
                                        placeholder="Full Name" className="absolute left-2 top-2" />
                                    <img src={suvSVG} alt="sedan" className="w-[48px] mx-auto h-[48px]" />
                                    <span className="mt-auto text-center">SUV</span>
                                </div>
                            </label>
                            <label htmlFor="luxuryCar" className="w-full cursor-pointer">
                                <div className="relative flex flex-col py-2 border-2 rounded-md hover:shadow-2xl hover:shadow-deep-purple/50 ">
                                    <input type="radio" onChange={() => setCarType("Luxury")} name="carCategory" id="luxuryCar"
                                        placeholder="Full Name" className="absolute left-2 top-2" />
                                    <img src={luxuryCar} alt="sedan" className="w-[48px] mx-auto h-[48px]" />
                                    <span className="mt-auto text-center">Luxury</span>
                                </div>
                            </label>
                        </div>
                    </div>
                    <div className="form-row">
                        <label htmlFor="paymentMethod">Payment method</label>
                        <select name="paymentMethod" id="paymentMethod" className="w-full px-1 py-3 mt-3 border-2 rounded-sm text-md">
                            <option value="Cash">Cash</option>
                            <option value="Card">Card</option>
                            <option value="Wallet">Wallet</option>
                        </select>
                    </div>
                    <div className="mt-4">
                        <ul className="flex items-center justify-around">
                            <li className="text-xs sm:text-base md:text-base">Distance: { `${!loadingState ? `${rideDetails?.rideDistance} KM` : "Loading..."}`} </li>
                            <li className="text-xs font-semibold text-green-800 sm:text-base md:text-base">Price:{ `${!loadingState ? `$ ${rideDetails?.ridePrice}` : "Loading..."}` }</li>
                            <li className="text-xs sm:text-base md:text-base">Duration: { `${!loadingState ? `${rideDetails?.rideDuration} minutes` : "Loading..."}` }</li>
                        </ul>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                        <h6>Pricing Policy:</h6>
                        <ul className="flex items-center gap-4">
                            <li className="text-xs text-slate-500">Base price: {siteSettings?.base_price} $</li>
                            <li className="text-xs text-slate-500">Price per km: {siteSettings?.price_km} $</li>
                            <li className="text-xs text-slate-500">Price per minute: {siteSettings?.price_minute} $</li>
                        </ul>
                    </div>
                    <button onClick={handleButtonClick} className="w-full py-3 mt-4 text-white rounded-sm bg-deep-purple text-md">
                        Book now {" "}{">"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BookRide;