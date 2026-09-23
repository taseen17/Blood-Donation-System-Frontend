import { UserPlus, Search, HeartHandshake } from "lucide-react";

const steps = [
    {
        icon: UserPlus,
        title: "Create your profile",
        description:
            "Sign up as a donor or requester. Add your blood group and area so the right people can find you.",
    },
    {
        icon: Search,
        title: "Find a match",
        description:
            "Search nearby donors, or post a request and let eligible donors in your area see it.",
    },
    {
        icon: HeartHandshake,
        title: "Connect and donate",
        description:
            "Confirm a donor, coordinate the donation, and we'll notify everyone involved along the way.",
    },
];

export default function HowItWorks() {
    return (
        <section className="bg-white py-20 px-6">
            <div className="mx-auto max-w-5xl">
                <div className="max-w-xl">
                    <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                        Three steps from search to saved
                    </h2>
                    <p className="mt-3 text-slate-600">
                        No middlemen, no waiting rooms — just donors and requesters finding
                        each other directly.
                    </p>
                </div>

                <div className="relative mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8">
                    {/* connecting line, desktop only */}
                    <div
                        className="pointer-events-none absolute left-0 right-0 top-6 hidden h-px bg-slate-200 sm:block"
                        style={{ marginLeft: "12.5%", marginRight: "12.5%" }}
                        aria-hidden="true"
                    />

                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <div key={step.title} className="relative flex flex-col items-start">
                                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white">
                                    <Icon className="h-5 w-5" strokeWidth={2} />
                                </div>
                                <span className="mt-4 text-sm font-medium text-red-600">
                                    Step {index + 1}
                                </span>
                                <h3 className="mt-1 text-lg font-semibold text-slate-900">
                                    {step.title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                    {step.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}