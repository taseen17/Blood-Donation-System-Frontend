import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


const HomeLayout = () => {
    return (
        <div>
            <Navbar/>
            <Outlet></Outlet>
            <Footer></Footer>
            
        </div>
    );
};

export default HomeLayout;