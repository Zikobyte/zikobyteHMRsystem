import { FlaskConical } from "lucide-react";

interface LabSectionProps {
  labOrders: any[];
}

export default function LabSection({ labOrders }: LabSectionProps) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs space-y-3">
      <h3 className="text-xs font-extrabold uppercase font-mono tracking-wider text-slate-500 flex items-center gap-2 border-b border-slate-100 pb-2">
        <FlaskConical className="h-4 w-4 text-[#2A758C]" />{" "}
        Laboratory Investigations ({labOrders.length})
      </h3>
      {labOrders.length === 0 ? (
        <p className="text-xs text-slate-400 py-4 text-center">
          No lab tests requested yet.
        </p>
      ) : (
        <div className="space-y-2">
          {labOrders.map((lab: any, idx: number) => (
            <div
              key={idx}
              className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs"
            >
              <div className="flex justify-between font-bold text-slate-800">
                <span>
                  {lab.test_name ||
                    lab.testName ||
                    "Lab Investigation"}
                </span>
                <span className="font-mono text-[#2A758C]">
                  {lab.cost
                    ? `₦${parseFloat(lab.cost).toLocaleString()}`
                    : ""}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Status:{" "}
                <span className="font-bold">
                  {lab.status || "Pending"}
                </span>
                {lab.findings && (
                  <span>
                    {" "}
                    • Findings:{" "}
                    <strong className="text-slate-800">
                      {lab.findings}
                    </strong>
                  </span>
                )}
                {lab.result_details && (
                  <span>
                    {" "}
                    • Value:{" "}
                    <strong className="text-slate-800 font-mono">
                      {lab.result_details}
                    </strong>
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
