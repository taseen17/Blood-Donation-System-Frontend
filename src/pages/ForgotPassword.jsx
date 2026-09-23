import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, KeyRound } from "lucide-react";
import toast from "react-hot-toast";
import { apiRequest } from "../lib/api";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [busy, setBusy] = useState(false);
    const submit = async (event) => {
        event.preventDefault();
        if (password.length < 8) return toast.error("Use at least 8 characters for your new password.");
        setBusy(true);
        try { await apiRequest(`/forget_password?email=${encodeURIComponent(email)}&new_password=${encodeURIComponent(password)}`, { method: "PUT" }); toast.success("Password updated successfully."); setEmail(""); setPassword(""); }
        catch (err) { toast.error(err.message); }
        finally { setBusy(false); }
    };
    return <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5"><div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"><Link to="/login" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"><ArrowLeft className="h-4 w-4" />Back to login</Link><KeyRound className="mt-8 h-9 w-9 text-red-600" /><h1 className="mt-4 text-2xl font-bold text-slate-900">Reset your password</h1><p className="mt-2 text-sm text-slate-500">The current backend requires an authenticated session for this action.</p><form onSubmit={submit} className="mt-7 space-y-4"><label className="block text-sm font-medium text-slate-700">Account email<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-red-500" /></label><label className="block text-sm font-medium text-slate-700">New password<input required minLength="8" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-red-500" /></label><button disabled={busy} className="w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">{busy ? "Updating..." : "Update password"}</button></form></div></main>;
}
