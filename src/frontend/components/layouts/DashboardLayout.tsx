import { User } from "@/types";
import { apiFetch, removeAuthToken } from "@/utils/api";
import { LogOut, Menu, Search } from "lucide-react";
import React, { useState } from "react";
import DashboardNotifications from "../shared/dashboard/DashboardNotifications";
import DashboardSidebar from "../shared/dashboard/DashboardSidebar";

export interface DashboardLayoutProps {
	user: User;
	onLogout: () => void;
	activeTab: string;
	setActiveTab: (tab: string) => void;
	children: React.ReactNode;
}

export default function DashboardLayout({
	user,
	onLogout,
	activeTab,
	setActiveTab,
	children,
}: DashboardLayoutProps) {
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");

	const handleLogout = async () => {
		try {
			await apiFetch("/audit-logs", {
				method: "POST",
				body: JSON.stringify({
					action: "Logout",
					details: "—",
					userId: user?.id,
					userName: user?.name,
					userRole: user?.role,
				}),
			}).catch(() => {});
		} catch (e) {}
		removeAuthToken();
		onLogout();
	};
	return (
		<div className="reference-shell min-h-screen bg-[#F4F6F8] flex font-sans text-slate-700">
			{/* 1. LEFT SIDEBAR: Ultra-clean modern sidebar with smooth rounded active pills */}
			<DashboardSidebar
				user={user}
				onLogout={onLogout}
				activeTab={activeTab}
				setActiveTab={setActiveTab}
				sidebarOpen={sidebarOpen}
			/>

			{/* 2. MAIN WORKSPACE CONTAINER */}
			<div className="flex-grow flex flex-col min-w-0 min-h-screen">
				{/* TOP BAR: Header search panel, icons & user profile matching references */}
				<header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-6 shrink-0 relative z-20 shadow-2xs">
					{/* Left Area: Toggle Menu and Pill Search bar */}
					<div className="flex items-center gap-4 flex-1">
						<button
							onClick={() => setSidebarOpen(!sidebarOpen)}
							className="p-2 hover:bg-slate-100/80 text-slate-600 rounded-xl transition-all cursor-pointer"
							title="Toggle Sidebar"
						>
							<Menu className="h-5 w-5" />
						</button>

						{/* Custom rounded pill search bar from reference images */}
						<div className="relative w-full max-w-md hidden sm:block">
							<Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
							<input
								type="text"
								placeholder="Search patients, invoices, tests, or doctors..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full bg-slate-100/70 border border-slate-200/70 focus:border-[#2A758C] focus:ring-2 focus:ring-[#2A758C]/15 focus:bg-white rounded-full py-2 pl-10 pr-4 text-xs font-semibold text-slate-700 placeholder-slate-400 transition-all outline-none"
							/>
						</div>
					</div>

					{/* Right Area: Action tools and user status matching video precisely */}
					<div className="flex items-center gap-4 shrink-0">
						{/* Notification bell & Dropdown (Commented out per user request) */}

						{/* <DashboardNotifications /> */}

						<div className="h-8 w-px bg-slate-100 hidden sm:block"></div>

						{/* Profile mini representation & Sign Out shortcut */}
						<div className="flex items-center gap-3">
							<div className="flex items-center gap-2">
								<div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-xs text-[#4a8ca0] shadow-inner">
									{user.name
										.split(" ")
										.map((n) => n[0])
										.join("")
										.substring(0, 2)
										.toUpperCase()}
								</div>
								<span className="text-xs font-bold text-slate-800 hidden md:block">
									{user.name.split(" ")[0]}
								</span>
							</div>
							<div className="h-8 w-px bg-slate-100 hidden sm:block"></div>
							<button
								onClick={handleLogout}
								className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs animate-fade-in"
								title="Sign Out Session"
							>
								<LogOut className="h-3.5 w-3.5" />
								<span className="hidden sm:inline">Sign Out</span>
							</button>
						</div>
					</div>
				</header>

				{/* 3. DYNAMIC CONTENT AREA */}
				<main className="reference-main flex-1 p-4 overflow-y-auto max-w-none mx-0 w-full">
					{children}
				</main>

				{/* Footer */}
				<footer className="bg-white border-t border-slate-100 py-3.5 text-center text-[10px] font-mono text-slate-400">
					Zikora Medical Centre Intranet HMS (Hospital Management System) •
					Phase 1 Core Deployment • Developer Console
				</footer>
			</div>
		</div>
	);
}
