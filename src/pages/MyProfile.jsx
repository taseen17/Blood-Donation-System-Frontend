import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Droplet, Home, LogOut, Pencil, X, Check, BadgeCheck, ShieldAlert } from "lucide-react";
import { AuthContext } from "../Context/AuthContext";
import toast from "react-hot-toast";
import { apiRequest, jsonBody } from "../lib/api";

const ROLE_LABELS = {
    donor: "Donor",
    requester: "Requester",
    hospital: "Hospital",
    admin: "Admin",
};

function formatMemberSince(isoDate) {
    if (!isoDate) return "";
    return new Date(isoDate).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

function getInitials(name) {
    if (!name) return "?";
    return name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

export default function MyProfile() {
    const navigate = useNavigate();
    const { user, setUser, logout } = useContext(AuthContext);

    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState(() => ({ name: user?.name || "", phone_number: user?.phone_number || "", city: user?.city || "", area: user?.area || "" }));
    const [error, setError] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCancel = () => {
        setForm({
            name: user.name,
            phone_number: user.phone_number,
            city: user.city,
            area: user.area,
        });
        setError("");
        setIsEditing(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setError("");
        setIsSaving(true);

        try {
            await apiRequest("/update_user", { method: "PUT", body: jsonBody(form) });
            const updatedUser = { ...user, ...form };
            setUser(updatedUser);
            toast.success("Profile updated successfully.");
            setIsEditing(false);
        } catch (err) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    if (!user) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <p className="text-sm text-slate-500">Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Top bar */}
            <div className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
                    <Link to="/" className="flex items-center gap-2">
                        <Droplet className="h-6 w-6 text-red-600" fill="currentColor" strokeWidth={0} />
                        <span className="text-lg font-semibold text-slate-900">BloodLink</span>
                    </Link>
                    <div className="flex items-center gap-2"><Link to="/" className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"><Home className="h-4 w-4" />Home</Link><button onClick={handleLogout} className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"><LogOut className="h-4 w-4" />Log out</button></div>
                </div>
            </div>

            <div className="mx-auto max-w-3xl px-6 py-10">
                {/* Header card */}
                <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-xl font-semibold text-white">
                                {getInitials(user.name)}
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold text-slate-900">{user.name}</h1>
                                <p className="text-sm text-slate-500">{user.email}</p>
                                <div className="mt-2 flex items-center gap-2">
                                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                                        {ROLE_LABELS[user.role] || user.role}
                                    </span>
                                    {user.is_verified ? (
                                        <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                                            <BadgeCheck className="h-3.5 w-3.5" />
                                            Verified
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                                            <ShieldAlert className="h-3.5 w-3.5" />
                                            Not verified
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                            >
                                <Pencil className="h-3.5 w-3.5" />
                                Edit profile
                            </button>
                        )}
                    </div>

                    <p className="mt-4 text-xs text-slate-400">
                        Member since {formatMemberSince(user.created_at)}
                    </p>
                </div>

                {/* Details / edit form */}
                <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
                    <h2 className="text-sm font-semibold text-slate-900">Profile details</h2>

                    {error && (
                        <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {!isEditing ? (
                        <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Full name
                                </dt>
                                <dd className="mt-1 text-sm text-slate-900">{user.name}</dd>
                            </div>
                            <div>
                                <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Phone number
                                </dt>
                                <dd className="mt-1 text-sm text-slate-900">{user.phone_number}</dd>
                            </div>
                            <div>
                                <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    City
                                </dt>
                                <dd className="mt-1 text-sm text-slate-900">{user.city}</dd>
                            </div>
                            <div>
                                <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Area
                                </dt>
                                <dd className="mt-1 text-sm text-slate-900">{user.area}</dd>
                            </div>
                        </dl>
                    ) : (
                        <form onSubmit={handleSave} className="mt-4 space-y-4">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                                        Full name
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        value={form.name}
                                        onChange={handleChange}
                                        className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
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
                                        required
                                        value={form.phone_number}
                                        onChange={handleChange}
                                        className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                                    />
                                </div>
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
                                        className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
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
                                        className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex items-center gap-1.5 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <Check className="h-4 w-4" />
                                    {isSaving ? "Saving..." : "Save changes"}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="flex items-center gap-1.5 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                                >
                                    <X className="h-4 w-4" />
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

