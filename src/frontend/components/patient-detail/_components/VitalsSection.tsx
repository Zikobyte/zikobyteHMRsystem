import { Activity } from "lucide-react";

interface VitalsSectionProps {
  latestVitals: any;
  vitalsList: any[];
}

export default function VitalsSection({ latestVitals, vitalsList }: VitalsSectionProps) {
  return (
    <div className="space-y-4">
      {latestVitals ? (
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs space-y-3">
          <h3 className="text-xs font-extrabold uppercase font-mono tracking-wider text-slate-500 flex items-center gap-2">
            <Activity className="h-4 w-4 text-[#2A758C]" />{" "}
            Latest Triage Vitals
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 font-mono">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <span className="text-[10px] text-slate-400 block">
                BLOOD PRESSURE
              </span>
              <span className="text-sm font-black text-slate-900">
                {latestVitals.blood_pressure ||
                  latestVitals.bloodPressure ||
                  "120/80"}
              </span>
              <span className="text-[9px] text-slate-400 block">
                mmHg
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <span className="text-[10px] text-slate-400 block">
                TEMPERATURE
              </span>
              <span className="text-sm font-black text-amber-600">
                {latestVitals.temperature || 36.8}°C
              </span>
              <span className="text-[9px] text-slate-400 block">
                Celsius
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <span className="text-[10px] text-slate-400 block">
                PULSE RATE
              </span>
              <span className="text-sm font-black text-rose-600">
                {latestVitals.pulse_rate ||
                  latestVitals.pulseRate ||
                  72}
              </span>
              <span className="text-[9px] text-slate-400 block">
                bpm
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <span className="text-[10px] text-slate-400 block">
                RESPIRATION
              </span>
              <span className="text-sm font-black text-sky-600">
                {latestVitals.respiratory_rate ||
                  latestVitals.respiratoryRate ||
                  18}
              </span>
              <span className="text-[9px] text-slate-400 block">
                cpm
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <span className="text-[10px] text-slate-400 block">
                SPO2 SATURATION
              </span>
              <span className="text-sm font-black text-emerald-600">
                {latestVitals.spo2 || 98}%
              </span>
              <span className="text-[9px] text-slate-400 block">
                Oxygen
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <span className="text-[10px] text-slate-400 block">
                WEIGHT / HEIGHT
              </span>
              <span className="text-sm font-black text-slate-900">
                {latestVitals.weight || 70} kg
              </span>
              <span className="text-[9px] text-slate-400 block">
                {latestVitals.height || 170} cm
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-slate-400 text-xs font-bold bg-white rounded-2xl border border-dashed border-slate-200">
          No triage vitals recorded for this patient yet.
        </div>
      )}

      {/* Vitals History List */}
      {vitalsList.length > 1 && (
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs space-y-3">
          <h4 className="text-xs font-extrabold uppercase font-mono tracking-wider text-slate-500">
            Historical Vitals Logs ({vitalsList.length})
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 font-mono">
                  <th className="p-2">Date / Time</th>
                  <th className="p-2">BP</th>
                  <th className="p-2">Temp</th>
                  <th className="p-2">Pulse</th>
                  <th className="p-2">Weight</th>
                  <th className="p-2">Recorded By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-mono">
                {vitalsList.map(
                  (v: any, idx: number) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50"
                    >
                      <td className="p-2 text-slate-500">
                        {new Date(
                          v.recorded_at ||
                            Date.now(),
                        ).toLocaleString()}
                      </td>
                      <td className="p-2 font-bold">
                        {v.blood_pressure ||
                          "120/80"}
                      </td>
                      <td className="p-2 font-bold text-amber-600">
                        {v.temperature}°C
                      </td>
                      <td className="p-2 font-bold text-rose-600">
                        {v.pulse_rate} bpm
                      </td>
                      <td className="p-2 font-bold">
                        {v.weight} kg
                      </td>
                      <td className="p-2 text-slate-400">
                        {v.recorded_by || "Nurse"}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
