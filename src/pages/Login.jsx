import { Link, useNavigate } from "react-router-dom";
import { Droplet, Eye, EyeOff } from "lucide-react";
import { useContext, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import toast from "react-hot-toast";


const API_BASE_URL = "https://blood-donation-system-backend-1v44.onrender.com";

const Login = () => {

    const { setAccessToken, setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [form, setForm] = useState({ username: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(form),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || "Couldn't sign you in. Check your name and password.");
            }

            setAccessToken(data.access_token);
            await get_user(data.access_token);
            toast.success("Welcome back to BloodLink.");
            const currentUser = JSON.parse(localStorage.getItem("user"));
            navigate(currentUser?.role === "admin" ? "/admin" : "/dashboard");
        } catch (err) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const get_user = async (token) => {
        const userRes = await fetch(`${API_BASE_URL}/me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const userData = await userRes.json()

        if (!userRes.ok) {
            throw new Error(userData.detail || "Unable to load your user profile.");
        }

        setUser(userData)
        localStorage.setItem("access_token", token);
        localStorage.setItem("user", JSON.stringify(userData));
    }


    return (
        <div className="flex min-h-screen">
            {/* Left panel — brand / mission */}
            <div className="relative hidden w-1/2 flex-col justify-between bg-slate-900 p-12 text-white lg:flex">
                <Link to="/" className="flex items-center gap-2">
                    <Droplet className="h-6 w-6 text-red-500" fill="currentColor" strokeWidth={0} />
                    <span className="text-lg font-semibold">BloodLink</span>
                </Link>

                <div className="max-w-sm">
                    <p className="text-2xl font-medium leading-snug">
                        Every donor here is one search away from being the reason
                        someone's family isn't waiting in a hospital corridor.
                    </p>
                    <p className="mt-4 text-sm text-slate-400">
                        Sign in to check nearby requests, update your availability, or see
                        who's responded to yours.
                    </p>
                </div>

                <p className="text-xs text-slate-500">
                    &copy; {new Date().getFullYear()} BloodLink
                </p>
            </div>

            {/* Right panel — form */}
            <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-20">
                <div className="mx-auto w-full max-w-sm">
                    <div className="mb-8 flex items-center gap-2 lg:hidden">
                        <Droplet className="h-6 w-6 text-red-600" fill="currentColor" strokeWidth={0} />
                        <span className="text-lg font-semibold text-slate-900">BloodLink</span>
                    </div>

                    <h1 className="text-2xl font-semibold text-slate-900">Welcome back</h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Sign in to your account to continue.
                    </p>

                    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                        {error && (
                            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-slate-700">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                value={form.username}
                                onChange={handleChange}
                                placeholder="Your username"
                                className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                                    Password
                                </label>
                                <Link
                                    to="/forgot-password"
                                    className="text-sm font-medium text-red-600 hover:text-red-700"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative mt-1.5">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    className="w-full rounded-md border border-slate-300 px-3 py-2 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-md bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting ? "Signing in..." : "Sign in"}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-slate-600">
                        Don't have an account?{" "}
                        <Link to="/signup" className="font-medium text-red-600 hover:text-red-700">
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;