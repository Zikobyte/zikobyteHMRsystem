import { Stethoscope } from "lucide-react";

interface ClinicalSectionProps {
  consultations: any[];
  encounters: any[];
}

export default function ClinicalSection({ consultations, encounters }: ClinicalSectionProps) {
  return (
    <div className="space-y-4">
      {encounters.length === 0 &&
      consultations.length === 0 ? (
        <div className="p-8 text-center text-slate-400 text-xs font-bold bg-white rounded-2xl border border-dashed border-slate-200">
          No clinical consultations or physician encounter
          notes recorded yet.
        </div>
      ) : (
        <div className="space-y-3">
          {consultations.map((c: any, idx: number) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs space-y-2"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-extrabold text-slate-900 text-xs flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-[#2A758C]" />
                  <span>
                    Dr.{" "}
                    {c.doctor_name ||
                      "Attending Physician"}
                  </span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {new Date(
                    c.created_at,
                  ).toLocaleString()}
                </span>
              </div>
              <div className="text-xs space-y-1">
                <p className="text-slate-700">
                  <strong>Chief Complaint:</strong>{" "}
                  {c.chief_complaint ||
                    c.symptoms ||
                    "General Checkup"}
                </p>
                <p className="text-slate-700">
                  <strong>Clinical Notes:</strong>{" "}
                  {c.clinical_notes ||
                    c.treatment_plan ||
                    c.notes ||
                    "Patient evaluated and stable."}
                </p>
                <p className="text-[#2A758C] font-bold">
                  <strong>Diagnosis:</strong>{" "}
                  {c.diagnosis ||
                    "Routine Outpatient Consultation"}
                </p>
                {c.prescriptions && (
                  <p className="text-slate-600 text-[11px] font-mono">
                    <strong>Prescriptions:</strong>{" "}
                    {typeof c.prescriptions ===
                    "string"
                      ? c.prescriptions
                      : JSON.stringify(
                          c.prescriptions,
                        )}
                  </p>
                )}
              </div>
            </div>
          ))}

          {encounters.map((e: any, idx: number) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs space-y-1 text-xs"
            >
              <div className="flex justify-between items-center text-slate-500 font-mono text-[10px]">
                <span>
                  Visit Reason:{" "}
                  {e.visit_reason || "OPD Intake"}
                </span>
                <span>
                  {new Date(
                    e.created_at,
                  ).toLocaleDateString()}
                </span>
              </div>
              <p className="font-bold text-slate-800">
                Destination Clinic:{" "}
                {e.destination_clinic || "GOPD"}
              </p>
              <p className="text-slate-500 text-[11px]">
                Priority: {e.priority || "Standard"} •
                Status: {e.clinical_status || e.status}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
