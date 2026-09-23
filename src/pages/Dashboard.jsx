import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Activity, Bell, Droplet, HeartPulse, Home, MapPin, Phone, Plus, RefreshCw, Search, ShieldCheck, UserRound, Users } from "lucide-react";
import toast from "react-hot-toast";
import { AuthContext } from "../Context/AuthContext";
import { apiRequest, jsonBody } from "../lib/api";

const groups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const emptyDonor = { blood_group: "A+", last_donation_date: "", date_of_birth: "", is_available: true, total_donations: 0, medical_notes: "" };
const emptyRequest = { patient_name: "", patient_age: "", blood_group: "A+", quantity: 1, urgency_level: "normal", hospital_name: "", city: "", area: "", contact_number: "" };

function Panel({ title, action, children }) {
    return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4 flex items-center justify-between gap-3"><h2 className="font-semibold text-slate-900">{title}</h2>{action}</div>{children}</section>;
}
function Field({ label, ...props }) { return <label className="block text-sm font-medium text-slate-700">{label}<input {...props} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100" /></label>; }
function Select({ label, children, ...props }) { return <label className="block text-sm font-medium text-slate-700">{label}<select {...props} className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100">{children}</select></label>; }

export default function Dashboard() {
    const { user } = useContext(AuthContext);
    const [tab, setTab] = useState("overview");
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const [donors, setDonors] = useState([]);
    const [requests, setRequests] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [donations, setDonations] = useState([]);
    const [myResponses, setMyResponses] = useState([]);
    const [donorForm, setDonorForm] = useState(emptyDonor);
    const [requestForm, setRequestForm] = useState(emptyRequest);
    const [filter, setFilter] = useState({ search: "", blood_group: "", city: "", urgency: "" });

    const loadData = async () => {
        setLoading(true); setError("");
        const results = await Promise.allSettled([
            apiRequest("/donor/available"),
            apiRequest("/blood_request/available"),
            apiRequest("/notifications/me"),
            apiRequest("/donations/me"),
        ]);
        const [donorResult, requestResult, notificationResult, donationResult] = results;
        if (donorResult.status === "fulfilled") setDonors(donorResult.value || []);
        if (requestResult.status === "fulfilled") {
            const availableRequests = requestResult.value || [];
            setRequests(availableRequests);
            const ownedRequests = availableRequests.filter((request) => String(request.requester_id) === String(user.id));
            const responseResults = await Promise.allSettled(ownedRequests.map((request) => apiRequest(`/blood_request/responses?request_id=${request.id}`)));
            setMyResponses(responseResults.flatMap((result, index) => result.status === "fulfilled" ? result.value.map((response) => ({ ...response, request_id: ownedRequests[index].id })) : []));
        }
        if (notificationResult.status === "fulfilled") setNotifications(notificationResult.value || []);
        if (donationResult.status === "fulfilled") setDonations(donationResult.value || []);
        if (results.every((result) => result.status === "rejected")) setError("The dashboard data could not be loaded. Please try again.");
        setLoading(false);
    };
    useEffect(() => { Promise.resolve().then(loadData); }, []);

    const filteredDonors = useMemo(() => donors.filter((donor) => {
        const haystack = `${donor.name || ""} ${donor.city || ""} ${donor.area || ""}`.toLowerCase();
        return (!filter.search || haystack.includes(filter.search.toLowerCase())) && (!filter.blood_group || donor.blood_group === filter.blood_group) && (!filter.city || `${donor.city || ""}`.toLowerCase().includes(filter.city.toLowerCase()));
    }), [donors, filter]);
    const filteredRequests = useMemo(() => requests.filter((request) => {
        const haystack = `${request.patient_name || ""} ${request.hospital_name || ""} ${request.city || ""}`.toLowerCase();
        return (!filter.search || haystack.includes(filter.search.toLowerCase())) && (!filter.blood_group || request.blood_group === filter.blood_group) && (!filter.urgency || request.urgency_level === filter.urgency);
    }), [requests, filter]);

    const submit = async (event, path, body, success, reset) => {
        event.preventDefault(); setBusy(true);
        try { await apiRequest(path, { method: "POST", body: jsonBody(body) }); toast.success(success); reset(); await loadData(); }
        catch (err) { toast.error(err.message); }
        finally { setBusy(false); }
    };
    const respond = async (requestId, status) => {
        try { await apiRequest(`/request_response?request_id=${requestId}`, { method: "POST", body: jsonBody({ response_status: status }) }); toast.success(`Response ${status}.`); }
        catch (err) { toast.error(err.message); }
    };
    const markRead = async (notification) => {
        try { await apiRequest(`/notifications/${notification.id}/read`, { method: "PUT" }); setNotifications((items) => items.map((item) => item.id === notification.id ? { ...item, is_read: true } : item)); }
        catch (err) { toast.error(err.message); }
    };

    const tabs = [{ id: "overview", label: "Overview", icon: Activity }, { id: "find", label: "Find help", icon: Search }, { id: "give", label: "Donate", icon: Droplet }, { id: "alerts", label: "Notifications", icon: Bell }];
    return <div className="min-h-screen bg-[#f7f8fa] text-slate-900">
        <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4"><Link to="/" className="flex items-center gap-2 font-semibold"><Droplet className="text-red-600" fill="currentColor" />BloodLink</Link><div className="flex items-center gap-2 text-sm"><Link className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-50" to="/"><Home className="h-4 w-4" />Home</Link><span className="hidden text-slate-500 sm:inline">Welcome, {user.name}</span><Link className="rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-50" to="/myprofile">Profile</Link></div></div></header>
        <main className="mx-auto max-w-7xl px-5 py-8"><div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="text-sm font-semibold uppercase tracking-widest text-red-600">Member dashboard</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Make every match count.</h1><p className="mt-2 max-w-xl text-slate-500">Find donors, answer requests, and keep your donation activity in one place.</p></div><button onClick={loadData} className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50"><RefreshCw className="h-4 w-4" />Refresh</button></div>
            <nav className="mb-6 flex gap-2 overflow-x-auto border-b border-slate-200">{tabs.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setTab(id)} className={`flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-sm font-medium ${tab === id ? "border-red-600 text-red-600" : "border-transparent text-slate-500 hover:text-slate-900"}`}><Icon className="h-4 w-4" />{label}</button>)}</nav>
            {myResponses.length > 0 && <div className="mb-5"><Panel title="Donor responses to your requests"><ResponseList responses={myResponses} loading={false} /></Panel></div>}
            {error && <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
            {loading ? <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">Loading your dashboard...</div> : <>
                {tab === "overview" && <div className="grid gap-5 md:grid-cols-3"><Panel title="Available donors"><div className="flex items-end justify-between"><strong className="text-4xl">{donors.length}</strong><Users className="h-8 w-8 text-red-500" /></div><button onClick={() => setTab("find")} className="mt-5 text-sm font-semibold text-red-600">Browse donors</button></Panel><Panel title="Open requests"><div className="flex items-end justify-between"><strong className="text-4xl">{requests.length}</strong><HeartPulse className="h-8 w-8 text-red-500" /></div><button onClick={() => setTab("find")} className="mt-5 text-sm font-semibold text-red-600">View requests</button></Panel><Panel title="Your donations"><div className="flex items-end justify-between"><strong className="text-4xl">{donations.length}</strong><ShieldCheck className="h-8 w-8 text-red-500" /></div><button onClick={() => setTab("give")} className="mt-5 text-sm font-semibold text-red-600">Record a donation</button></Panel><div className="md:col-span-3"><Panel title="Latest requests"><RequestList requests={filteredRequests.slice(0, 4)} onRespond={respond} /></Panel></div></div>}
                {tab === "find" && <div className="space-y-5"><Panel title="Search and filter"><div className="grid gap-3 md:grid-cols-4"><Field label="Search" placeholder="Name, hospital or city" value={filter.search} onChange={(e) => setFilter({ ...filter, search: e.target.value })} /><Select label="Blood group" value={filter.blood_group} onChange={(e) => setFilter({ ...filter, blood_group: e.target.value })}><option value="">All groups</option>{groups.map((group) => <option key={group}>{group}</option>)}</Select><Field label="City" placeholder="Filter by city" value={filter.city} onChange={(e) => setFilter({ ...filter, city: e.target.value })} /><Select label="Urgency" value={filter.urgency} onChange={(e) => setFilter({ ...filter, urgency: e.target.value })}><option value="">All urgency levels</option><option>normal</option><option>urgent</option><option>critical</option></Select></div></Panel><div className="grid gap-5 lg:grid-cols-2"><Panel title={`Donors (${filteredDonors.length})`}><DonorList donors={filteredDonors} /></Panel><Panel title={`Blood requests (${filteredRequests.length})`}><RequestList requests={filteredRequests} onRespond={respond} /></Panel></div></div>}
                {tab === "give" && <div className="grid gap-5 lg:grid-cols-2"><Panel title="Create donor profile"><form className="space-y-4" onSubmit={(e) => submit(e, "/donor", { ...donorForm, total_donations: Number(donorForm.total_donations) }, "Donor profile created.", () => setDonorForm(emptyDonor))}><div className="grid gap-3 sm:grid-cols-2"><Select label="Blood group" value={donorForm.blood_group} onChange={(e) => setDonorForm({ ...donorForm, blood_group: e.target.value })}>{groups.map((group) => <option key={group}>{group}</option>)}</Select><Field label="Date of birth" type="date" required value={donorForm.date_of_birth} onChange={(e) => setDonorForm({ ...donorForm, date_of_birth: e.target.value })} /><Field label="Last donation" type="date" required value={donorForm.last_donation_date} onChange={(e) => setDonorForm({ ...donorForm, last_donation_date: e.target.value })} /><Field label="Total donations" type="number" min="0" value={donorForm.total_donations} onChange={(e) => setDonorForm({ ...donorForm, total_donations: e.target.value })} /></div><Field label="Medical notes" placeholder="Optional notes" value={donorForm.medical_notes} onChange={(e) => setDonorForm({ ...donorForm, medical_notes: e.target.value })} /><button disabled={busy} className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"><Plus className="h-4 w-4" />Create donor profile</button></form></Panel><Panel title="Create blood request"><form className="space-y-4" onSubmit={(e) => submit(e, "/blood_request", { ...requestForm, patient_age: Number(requestForm.patient_age), quantity: Number(requestForm.quantity) }, "Blood request created.", () => setRequestForm(emptyRequest))}><div className="grid gap-3 sm:grid-cols-2"><Field label="Patient name" required value={requestForm.patient_name} onChange={(e) => setRequestForm({ ...requestForm, patient_name: e.target.value })} /><Field label="Patient age" type="number" min="0" required value={requestForm.patient_age} onChange={(e) => setRequestForm({ ...requestForm, patient_age: e.target.value })} /><Select label="Blood group" value={requestForm.blood_group} onChange={(e) => setRequestForm({ ...requestForm, blood_group: e.target.value })}>{groups.map((group) => <option key={group}>{group}</option>)}</Select><Field label="Quantity" type="number" min="1" required value={requestForm.quantity} onChange={(e) => setRequestForm({ ...requestForm, quantity: e.target.value })} /><Select label="Urgency" value={requestForm.urgency_level} onChange={(e) => setRequestForm({ ...requestForm, urgency_level: e.target.value })}><option>normal</option><option>urgent</option><option>critical</option></Select><Field label="Hospital" required value={requestForm.hospital_name} onChange={(e) => setRequestForm({ ...requestForm, hospital_name: e.target.value })} /><Field label="City" required value={requestForm.city} onChange={(e) => setRequestForm({ ...requestForm, city: e.target.value })} /><Field label="Area" required value={requestForm.area} onChange={(e) => setRequestForm({ ...requestForm, area: e.target.value })} /></div><Field label="Contact number" required value={requestForm.contact_number} onChange={(e) => setRequestForm({ ...requestForm, contact_number: e.target.value })} /><button disabled={busy} className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-60"><Plus className="h-4 w-4" />Post blood request</button></form></Panel></div>}
                {tab === "alerts" && <Panel title="Notifications"><div className="space-y-3">{notifications.length === 0 ? <Empty text="No notifications yet." /> : notifications.map((notification) => <div key={notification.id} className={`flex items-start justify-between gap-4 rounded-lg border p-4 ${notification.is_read ? "border-slate-200" : "border-red-200 bg-red-50/50"}`}><div><p className="text-sm text-slate-800">{notification.message}</p><p className="mt-1 text-xs text-slate-400">{notification.type}</p></div>{!notification.is_read && <button onClick={() => markRead(notification)} className="shrink-0 text-xs font-semibold text-red-600">Mark read</button>}</div>)}</div></Panel>}
            </>}
        </main>
    </div>;
}

function Empty({ text }) { return <p className="py-6 text-center text-sm text-slate-500">{text}</p>; }
function DonorList({ donors }) { if (!donors.length) return <Empty text="No donors match those filters." />; return <div className="space-y-3">{donors.map((donor) => <div key={donor.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3"><div><p className="font-medium text-slate-900">{donor.name || `Donor #${donor.id}`}</p><p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><MapPin className="h-3 w-3" />{donor.city || "Location not listed"}</p></div><span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700">{donor.blood_group}</span></div>)}</div>; }
function RequestList({ requests, currentUser, onRespond, onViewResponses }) { if (!requests.length) return <Empty text="No open blood requests." />; return <div className="space-y-3">{requests.map((request) => { const isOwner = String(request.requester_id) === String(currentUser?.id); return <div key={request.id} className="rounded-lg border border-slate-200 p-3"><div className="flex items-start justify-between gap-3"><div><p className="font-medium">{request.patient_name}</p><p className="mt-1 text-xs text-slate-500">{request.hospital_name} · {request.city}</p></div><span className={`rounded-full px-2 py-1 text-xs font-semibold ${request.urgency_level === "critical" ? "bg-red-100 text-red-700" : request.urgency_level === "urgent" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"}`}>{request.urgency_level}</span></div><div className="mt-3 flex items-center justify-between"><span className="text-sm font-semibold text-red-600">{request.blood_group} · {request.quantity} unit(s)</span>{isOwner ? <button onClick={() => onViewResponses(request)} className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50">View donor responses</button> : <button onClick={() => onRespond(request.id, "accepted")} className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700">I can help</button>}</div></div>; })}</div>; }

function ResponseList({ responses, loading }) { if (loading) return <p className="text-sm text-slate-500">Loading donor responses...</p>; if (!responses.length) return <Empty text="No donors have responded yet." />; return <div className="grid gap-3 md:grid-cols-2">{responses.map((response) => { const donor = response.donor || response.user || response; const name = donor.name || response.donor_name || `Donor #${response.donor_id}`; const phone = donor.phone_number || response.phone_number; return <div key={response.id} className="rounded-lg border border-slate-200 p-4"><div className="flex items-center gap-2"><UserRound className="h-4 w-4 text-red-600" /><p className="font-semibold text-slate-900">{name}</p></div><p className="mt-2 text-sm text-slate-600">Response: <span className="font-medium capitalize">{response.response_status}</span></p>{phone ? <a href={`tel:${phone}`} className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-red-600"><Phone className="h-4 w-4" />{phone}</a> : <p className="mt-2 text-xs text-amber-700">Phone details are not included by the backend yet.</p>}</div>; })}</div>; }
