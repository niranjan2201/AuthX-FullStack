import { createContext, useEffect, useState } from "react"
import {AppConstants} from "../Util/Constants.js";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();

export const AppProvider = (props) => {

    axios.defaults.withCredentials = true;

    const backendUrl = AppConstants.BACKEND_URL;
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);

    const getUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error("No authentication token found");
                return;
            }
            
            const response = await axios.get(backendUrl + "/profile", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if(response.status === 200){
                setUserData(response.data);
            } else {
                toast.error("Unable to retrieve user profile");
            }
        } catch (err) {
            toast.error("Authentication failed");
            localStorage.removeItem('token');
            setIsLoggedIn(false);
        }
    };

    const getAuthState = async () => {
        try{
          const response = await axios.get(backendUrl + "/is-authenticated")
          if(response.status === 200 && response.data === true){
            setIsLoggedIn(true);
            await getUserData();
          } else {
            setIsLoggedIn(false);
          }
        }catch(error){
          console.error(error);
        }
    }

    useEffect( () => {
        getAuthState();
    },[])

    const contextValue = {
        backendUrl,
        isLoggedIn,setIsLoggedIn,
        userData,setUserData,
        getUserData,
    }


    return (
        <AppContext.Provider value={contextValue}>
            {props.children}
        </AppContext.Provider>
    )
}

