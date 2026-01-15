import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

const Login = () => {

    const [isCreateAccount, setIsCreateAccount] = useState(false);
    const [name , setName] = useState("");
    const [email , setEmail] = useState("");
    const [password , setPassword] = useState("");
    const [loading , setLoading] = useState(false);
    const {backendUrl , setIsLoggedIn , getUserData} = useContext(AppContext);
    const navigate = useNavigate();
 
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            if (isCreateAccount) {
                const response = await axios.post(`${backendUrl}/register`, {name, email, password});
                if (response.status === 201) {
                    toast.success("Account created successfully! Please verify your email.");
                    navigate('/');
                }else{
                    toast.error("Email already in use!");
                }
            } else {
                const response = await axios.post(`${backendUrl}/login`, {email, password});
                if (response.status === 200) {
                    // Store the JWT token
                    if (response.data.token) {
                        localStorage.setItem('token', response.data.token);
                    }
                    setIsLoggedIn(true);
                    getUserData();
                    toast.success("Login successful!");
                    navigate('/');
                } else {
                    toast.error("Invalid credentials!");
                }
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="position-relation min-vh-100 d-flex justify-content-center align-items-center"
        style={{background:"linear-gradient(90deg,#6a5af9,#8268f9)", border:"none"}}>


            <div style={{position:"absolute" , top:"20px", left:"30px", display:"flex", alignItems:"center"}}>
                <Link to="/" style={{
                    display:"flex",
                    gap:5,
                    alignItems:"center",
                    fontWeight:"bold",
                    fontSize:"24px",
                    textDecoration:"none"
                }}>
                    <span style={{fontSize: "1.5rem"}}>🛡️</span>
                    <span className="fw-bold fs-4 text-light">Auth<span className="text-danger">X</span></span>   
                </Link>
            </div>

            <div className="card p-4" style={{maxWidth:"400px", width:"100%"}}>
                <h2 className="text-center mb-4">
                    {isCreateAccount ? "Create Account" : "Login"}
                </h2>
                <form onSubmit={onSubmitHandler}>
                    {isCreateAccount && (
                        <div className="mb-3">
                            <label htmlFor="fullname" className="form-label"> Full Name</label>
                            <input type="text" className="form-control" id="fullname" placeholder="Enter full name" required  onChange={(e => setName(e.target.value))} value={name}/>
                        </div>
                    )}
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" className="form-control" id="email" placeholder="Enter your email" required onChange={(e => setEmail(e.target.value))} value={email}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" className="form-control" id="password" placeholder="**********" required onChange={(e => setPassword(e.target.value))} value={password}/>
                    </div>

                    <div className="d-flex justify-content-center mb-3">
                        <Link to="/reset-password" style={{textDecoration:"none"}}>Forgot Password?</Link>
                    </div>

                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                        {loading ? "Loading..." : isCreateAccount ? "Create Account" : "Login"}
                    </button>
                </form>

                <div className="text-center mt-3">
                    <p>
                        {isCreateAccount ? "Already have an account?" : "Don't have an account?"}
                        <button className="btn btn-link p-0" onClick={() => setIsCreateAccount(!isCreateAccount)}>
                            {isCreateAccount ? "Login" : "Create"}
                        </button>
                    </p>
                </div>

                <div className="text-center mt-3">
                    <p className="small">
                        By signing up, you agree to our <a href="#" style={{textDecoration:"none"}}>Terms of Service</a> and <a href="#" style={{textDecoration:"none"}}>Privacy Policy</a>
                    </p>
                </div>





            </div>



        </div>
    )
}   

export default Login;