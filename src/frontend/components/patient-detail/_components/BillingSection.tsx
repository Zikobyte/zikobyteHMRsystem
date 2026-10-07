import { CreditCard } from "lucide-react";

interface BillingSectionProps {
  invoices: any[];
  cardFee: number;
  balance: number;
}

export default function BillingSection({ invoices, cardFee, balance }: BillingSectionProps) {
  return (
    <div className="space-y-4">
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs space-y-3">
        <h3 className="text-xs font-extrabold uppercase font-mono tracking-wider text-slate-500 flex items-center gap-2 border-b border-slate-100 pb-2">
          <CreditCard className="h-4 w-4 text-[#2A758C]" />{" "}
          Financial Summary & Ledger
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 block">
              CARD REGISTRATION FEE
            </span>
            <span className="text-base font-black text-slate-800">
              ₦{cardFee.toLocaleString()}
            </span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 block">
              TOTAL INVOICED BILLS
            </span>
            <span className="text-base font-black text-slate-800">
              ₦
              {invoices
                .reduce(
                  (a: number, b: any) =>
                    a + parseFloat(b.amount || 0),
                  cardFee,
                )
                .toLocaleString()}
            </span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 block">
              OUTSTANDING DEBT
            </span>
            <span
              className={`text-base font-black ${balance > 0 ? "text-rose-600" : "text-emerald-600"}`}
            >
              ₦{balance.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {invoices.length > 0 && (
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs space-y-3">
          <h4 className="text-xs font-extrabold uppercase font-mono tracking-wider text-slate-500">
            Invoices & Service Charges
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase font-mono">
                  <th className="p-2">Purpose</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">
                    Payment Status
                  </th>
                  <th className="p-2">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-mono">
                {invoices.map(
                  (inv: any, idx: number) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50"
                    >
                      <td className="p-2 font-bold text-slate-800">
                        {inv.description ||
                          inv.purpose ||
                          "Hospital Service"}
                      </td>
                      <td className="p-2 font-black">
                        ₦
                        {parseFloat(
                          inv.amount || 0,
                        ).toLocaleString()}
                      </td>
                      <td className="p-2">
                        <span
                          className={`px-2 py-0.5 text-[9px] font-black rounded-full ${inv.status === "Paid" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}
                        >
                          {inv.status || "Paid"}
                        </span>
                      </td>
                      <td className="p-2 text-slate-400">
                        {new Date(
                          inv.created_at ||
                            Date.now(),
                        ).toLocaleDateString()}
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
