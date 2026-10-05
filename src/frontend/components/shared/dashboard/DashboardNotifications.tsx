import { apiFetch, socketManager } from "@/utils/api";
import { Activity, Bell, Shield, Sparkles } from "lucide-react";
import { AnimatePresence , motion} from "motion/react";
import { useEffect, useState } from "react";

interface NotificationItem {
	id: string;
	type: string;
	message: string;
	timestamp: string;
	read: boolean;
}


const DashboardNotifications = () => {
	const [notificationsOpen, setNotificationsOpen] = useState(false);
	const [notifications, setNotifications] = useState<NotificationItem[]>([]);

	const fetchDbNotifications = async () => {
		try {
			const res = await apiFetch("/notifications");
			if (res.success && Array.isArray(res.data)) {
				setNotifications(
					res.data.map((r: any) => ({
						id: r.id,
						type: r.type,
						message: r.message,
						timestamp: new Date(r.timestamp).toLocaleTimeString([], {
							hour: "2-digit",
							minute: "2-digit",
						}),
						read: r.read,
					})),
				);
			}
		} catch (err) {
			console.error("Failed to load persistent notifications:", err);
		}
	};

	useEffect(() => {
		fetchDbNotifications();

		const unsubscribe = socketManager.subscribe((msg: any) => {
			if (
				msg.type === "PATIENT_REGISTERED" ||
				msg.type === "VITALS_RECORDED" ||
				msg.type === "PATIENT_UPDATED" ||
				msg.type === "AUTH_SUCCESS"
			) {
				// Refetch from database to keep persistent sync
				fetchDbNotifications();
			}
		});
		return () => unsubscribe();
	}, []);

	const unreadCount = notifications.filter((n) => !n.read).length;

	const handleMarkAllRead = async () => {
		try {
			await apiFetch("/notifications/read-all", { method: "POST" });
			setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
		} catch (err) {
			console.error("Failed to mark all notifications as read:", err);
		}
	};

	const handleClearAll = () => {
		setNotifications([]);
	};

	const handleNotificationClick = async (id: string) => {
		try {
			await apiFetch(`/notifications/${id}/read`, { method: "POST" });
			setNotifications((prev) =>
				prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
			);
		} catch (err) {
			console.error("Failed to mark notification as read:", err);
		}
	};
	return (
		<>
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 hover:bg-slate-100/80 rounded-2xl text-slate-600 transition-all cursor-pointer relative"
                title="Hospital Broadcasts"
              >
                <Bell className="h-4.5 w-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse border-2 border-white"></span>
                )}
              </button>

              {notificationsOpen && (
                <div className="fixed inset-0 z-30" onClick={() => setNotificationsOpen(false)} />
              )}

              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl z-40 overflow-hidden flex flex-col text-white"
                  >
                    <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex justify-between items-center">
                      <span className="font-bold text-slate-100 text-sm flex items-center gap-2">
                        <Bell className="h-4.5 w-4.5 text-[#A3D1E0]" /> In-App Notification Center
                      </span>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-[10px] text-[#A3D1E0] hover:text-[#82bdcf] font-bold hover:underline cursor-pointer bg-transparent border-none outline-none"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div className="flex-grow overflow-y-auto divide-y divide-slate-800/60 max-h-80">
                      {notifications.length === 0 ? (
                        <div className="text-center py-10 text-slate-400 text-xs font-medium">
                          <Bell className="h-8 w-8 mx-auto text-slate-500 mb-2" />
                          No active notifications
                        </div>
                      ) : (
                        notifications.map((notif) => {
                          let iconBg = 'bg-slate-800/80 text-slate-300';
                          let icon = <Bell className="h-4 w-4" />;
                          let accentColor = 'bg-slate-500';

                          if (notif.type === 'PATIENT_REGISTERED') {
                            iconBg = 'bg-[#A3D1E0]/20 text-[#A3D1E0]';
                            icon = <Activity className="h-4 w-4" />;
                            accentColor = 'bg-[#A3D1E0]';
                          } else if (notif.type === 'VITALS_RECORDED') {
                            iconBg = 'bg-emerald-500/20 text-emerald-400';
                            icon = <Activity className="h-4 w-4" />;
                            accentColor = 'bg-emerald-400';
                          } else if (notif.type === 'SECURITY' || notif.type === 'SYSTEM') {
                            iconBg = 'bg-blue-500/20 text-blue-400';
                            icon = <Shield className="h-4 w-4" />;
                            accentColor = 'bg-blue-400';
                          } else if (notif.type === 'BROADCAST') {
                            iconBg = 'bg-purple-500/20 text-purple-400';
                            icon = <Sparkles className="h-4 w-4" />;
                            accentColor = 'bg-purple-400';
                          }

                          return (
                            <div
                              key={notif.id}
                              onClick={() => handleNotificationClick(notif.id)}
                              className={`p-3.5 flex gap-3 hover:bg-slate-800/40 transition-all cursor-pointer relative text-left border-l-3 ${!notif.read ? 'border-l-[#A3D1E0] bg-slate-800/20' : 'border-l-transparent'}`}
                            >
                              {!notif.read && (
                                <span className={`absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 ${accentColor} rounded-full`}></span>
                              )}
                              <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center shrink-0 mt-0.5 shadow-sm`}>
                                {icon}
                              </div>
                              <div className="flex-1 min-w-0 pl-1">
                                <p className={`text-xs text-slate-100 leading-normal ${!notif.read ? 'font-bold' : 'font-medium'}`}>
                                  {notif.message}
                                </p>
                                <span className="text-[9px] text-slate-500 font-mono mt-1 block">
                                  {notif.timestamp}
                                </span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {notifications.length > 0 && (
                      <div className="p-3 bg-slate-950/40 border-t border-slate-800 flex justify-between items-center">
                        <button
                          onClick={handleClearAll}
                          className="text-[10px] text-slate-400 hover:text-slate-300 font-semibold cursor-pointer bg-transparent border-none outline-none"
                        >
                          Clear All
                        </button>
                        <button
                          onClick={() => setNotificationsOpen(false)}
                          className="text-[10px] text-slate-300 hover:text-white font-bold px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700/50 transition-colors cursor-pointer"
                        >
                          Close
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

		</>
	);
};

export default DashboardNotifications;
