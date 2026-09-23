import { Link } from "react-router";
import { FaSearch } from "react-icons/fa";
import { Droplet, LogOut } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext)
    const links = user ? [
        { to: user.role === "admin" ? "/admin" : "/dashboard", label: user.role === "admin" ? "Admin" : "Dashboard" },
        { to: "/myprofile", label: "My Profile" },
    ] : [];
    return (
        <div>
            <div className="max-lg:collapse bg-base-300 shadow-sm w-full rounded-md">
                <input id="navbar-1-toggle" className="peer hidden" type="checkbox" />
                <label htmlFor="navbar-1-toggle" className="fixed inset-0 hidden max-lg:peer-checked:block"></label>
                <div className="collapse-title navbar">
                    <div className="navbar-start">
                        <label htmlFor="navbar-1-toggle" className="btn btn-ghost lg:hidden">
                            <svg aria-label="Menu" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                        </label>
                        <Link to="/" className="flex items-center gap-2">
                            <Droplet className="h-6 w-6 text-red-500" fill="currentColor" strokeWidth={0} />
                            <span className="text-lg font-semibold">BloodLink</span>
                        </Link>
                    </div>
                    <div className="navbar-center hidden lg:flex">
                        <ul className="menu menu-horizontal px-1">
                            <li><Link to="/">Home</Link></li>
                            {user ? links.map((link) => <li key={link.to}><Link to={link.to}>{link.label}</Link></li>) : <><li><Link to="/login">Login</Link></li><li><Link to="/signup">Register</Link></li></>}
                            {user && <li><button onClick={logout} className="flex items-center gap-2"><LogOut className="h-4 w-4" />Logout</button></li>}
                        </ul>
                    </div>
                    <div className="navbar-end">
                        <input type="text" placeholder="Search for blood donors..." className="input w-64 lg:w-auto" />
                        <button className="btn btn-square">
                            <FaSearch />
                        </button>
                    </div>
                </div>

                <div className="collapse-content lg:hidden z-1">
                    <ul className="menu">
                        <li><Link to="/">Home</Link></li>
                        {user ? links.map((link) => <li key={link.to}><Link to={link.to}>{link.label}</Link></li>) : <><li><Link to="/login">Login</Link></li><li><Link to="/signup">Register</Link></li></>}
                        {user && <li><button onClick={logout} className="flex items-center gap-2"><LogOut className="h-4 w-4" />Logout</button></li>}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Navbar;