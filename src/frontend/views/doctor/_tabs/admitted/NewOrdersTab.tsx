/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4A extraction from DoctorView.tsx (admitted NEW ORDERS sub-tab).
 * Verbatim JSX — medication / injection / lab-test order forms plus the
 * sent-orders tracking history. State and callbacks arrive as props.
 */

import { ArrowRight, Plus, Trash2 } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import {
	CHEMISTRY_TESTS,
	HAEMATOLOGY_TESTS,
	INJECTIONS_CATALOG,
	MEDICATIONS_CATALOG,
	MICROBIOLOGY_TESTS,
	PARASITOLOGY_TESTS,
	SEROLOGY_TESTS,
} from "../../_utils/doctor-catalog";
import type {
	AdmittedPatient,
	InjOrderItem,
	InpatientOrderType,
	LabOrderTests,
	MedOrderItem,
} from "../../_utils/doctor-types";

export interface NewOrdersTabProps {
	patient: AdmittedPatient;
	orderType: InpatientOrderType;
	onOrderTypeChange: (value: InpatientOrderType) => void;
	medItems: MedOrderItem[];
	onMedItemsChange: Dispatch<SetStateAction<MedOrderItem[]>>;
	injItems: InjOrderItem[];
	onInjItemsChange: Dispatch<SetStateAction<InjOrderItem[]>>;
	labTests: LabOrderTests;
	onLabTestsChange: (value: LabOrderTests) => void;
	orderNotes: string;
	onOrderNotesChange: (value: string) => void;
	onSendOrder: () => void;
	onUpdateOrderStatus: (orderId: string, newStatus: string) => void;
}

const ORDER_TYPES: InpatientOrderType[] = [
	"Medication",
	"Injection",
	"Lab Test",
];

export default function NewOrdersTab({
	patient: selectedAdmitted,
	orderType,
	onOrderTypeChange: setOrderType,
	medItems: medOrderItems,
	onMedItemsChange: setMedOrderItems,
	injItems: injOrderItems,
	onInjItemsChange: setInjOrderItems,
	labTests: labOrderTests,
	onLabTestsChange: setLabOrderTests,
	orderNotes,
	onOrderNotesChange: setOrderNotes,
	onSendOrder: handleSendOrder,
	onUpdateOrderStatus: handleUpdateOrderStatus,
}: NewOrdersTabProps) {
	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center border-b border-slate-150 pb-3">
				<h4 className="text-xs font-black text-slate-800 uppercase tracking-wider font-mono">
					Place New Inpatient Order
				</h4>

				{/* Selector for new order type */}
				<div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
					{ORDER_TYPES.map((type) => (
						<button
							key={type}
							type="button"
							onClick={() =>
								setOrderType(type)
							}
							className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all ${
								orderType === type
									? "bg-[#A3D1E0] text-slate-950 font-black shadow-xs"
									: "text-slate-500 hover:text-slate-800"
							}`}
						>
							{type}
						</button>
					))}
				</div>
			</div>

			{/* Header notification details on target */}
			<p className="text-xs text-[#2A758C] font-bold flex items-center gap-1.5 bg-sky-50/50 p-2.5 rounded-xl border border-sky-100">
				<ArrowRight className="h-4 w-4" />
				{orderType === "Medication" &&
					"→ Sends to PHARMACY — Pharmacist prepares and Nursing picks up for patient"}
				{orderType === "Injection" &&
					"→ Sends to NURSING — Nurse administers injection to patient"}
				{orderType === "Lab Test" &&
					"→ Sends to LABORATORY — Lab runs test and reports results back"}
			</p>

			<form
				onSubmit={(e) => {
					e.preventDefault();
					handleSendOrder();
				}}
				className="space-y-4"
			>
				{/* 1. MEDICATION ORDER INPUTS */}
				{orderType === "Medication" && (
					<div className="space-y-3">
						{medOrderItems.map((item, idx) => (
							<div
								key={idx}
								className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3 bg-slate-50/50 rounded-xl border border-slate-150 relative"
							>
								<div className="space-y-1">
									<label className="block text-[10px] font-bold text-slate-400 font-mono uppercase">
										Item {idx + 1}
									</label>
									<select
										value={item.name}
										onChange={(e) => {
											const updated = [
												...medOrderItems,
											];
											updated[idx].name =
												e.target.value;
											setMedOrderItems(
												updated,
											);
										}}
										className="w-full bg-white border border-slate-200 text-xs p-2 rounded-xl text-slate-800 focus:outline-none"
									>
										<option value="">
											-- Select medication --
										</option>
										{MEDICATIONS_CATALOG.map(
											(m) => (
												<option
													key={m}
													value={m}
												>
													{m}
												</option>
											),
										)}
									</select>
								</div>

								<div className="space-y-1">
									<label className="block text-[10px] font-bold text-slate-400 font-mono uppercase">
										Dose
									</label>
									<input
										type="text"
										placeholder="e.g. 1g, 2 ampoules"
										value={item.dose}
										onChange={(e) => {
											const updated = [
												...medOrderItems,
											];
											updated[idx].dose =
												e.target.value;
											setMedOrderItems(
												updated,
											);
										}}
										className="w-full bg-white border border-slate-200 text-xs p-2 rounded-xl text-slate-800 focus:outline-none font-mono"
									/>
								</div>

								<div className="space-y-1">
									<label className="block text-[10px] font-bold text-slate-400 font-mono uppercase">
										Quantity
									</label>
									<input
										type="text"
										placeholder="Quantity"
										value={item.quantity}
										onChange={(e) => {
											const updated = [
												...medOrderItems,
											];
											updated[idx].quantity =
												e.target.value;
											setMedOrderItems(
												updated,
											);
										}}
										className="w-full bg-white border border-slate-200 text-xs p-2 rounded-xl text-slate-800 focus:outline-none"
									/>
								</div>

								<div className="space-y-1">
									<label className="block text-[10px] font-bold text-slate-400 font-mono uppercase">
										Frequency
									</label>
									<div className="flex gap-2">
										<input
											type="text"
											placeholder="e.g. BD, TDS"
											value={item.frequency}
											onChange={(e) => {
												const updated = [
													...medOrderItems,
												];
												updated[
													idx
												].frequency =
													e.target.value;
												setMedOrderItems(
													updated,
												);
											}}
											className="w-full bg-white border border-slate-200 text-xs p-2 rounded-xl text-slate-800 focus:outline-none"
										/>
										{medOrderItems.length >
											1 && (
											<button
												type="button"
												onClick={() =>
													setMedOrderItems(
														(prev) =>
															prev.filter(
																(
																	_,
																	i,
																) =>
																	i !==
																	idx,
															),
													)
												}
												className="text-rose-500 hover:text-rose-700 font-bold p-1 cursor-pointer"
											>
												<Trash2 className="h-4 w-4" />
											</button>
										)}
									</div>
								</div>
							</div>
						))}

						<button
							type="button"
							onClick={() =>
								setMedOrderItems((prev) => [
									...prev,
									{
										name: "",
										dose: "",
										quantity: "",
										frequency: "",
									},
								])
							}
							className="text-xs text-[#2A758C] hover:text-[#1f596b] font-bold flex items-center gap-1 cursor-pointer"
						>
							<Plus className="h-3.5 w-3.5" />{" "}
							Add another item
						</button>
					</div>
				)}

				{/* 2. INJECTION ORDER INPUTS */}
				{orderType === "Injection" && (
					<div className="space-y-3">
						{injOrderItems.map((item, idx) => (
							<div
								key={idx}
								className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50/50 rounded-xl border border-slate-150 relative"
							>
								<div className="space-y-1">
									<label className="block text-[10px] font-bold text-slate-400 font-mono uppercase">
										Item {idx + 1}
									</label>
									<select
										value={item.name}
										onChange={(e) => {
											const updated = [
												...injOrderItems,
											];
											updated[idx].name =
												e.target.value;
											setInjOrderItems(
												updated,
											);
										}}
										className="w-full bg-white border border-slate-200 text-xs p-2 rounded-xl text-slate-800 focus:outline-none"
									>
										<option value="">
											-- Select injection --
										</option>
										{INJECTIONS_CATALOG.map(
											(m) => (
												<option
													key={m}
													value={m}
												>
													{m}
												</option>
											),
										)}
									</select>
								</div>

								<div className="space-y-1">
									<label className="block text-[10px] font-bold text-slate-400 font-mono uppercase">
										Dose
									</label>
									<input
										type="text"
										placeholder="e.g. 1g, 2 ampoules"
										value={item.dose}
										onChange={(e) => {
											const updated = [
												...injOrderItems,
											];
											updated[idx].dose =
												e.target.value;
											setInjOrderItems(
												updated,
											);
										}}
										className="w-full bg-white border border-slate-200 text-xs p-2 rounded-xl text-slate-800 focus:outline-none font-mono"
									/>
								</div>

								<div className="space-y-1">
									<label className="block text-[10px] font-bold text-slate-400 font-mono uppercase">
										Quantity
									</label>
									<div className="flex gap-2">
										<input
											type="text"
											placeholder="Quantity"
											value={item.quantity}
											onChange={(e) => {
												const updated = [
													...injOrderItems,
												];
												updated[
													idx
												].quantity =
													e.target.value;
												setInjOrderItems(
													updated,
												);
											}}
											className="w-full bg-white border border-slate-200 text-xs p-2 rounded-xl text-slate-800 focus:outline-none"
										/>
										{injOrderItems.length >
											1 && (
											<button
												type="button"
												onClick={() =>
													setInjOrderItems(
														(prev) =>
															prev.filter(
																(
																	_,
																	i,
																) =>
																	i !==
																	idx,
															),
													)
												}
												className="text-rose-500 hover:text-rose-700 font-bold p-1 cursor-pointer"
											>
												<Trash2 className="h-4 w-4" />
											</button>
										)}
									</div>
								</div>
							</div>
						))}

						<button
							type="button"
							onClick={() =>
								setInjOrderItems((prev) => [
									...prev,
									{
										name: "",
										dose: "",
										quantity: "",
									},
								])
							}
							className="text-xs text-[#2A758C] hover:text-[#1f596b] font-bold flex items-center gap-1 cursor-pointer"
						>
							<Plus className="h-3.5 w-3.5" />{" "}
							Add another item
						</button>
					</div>
				)}

				{/* 3. LAB TEST ORDER INPUTS */}
				{orderType === "Lab Test" && (
					<div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
						{/* Chemistry */}
						<div className="space-y-1.5">
							<span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
								CHEMISTRY
							</span>
							<select
								value={labOrderTests.CHEMISTRY}
								onChange={(e) =>
									setLabOrderTests({
										...labOrderTests,
										CHEMISTRY: e.target.value,
									})
								}
								className="w-full bg-slate-50 border border-slate-200 text-xs p-2 rounded-xl text-slate-800 focus:outline-none"
							>
								<option value="">
									Select test...
								</option>
								{CHEMISTRY_TESTS.map((t) => (
									<option
										key={t.name}
										value={t.name}
									>
										{t.name} - ₦
										{t.price.toLocaleString()}
									</option>
								))}
							</select>
						</div>

						{/* Serology */}
						<div className="space-y-1.5">
							<span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
								SEROLOGY
							</span>
							<select
								value={labOrderTests.SEROLOGY}
								onChange={(e) =>
									setLabOrderTests({
										...labOrderTests,
										SEROLOGY: e.target.value,
									})
								}
								className="w-full bg-slate-50 border border-slate-200 text-xs p-2 rounded-xl text-slate-800 focus:outline-none"
							>
								<option value="">
									Select test...
								</option>
								{SEROLOGY_TESTS.map((t) => (
									<option
										key={t.name}
										value={t.name}
									>
										{t.name} - ₦
										{t.price.toLocaleString()}
									</option>
								))}
							</select>
						</div>

						{/* Haematology */}
						<div className="space-y-1.5">
							<span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
								HAEMATOLOGY
							</span>
							<select
								value={
									labOrderTests.HAEMATOLOGY
								}
								onChange={(e) =>
									setLabOrderTests({
										...labOrderTests,
										HAEMATOLOGY:
											e.target.value,
									})
								}
								className="w-full bg-slate-50 border border-slate-200 text-xs p-2 rounded-xl text-slate-800 focus:outline-none"
							>
								<option value="">
									Select test...
								</option>
								{HAEMATOLOGY_TESTS.map((t) => (
									<option
										key={t.name}
										value={t.name}
									>
										{t.name} - ₦
										{t.price.toLocaleString()}
									</option>
								))}
							</select>
						</div>

						{/* Microbiology */}
						<div className="space-y-1.5">
							<span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
								MICROBIOLOGY
							</span>
							<select
								value={
									labOrderTests.MICROBIOLOGY
								}
								onChange={(e) =>
									setLabOrderTests({
										...labOrderTests,
										MICROBIOLOGY:
											e.target.value,
									})
								}
								className="w-full bg-slate-50 border border-slate-200 text-xs p-2 rounded-xl text-slate-800 focus:outline-none"
							>
								<option value="">
									Select test...
								</option>
								{MICROBIOLOGY_TESTS.map((t) => (
									<option
										key={t.name}
										value={t.name}
									>
										{t.name} - ₦
										{t.price.toLocaleString()}
									</option>
								))}
							</select>
						</div>

						{/* Parasitology */}
						<div className="space-y-1.5">
							<span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
								PARASITOLOGY
							</span>
							<select
								value={
									labOrderTests.PARASITOLOGY
								}
								onChange={(e) =>
									setLabOrderTests({
										...labOrderTests,
										PARASITOLOGY:
											e.target.value,
									})
								}
								className="w-full bg-slate-50 border border-slate-200 text-xs p-2 rounded-xl text-slate-800 focus:outline-none"
							>
								<option value="">
									Select test...
								</option>
								{PARASITOLOGY_TESTS.map((t) => (
									<option
										key={t.name}
										value={t.name}
									>
										{t.name} - ₦
										{t.price.toLocaleString()}
									</option>
								))}
							</select>
						</div>
					</div>
				)}

				{/* Order Notes (optional) */}
				<div className="space-y-1 pt-2">
					<label className="block text-[10px] font-bold text-slate-400 font-mono uppercase">
						Order Notes (optional)
					</label>
					<textarea
						rows={2}
						value={orderNotes}
						onChange={(e) =>
							setOrderNotes(e.target.value)
						}
						placeholder="e.g. Give before meals, STAT, continue until further notice…"
						className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#2A758C] font-mono leading-relaxed"
					/>
				</div>

				{/* Submit Button */}
				<div className="flex justify-end pt-3">
					<button
						type="submit"
						className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl flex items-center gap-1.5 cursor-pointer text-xs shadow-sm"
					>
						Send Order →{" "}
						{orderType === "Medication"
							? "Pharmacy"
							: orderType === "Injection"
								? "Nursing"
								: "Laboratory"}
					</button>
				</div>
			</form>

			{/* Display already sent orders with interactive status tracking */}
			{selectedAdmitted.newOrdersList &&
				selectedAdmitted.newOrdersList.length >
					0 && (
					<div className="bg-slate-50 rounded-xl p-4 border border-slate-150 space-y-3">
						<div className="flex justify-between items-center">
							<span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
								Sent Orders Tracking History
							</span>
							<span className="text-[10px] text-slate-400 font-mono">
								{
									selectedAdmitted
										.newOrdersList.length
								}{" "}
								orders
							</span>
						</div>

						<div className="space-y-3">
							{selectedAdmitted.newOrdersList.map(
								(ord) => (
									<div
										key={ord.id}
										className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs space-y-2 shadow-2xs"
									>
										<div className="flex flex-wrap justify-between items-center gap-2 pb-2 border-b border-slate-100">
											<div className="flex items-center gap-2">
												<span className="font-extrabold text-[#2A758C] font-mono">
													{ord.id}
												</span>
												<span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono uppercase font-bold">
													{ord.type} →{" "}
													{ord.target}
												</span>
											</div>

											{/* Status selector buttons */}
											<div className="flex items-center gap-1.5">
												<span className="text-[10px] text-slate-400 font-mono">
													Status:
												</span>
												<select
													value={
														ord.status
													}
													onChange={(e) =>
														handleUpdateOrderStatus(
															ord.id,
															e.target
																.value,
														)
													}
													className={`text-[10px] font-mono font-bold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${
														ord.status ===
														"Completed"
															? "bg-emerald-50 text-emerald-800 border-emerald-200"
															: ord.status ===
																  "In Progress"
																? "bg-sky-50 text-sky-800 border-sky-200"
																: ord.status ===
																	  "Accepted"
																	? "bg-indigo-50 text-indigo-800 border-indigo-200"
																	: ord.status ===
																		  "Cancelled"
																		? "bg-rose-50 text-rose-800 border-rose-200"
																		: "bg-amber-50 text-amber-800 border-amber-200"
													}`}
												>
													<option value="Pending">
														Pending
													</option>
													<option value="Accepted">
														Accepted
													</option>
													<option value="In Progress">
														In Progress
													</option>
													<option value="Completed">
														Completed
													</option>
													<option value="Cancelled">
														Cancelled
													</option>
												</select>
											</div>
										</div>

										<p className="text-slate-700 font-mono leading-relaxed">
											{ord.description}
										</p>
										<p className="text-[10px] text-slate-400 text-right font-mono">
											Placed on:{" "}
											{ord.timestamp}
										</p>
									</div>
								),
							)}
						</div>
					</div>
				)}
		</div>
	);
}
