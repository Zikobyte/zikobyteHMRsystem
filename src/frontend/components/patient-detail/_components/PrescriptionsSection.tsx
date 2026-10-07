import { Pill } from "lucide-react";

interface PrescriptionsSectionProps {
  pharmacyOrders: any[];
}

export default function PrescriptionsSection({ pharmacyOrders }: PrescriptionsSectionProps) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs space-y-3">
      <h3 className="text-xs font-extrabold uppercase font-mono tracking-wider text-slate-500 flex items-center gap-2 border-b border-slate-100 pb-2">
        <Pill className="h-4 w-4 text-[#2A758C]" />{" "}
        Pharmacy Prescriptions ({pharmacyOrders.length}
        )
      </h3>
      {pharmacyOrders.length === 0 ? (
        <p className="text-xs text-slate-400 py-4 text-center">
          No pharmacy prescriptions ordered yet.
        </p>
      ) : (
        <div className="space-y-2">
          {pharmacyOrders.map(
            (rx: any, idx: number) => (
              <div
                key={idx}
                className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs"
              >
                <div className="flex justify-between font-bold text-slate-800">
                  <span>
                    {rx.medication_name ||
                      rx.drugName ||
                      "Medication"}
                  </span>
                  <span className="font-mono text-emerald-600">
                    ₦
                    {parseFloat(
                      rx.cost || 0,
                    ).toLocaleString()}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Dosage:{" "}
                  {rx.dosage || "As prescribed"} •
                  Status:{" "}
                  {rx.status || "Dispensed"}
                </p>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}
