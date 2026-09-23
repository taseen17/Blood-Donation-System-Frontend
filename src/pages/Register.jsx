import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Droplet, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

const API_BASE_URL = "https://blood-donation-system-backend-1v44.onrender.com";

const ROLES = [
    { value: "donor", label: "Donor", description: "I want to donate blood" },
    { value: "requester", label: "Requester", description: "I need blood for someone" },
];

export default function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone_number: "",
        role: "donor",
        city: "",
        area: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (form.password !== form.confirmPassword) {
            setError("Passwords don't match.");
            return;
        }
        if (form.password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    hashed_password: form.password,
                    phone_number: form.phone_number,
                    role: form.role,
                    city: form.city,
                    area: form.area,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || "Couldn't create your account. Please try again.");
            }

            toast.success("Account created. You can sign in now.");
            navigate("/login");
        } catch (err) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

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
                        One registration is all it takes to show up when someone nearby
                        needs blood urgently.
                    </p>
                    <p className="mt-4 text-sm text-slate-400">
                        Whether you're donating, requesting, or managing a blood bank,
                        your account keeps everything in one place.
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

                    <h1 className="text-2xl font-semibold text-slate-900">Create your account</h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Join as a donor, requester, or hospital.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                        {error && (
                            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        {/* Role selection */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700">
                                I am registering as
                            </label>
                            <div className="mt-1.5 grid grid-cols-3 gap-2">
                                {ROLES.map((role) => (
                                    <button
                                        key={role.value}
                                        type="button"
                                        onClick={() => setForm((prev) => ({ ...prev, role: role.value }))}
                                        className={`rounded-md border px-3 py-2.5 text-center text-sm font-medium transition-colors ${form.role === role.value
                                                ? "border-red-600 bg-red-50 text-red-700"
                                                : "border-slate-300 text-slate-600 hover:border-slate-400"
                                            }`}
                                    >
                                        {role.label}
                                    </button>
                                ))}
                            </div>
                            <p className="mt-1.5 text-xs text-slate-500">
                                {ROLES.find((r) => r.value === form.role)?.description}
                            </p>
                        </div>

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                                Full name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                required
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Your full name"
                                className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={form.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="phone_number" className="block text-sm font-medium text-slate-700">
                                Phone number
                            </label>
                            <input
                                id="phone_number"
                                name="phone_number"
                                type="tel"
                                autoComplete="tel"
                                required
                                value={form.phone_number}
                                onChange={handleChange}
                                placeholder="01XXXXXXXXX"
                                className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label htmlFor="city" className="block text-sm font-medium text-slate-700">
                                    City
                                </label>
                                <input
                                    id="city"
                                    name="city"
                                    type="text"
                                    required
                                    value={form.city}
                                    onChange={handleChange}
                                    placeholder="Dhaka"
                                    className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="area" className="block text-sm font-medium text-slate-700">
                                    Area
                                </label>
                                <input
                                    id="area"
                                    name="area"
                                    type="text"
                                    required
                                    value={form.area}
                                    onChange={handleChange}
                                    placeholder="Mirpur"
                                    className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                                Password
                            </label>
                            <div className="relative mt-1.5">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    required
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="At least 8 characters"
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

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
                                Confirm password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                autoComplete="new-password"
                                required
                                value={form.confirmPassword}
                                onChange={handleChange}
                                placeholder="Re-enter your password"
                                className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-md bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting ? "Creating account..." : "Create account"}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-slate-600">
                        Already have an account?{" "}
                        <Link to="/login" className="font-medium text-red-600 hover:text-red-700">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}