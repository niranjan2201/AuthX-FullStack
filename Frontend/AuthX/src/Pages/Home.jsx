import MenuBar from "../Components/MenuBar";
import Header from "../Components/Header";

const Home = () => {
    return (
           <>
                <MenuBar/>
                <div className="d-flex flex-column align-items-center justify-content-center min-vh-100">
                    <Header/>
                </div>
           </>
    )
}

export default Home;