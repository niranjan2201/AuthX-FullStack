import { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppConstants } from "../Util/Constants";
import { AppContext } from "../Context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {

    const inputRef = useRef([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [isEmailSend, setIsEmailSend] = useState(false);
    const [OTP , setOtp] = useState("");
    const [isOTPSubmitted, setIsOTPSubmitted] = useState(false);
    const {getUserData, isLoggedIn, userData, backendUrl} = useContext(AppContext);
    
    axios.defaults.withCredentials = true;

    const handleChange = (e, index) => {
        const value = e.target.value.replace(/\D/g, '');
        e.target.value = value;
        if(value && index < 5) {
            inputRef.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
            inputRef.current[index - 1].focus();
        }
    };

    const handlePaste = (e) =>{
        e.preventDefault();
        const paste = e.clipboardData.getData('text').slice(0, 6).split("");
        paste.forEach( (digit,i) => {
            if(inputRef.current[i]) {
                inputRef.current[i].value = digit;
            }
        });
        const next = paste.length < 6 ? paste.length : 5;
        inputRef.current[next].focus();
    }

    const onSubmitEmail = async (e) => {
        e.preventDefault();
        setLoading(true);
        try{
            const response = await axios.post(backendUrl + "/send-reset-otp?email=" + email);
            if(response.status === 200){
                toast.success("OTP sent successfully");
                setIsEmailSend(true);
            }else{
                toast.error("Failed to send OTP please try again");
            }
        }catch(error){
            toast.error(error.message);
        }finally{
            setLoading(false);
        }
    }

    const handleVerify = async () => {
        const otp = inputRef.current.map((input) => input.value).join("");
        if(otp.length < 6){
            toast.error("Please enter 6 digit OTP");
            return;
        }
        setOtp(otp);
        setIsOTPSubmitted(true);
    }

    const onSubmitNewPassowrd = async (e) => {
        e.preventDefault();
        setLoading(true);
        try{
            const response = await axios.post(backendUrl + "/reset-password", {
                email: email,
                otp: OTP,
                newPassword: newPassword
            });
            if(response.status === 200){
                toast.success("Password reset successfully");
                navigate("/login");
            }else{
                toast.error("Failed to reset password please try again");
            }
        }catch(error){
            toast.error(error.message);
        }finally{
            setLoading(false);
        }
    }

    return (
        <div className="d-flex align-items-center justify-content-center vh-100 position-relative"
        style={{background: "linear-gradient(90deg, #6a5af9, #8268f9)", border:"none"}}>
            <Link to="/" className="position-absolute top-0 start-0 p-4 d-flex align-items-center gap-2 text-decoration-none">
                <span style={{fontSize: "1.5rem"}}>🛡️</span>
                <span className="fs-4 fw-semibold text-light">Auth<span className="text-warning">X</span></span>
            </Link>

            {/* Reset Password card*/}
            {!isEmailSend && (
                <div className="card rounded-4 p-5 text-center bg-white"
                style={{width:"100%", maxWidth:"400px"}}>
                    <h4 className="mb-2 py-2">Reset Password</h4>
                    <p className="mb-4">Enter your registered email address</p>
                    <form onSubmit={onSubmitEmail}>
                        <div className="input-group mb-4">
                            <span className="input-group-text">
                                <span>✉️</span>
                            </span>
                            <input type="email" className="form-control" placeholder="Enter email address" 
                            onChange={(e) => setEmail(e.target.value)}
                            value={email} required />
                        </div>
                        <button className="btn btn-primary w-100 py-2 rounded-pill " type="submit" disabled={loading} >
                            {loading ? "Loading..." : "Send OTP"}
                        </button>
                    </form>
                </div>
            )}

            {/* Card for OTP*/}
            {isEmailSend && !isOTPSubmitted && (
                <div className="p-5 rounded-4 shadow bg-white"
                style={{width:"400px"}}>
                    <h4 className="text-center fw-semibold mb-2">Email Verify OTP</h4>
                    <p className="text-center mb-4">
                        Enter the 6-digit code sent to your email.
                    </p>
                    <div className="d-flex justify-content-between gap-2 mb-4">
                        {[...Array(6)].map((_, index) => (
                            <input key={index} 
                            type="text" 
                            maxLength="1" 
                            className="form-control text-center fs-4 otp-input"
                            ref={(el) => (inputRef.current[index] = el)}
                            onChange={(e) => handleChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onPaste={handlePaste}
                            />
                        ))}
                    </div>
                    <button className="btn btn-primary w-100 fw-semibold" disabled={loading} onClick={handleVerify}>
                        {loading ? "Loading..." : "Submit"}
                    </button>
                </div>
            )}

            {/* New Password form */}
            {isOTPSubmitted && isEmailSend && (
                <div className="card rounded-4 p-5 text-center bg-white" style={{width:"100%", maxWidth:"400px"}}>
                    <h4 className="mb-2 py-2"> New Password</h4>
                    <p className="mb-4">Enter your new password</p>
                    <form onSubmit={onSubmitNewPassowrd}>
                        <div className="input-group mb-4">
                            <span className="input-group-text">
                                <span>🔒</span>
                            </span>
                            <input type="password" className="form-control" placeholder="**********" 
                            onChange={(e) => setNewPassword(e.target.value)}
                            value={newPassword} required />
                        </div>
                        <button className="btn btn-primary w-100 py-2 rounded-pill" type="submit" disabled={loading}>
                            {loading ? "Loading..." : "Reset Password"}
                        </button>
                    </form>
                </div>
            )}


        </div>
    )
}

export default ResetPassword;