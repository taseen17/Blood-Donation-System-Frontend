import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Activity, CheckCircle2, Droplet, Shield, Trash2, Users, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { apiRequest } from "../lib/api";

const resources = {
    users: { label: "Users", path: "/admin/users", key: "users" },
    donors: { label: "Donors", path: "/admin/donors", key: "donors" },
    requests: { label: "Blood requests", path: "/admin/blood_requests", key: "blood_requests" },
    responses: { label: "Responses", path: "/admin/request_responses", key: "request_responses" },
    notifications: { label: "Notifications", path: "/admin/notifications", key: "notifications" },
};
const deletePaths = { users: "delete_user", donors: "delete_donor", requests: "delete_blood_request", responses: "delete_request_response", notifications: "delete_notification" };

export default function AdminDashboard() {
    const [summary, setSummary] = useState(null);
    const [data, setData] = useState({});
    const [tab, setTab] = useState("users");
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const load = async () => {
        setLoading(true);
        try {
            const [summaryResult, ...resourceResults] = await Promise.all([apiRequest("/admin/summary"), ...Object.values(resources).map((resource) => apiRequest(resource.path))]);
            setSummary(summaryResult?.summary || {});
            const nextData = {};
            Object.values(resources).forEach((resource, index) => { nextData[resource.key] = resourceResults[index]?.[resource.key] || []; });
            setData(nextData);
        } catch (err) { toast.error(err.message); }
        finally { setLoading(false); }
    };
    useEffect(() => { Promise.resolve().then(load); }, []);

    const remove = async (kind, id) => {
        if (!window.confirm("Delete this record? This cannot be undone.")) return;
        try { await apiRequest(`/admin/${deletePaths[kind]}/${id}`, { method: "DELETE" }); toast.success("Record deleted."); await load(); }
        catch (err) { toast.error(err.message); }
    };
    const verify = async (id) => {
        try { await apiRequest(`/admin/verify_user/${id}`, { method: "PUT" }); toast.success("User verified."); await load(); }
        catch (err) { toast.error(err.message); }
    };
    const items = (data[resources[tab].key] || []).filter((item) => JSON.stringify(item).toLowerCase().includes(search.toLowerCase()));
    const cards = [{ label: "Users", value: summary?.total_users, icon: Users }, { label: "Donors", value: summary?.total_donors, icon: Droplet }, { label: "Requests", value: summary?.total_blood_requests, icon: Activity }, { label: "Notifications", value: summary?.total_notifications, icon: Shield }];

    return <div className="min-h-screen bg-[#f7f8fa]"><header className="border-b border-slate-200 bg-slate-950 text-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4"><Link to="/" className="flex items-center gap-2 font-semibold"><Droplet className="text-red-500" fill="currentColor" />BloodLink <span className="ml-2 rounded bg-red-600/20 px-2 py-1 text-xs text-red-300">Admin</span></Link><div className="flex items-center gap-3"><Link to="/dashboard" className="text-sm text-slate-300 hover:text-white">User view</Link><Link to="/myprofile" className="rounded-lg border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800">Profile</Link></div></div></header><main className="mx-auto max-w-7xl px-5 py-8"><div className="mb-7 flex items-end justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-widest text-red-600">Control center</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Keep the network healthy.</h1><p className="mt-2 text-slate-500">Review platform activity and manage records.</p></div><button onClick={load} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50"><RefreshCw className="h-4 w-4" />Refresh</button></div><div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{cards.map(({ label, value, icon: Icon }) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><Icon className="h-5 w-5 text-red-600" /><p className="mt-4 text-sm text-slate-500">{label}</p><strong className="mt-1 block text-3xl">{value ?? "-"}</strong></div>)}</div><div className="rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex flex-col gap-4 border-b border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between"><div className="flex gap-1 overflow-x-auto">{Object.entries(resources).map(([id, resource]) => <button key={id} onClick={() => { setTab(id); setSearch(""); }} className={`shrink-0 rounded-lg px-3 py-2 text-sm font-medium ${tab === id ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-100"}`}>{resource.label}</button>)}</div><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search records" className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-red-500" /></div>{loading ? <p className="p-10 text-center text-sm text-slate-500">Loading admin data...</p> : !items.length ? <p className="p-10 text-center text-sm text-slate-500">No records found.</p> : <div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">Record</th><th className="px-5 py-3">Details</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{items.map((item) => <tr key={item.id}><td className="px-5 py-4 font-medium text-slate-900">#{item.id} {item.name || item.patient_name || item.message || "Record"}</td><td className="px-5 py-4 text-slate-500">{item.email || item.hospital_name || item.blood_group || item.type || "-"}</td><td className="px-5 py-4">{item.is_verified ? <span className="inline-flex items-center gap-1 text-emerald-600"><CheckCircle2 className="h-4 w-4" />Verified</span> : item.role || item.status || item.response_status || "-"}</td><td className="px-5 py-4 text-right"><div className="flex justify-end gap-2">{tab === "users" && !item.is_verified && <button onClick={() => verify(item.id)} className="rounded-md border border-emerald-200 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50">Verify</button>}<button onClick={() => remove(tab, item.id)} className="inline-flex items-center gap-1 rounded-md border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" />Delete</button></div></td></tr>)}</tbody></table></div>}</div></main></div>;
}
