import { jwtDecode } from "jwt-decode";
import { createContext, useState, useEffect } from 'react';


const AppContext = createContext({})


const authToken = {
    accessToken: JSON.parse(localStorage.getItem("access_token")) || "",
    refreshToken: JSON.parse(localStorage.getItem("refresh_token")) || "",
}

export const ContextAppProvider = ({ children }) => {
    const [loading, setLoading] = useState(false)
    const [errorAPI, setErrorAPI] = useState("")
    const [successMsgAPI, setSuccessMsgAPI] = useState("")
    const aToken = authToken?.accessToken
    
    let decodedToken = {};
    if (aToken) {
        try {
          decodedToken = jwtDecode(aToken);
        } catch (error) {
          console.error('Token decode error:', error);
        }
      }
    const [userToken, setUserToken] = useState({
        access: authToken?.accessToken || "",
        refresh: authToken?.refreshToken || "",
        isDriver: decodedToken?.is_driver || null,
        isRider: decodedToken?.is_rider || null,
    })
    const [userDecodedToken, setUserDedodedToken] = useState({
        userID: decodedToken?.user_id || null,
        driver_profile_id: decodedToken?.driver_profile_id || null,
        riderProfileID: decodedToken?.rider_profile_id || null,
    })

    useEffect(() => {
        console.log('Decoded Token:', decodedToken);
      }, []);

    return (
        <AppContext.Provider value={{
            setUserToken, loading, setLoading,
            userToken,
            errorAPI, setErrorAPI,
            successMsgAPI, setSuccessMsgAPI, userDecodedToken, setUserDedodedToken
        }}>
            {children}
        </AppContext.Provider>
    )
}



export default AppContext;