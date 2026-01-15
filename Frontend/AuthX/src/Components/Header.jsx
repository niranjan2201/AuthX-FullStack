import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const Header = () => {

    const {userData} = useContext(AppContext);

    return(
        <div className="text-center d-flex flex-column align-items-center justify-content-center py-5 px-3" style={{minHeight: "80vh" }}>
            
            <div className="mb-4 d-flex align-items-center justify-content-center bg-light rounded-circle" style={{width: "120px", height: "120px"}}>
                <span style={{fontSize: "3rem"}}>💻</span>
            </div>
        
            <h5 className="fw-semibold">
                Hey {userData ? userData.name : "Developer"} <span role="img" aria-label="wave">👋</span>
            </h5>
            <h1 className="fw-bold display-5 mb-3">Welcome to Auth<span className="text-primary">X</span></h1>

            <p className="text-muted fs-5 mb-4" style={{maxWidth:"500px"}}>
                Let's start with a simple authentication system for your application!
            </p>

            <button className="btn btn-outline-dark rounded-pill px-4 py-2">
                Get Started
            </button>


        </div>
    



    )
}

export default Header;