import { Heart, HeartHandshake, Phone, User } from "lucide-react";

interface DemographicsSectionProps {
  patData: any;
  fullName: string;
  hospitalNum: string;
  gender: string;
  dob: string;
  marital: string;
  cardType: string;
  cardFee: number;
  phone: string;
  address: string;
}

export default function DemographicsSection({
  patData,
  fullName,
  hospitalNum,
  gender,
  dob,
  marital,
  cardType,
  cardFee,
  phone,
  address,
}: DemographicsSectionProps) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Basic Information Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs space-y-3">
          <h3 className="text-xs font-extrabold uppercase font-mono tracking-wider text-slate-500 flex items-center gap-2 border-b border-slate-100 pb-2">
            <User className="h-4 w-4 text-[#2A758C]" />{" "}
            Personal Information
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">
                Full Name:
              </span>
              <span className="font-extrabold text-slate-800">
                {fullName}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">
                Hospital Number:
              </span>
              <span className="font-mono font-bold text-[#2A758C]">
                {hospitalNum}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">
                Gender:
              </span>
              <span className="font-bold text-slate-800">
                {gender}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">
                Date of Birth:
              </span>
              <span className="font-bold text-slate-800">
                {dob}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">
                Marital Status:
              </span>
              <span className="font-bold text-slate-800">
                {marital}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">
                Card Type:
              </span>
              <span className="font-bold text-slate-800">
                {cardType} (₦{cardFee.toLocaleString()})
              </span>
            </div>
          </div>
        </div>

        {/* Contact & ID Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs space-y-3">
          <h3 className="text-xs font-extrabold uppercase font-mono tracking-wider text-slate-500 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Phone className="h-4 w-4 text-[#2A758C]" />{" "}
            Contact & Identification
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">
                Primary Phone:
              </span>
              <span className="font-extrabold text-slate-800">
                {phone}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">
                ID Document Type:
              </span>
              <span className="font-bold text-slate-800">
                {patData.id_type ||
                  patData.idType ||
                  "NIN / National ID"}
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-400 block text-[10px]">
                ID Document Number:
              </span>
              <span className="font-mono font-bold text-slate-800">
                {patData.id_number ||
                  patData.idNumber ||
                  "Not Uploaded"}
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-400 block text-[10px]">
                Residential Address:
              </span>
              <span className="font-semibold text-slate-800">
                {address}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Next of Kin & Emergency Contacts */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs space-y-3">
        <h3 className="text-xs font-extrabold uppercase font-mono tracking-wider text-slate-500 flex items-center gap-2 border-b border-slate-100 pb-2">
          <HeartHandshake className="h-4 w-4 text-[#2A758C]" />{" "}
          Next of Kin & Guarantor Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px]">
              Next of Kin Name:
            </span>
            <span className="font-extrabold text-slate-800">
              {patData.next_of_kin_name ||
                patData.nextOfKinName ||
                "N/A"}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">
              Next of Kin Phone:
            </span>
            <span className="font-extrabold text-slate-800">
              {patData.next_of_kin_phone ||
                patData.nextOfKinPhone ||
                "N/A"}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">
              Relationship:
            </span>
            <span className="font-bold text-slate-800">
              {patData.next_of_kin_relationship ||
                patData.nextOfKinRelationship ||
                "N/A"}
            </span>
          </div>
        </div>

        {/* Brought in details if emergency */}
        {(patData.brought_in_by_name ||
          patData.broughtInByName) && (
          <div className="pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs bg-amber-50/50 p-3 rounded-xl border border-amber-100">
            <div>
              <span className="text-amber-800 font-bold block text-[10px]">
                Brought in By:
              </span>
              <span className="font-black text-slate-900">
                {patData.brought_in_by_name ||
                  patData.broughtInByName}
              </span>
            </div>
            <div>
              <span className="text-amber-800 font-bold block text-[10px]">
                Phone Number:
              </span>
              <span className="font-bold text-slate-900">
                {patData.brought_in_by_phone ||
                  patData.broughtInByPhone}
              </span>
            </div>
            <div>
              <span className="text-amber-800 font-bold block text-[10px]">
                Relationship / Identity:
              </span>
              <span className="font-bold text-slate-900">
                {patData.brought_in_by_relationship ||
                  patData.broughtInByRelationship ||
                  "Good Samaritan"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Specialized Maternity Details if applicable */}
      {cardType === "Maternity" && (
        <div className="bg-rose-50/60 p-5 rounded-2xl border border-rose-100 shadow-2xs space-y-3">
          <h3 className="text-xs font-extrabold uppercase font-mono tracking-wider text-rose-800 flex items-center gap-2 border-b border-rose-200 pb-2">
            <Heart className="h-4 w-4 text-rose-600" />{" "}
            Antenatal & Maternity Record
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-rose-700 block text-[10px]">
                Gravida / Para:
              </span>
              <span className="font-black text-slate-900">
                G{patData.gravida || "1"} P
                {patData.para || "0"}
              </span>
            </div>
            <div>
              <span className="text-rose-700 block text-[10px]">
                LMP:
              </span>
              <span className="font-bold text-slate-900">
                {patData.lmp || "N/A"}
              </span>
            </div>
            <div>
              <span className="text-rose-700 block text-[10px]">
                EDD:
              </span>
              <span className="font-bold text-slate-900">
                {patData.edd || "N/A"}
              </span>
            </div>
            <div>
              <span className="text-rose-700 block text-[10px]">
                Gestational Age:
              </span>
              <span className="font-bold text-slate-900">
                {patData.gestational_age ||
                  patData.gestationalAge ||
                  "N/A"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
