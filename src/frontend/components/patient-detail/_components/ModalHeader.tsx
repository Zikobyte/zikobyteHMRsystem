import { Calendar, CheckCircle2, MapPin, Phone, ShieldAlert, UserCheck, X } from "lucide-react";

interface ModalHeaderProps {
  fullName: string;
  hospitalNum: string;
  gender: string;
  dob: string;
  cardType: string;
  status: string;
  balance: number;
  phone: string;
  address: string;
  regDate: string;
  registeredBy: string;
  onClose: () => void;
}

export default function ModalHeader({
  fullName,
  hospitalNum,
  gender,
  dob,
  cardType,
  status,
  balance,
  phone,
  address,
  regDate,
  registeredBy,
  onClose,
}: ModalHeaderProps) {
  // Card color badge helper
  const getCardBadge = (type: string) => {
    switch (type) {
      case 'Maternity':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Emergency':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-sky-50 text-sky-700 border-sky-200';
    }
  };

  // Status badge helper
  const getStatusBadge = (st: string) => {
    if (st.includes('Doctor') || st.includes('Waiting') || st.includes('Pending')) {
      return 'bg-amber-100 text-amber-800 border-amber-200';
    }
    if (st.includes('Discharged') || st.includes('Approved') || st.includes('Completed') || st.includes('Cleared')) {
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
    if (st.includes('Admitted') || st.includes('Ward')) {
      return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    }
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <>
      {/* Top Modal Header */}
      <div className="bg-[#181D27] text-white p-6 relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          title="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#2A758C] text-white flex items-center justify-center text-xl font-black shadow-lg border border-white/20">
            {fullName
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .substring(0, 2)
              .toUpperCase()}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-black tracking-tight text-white">
                {fullName}
              </h2>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase font-mono border ${getCardBadge(cardType)}`}
              >
                {cardType} Card
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${getStatusBadge(status)}`}
              >
                {status}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300 font-mono mt-1">
              <span>
                Hospital ID:{" "}
                <strong className="text-[#38bdf8]">
                  {hospitalNum}
                </strong>
              </span>
              <span>•</span>
              <span>
                Gender: <strong>{gender}</strong>
              </span>
              <span>•</span>
              <span>
                DOB: <strong>{dob}</strong>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/5 p-2.5 rounded-2xl border border-white/10">
          <div>
            <p className="text-[10px] text-slate-400 font-mono uppercase">
              Outstanding Balance
            </p>
            <p
              className={`text-base font-black font-mono ${balance > 0 ? "text-rose-400" : "text-emerald-400"}`}
            >
              ₦{balance.toLocaleString()}
            </p>
          </div>
          {balance > 0 ? (
            <ShieldAlert className="h-5 w-5 text-rose-400 animate-pulse ml-2" />
          ) : (
            <CheckCircle2 className="h-5 w-5 text-emerald-400 ml-2" />
          )}
        </div>
      </div>

      {/* KPI Strip */}
      <div className="bg-slate-50 border-b border-slate-100 p-3 px-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-[#2A758C]" />
          <div>
            <span className="text-[10px] text-slate-400 block font-mono">
              PHONE CONTACT
            </span>
            <span className="font-extrabold text-slate-800">
              {phone}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-[#2A758C]" />
          <div>
            <span className="text-[10px] text-slate-400 block font-mono">
              RESIDENCE ADDRESS
            </span>
            <span
              className="font-extrabold text-slate-800 truncate max-w-[160px]"
              title={address}
            >
              {address}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-[#2A758C]" />
          <div>
            <span className="text-[10px] text-slate-400 block font-mono">
              REGISTRATION DATE
            </span>
            <span className="font-extrabold text-slate-800">
              {regDate
                ? new Date(regDate).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-[#2A758C]" />
          <div>
            <span className="text-[10px] text-slate-400 block font-mono">
              REGISTERED BY
            </span>
            <span className="font-extrabold text-slate-800">
              {registeredBy}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
