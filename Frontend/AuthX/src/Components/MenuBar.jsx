import { useNavigate } from "react-router-dom";
import { useState, useRef, useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const MenuBar = () => {
    const navigate = useNavigate();
    const {userData, backendUrl, setIsLoggedIn, setUserData} = useContext(AppContext);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if(dropdownRef.current && !dropdownRef.current.contains(event.target)){
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    } , []);

    const sendVerificationOTP = async () => {
        try{
            axios.defaults.withCredentials = true;
            const response = await axios.post(backendUrl + "/send-otp");
            if(response.status === 200){
                navigate("/email-verify");
                toast.success("OTP has been sent to your email");
            }else{
                toast.error("Failed to send OTP");
            }
        }catch(error){
            toast.error(error.response?.data?.message || "Failed to send OTP");
        }
    }

    const handlelogout = async () => {
        try{
            axios.defaults.withCredentials = true;
            await axios.post(backendUrl + "/logout");
            localStorage.removeItem('token');
            setIsLoggedIn(false);
            setUserData(null);
            toast.success("Logged out successfully");
            navigate('/');
        } catch (error) {
            console.error("Logout error:", error);
            // Still clear local data even if server logout fails
            localStorage.removeItem('token');
            setIsLoggedIn(false);
            setUserData(null);
            navigate('/');
        }
    }


    return (
        <nav className="navbar bg-white px-5 py-4 d-flex justify-content-between align-items-center ">
            
            <div className="d-flex align-items-center gap-2">
                <span style={{fontSize: "1.5rem"}}>🛡️</span>
                <span className="fw-bold fs-4 text-dark">Auth<span className="text-primary">X</span></span>
            </div>

            {userData ? (
                <div className="position-relative" ref={dropdownRef}>
                    <div className="bg-dark text-white rounded-circle d-flex justify-content-center align-items-center"
                        style={{width: "40px", height: "40px", cursor: "pointer", userSelect: "none"}}
                        onClick={() => setDropdownOpen((prev) => !prev)}>
                        {userData.name.charAt(0).toUpperCase()}
                    </div>

                {dropdownOpen && (
                    <div className="position-absolute shadow bg-white rounded p-2"
                            style={{top: "50px", right: 0, zIndex: 100}}>
                        
                        {!userData.isAccountVerified && (
                            <div className="dropdown-item py-1 px-2" style={{cursor:"pointer"}} onClick={sendVerificationOTP}>
                                Verify Email
                            </div>
                        )}

                        <div className="dropdown-item py-1 px-2 text-danger" style={{cursor:"pointer"}} onClick={handlelogout}>
                            Logout
                        </div>


                    </div>
                )}  
                </div>
            ) : (
                <div className="btn btn-outline-dark rounded-pill px-3" onClick={ () => navigate('/login')}>
                    Login
                </div>
            )}
        </nav>
    )
}

export default MenuBar;