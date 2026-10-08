import type { BpCategory } from "../directory-types";

// Clinical helper: calculate age — verbatim from DoctorSpecializedDirectory.
export function calculateAge(dobString: string): string {
	if (!dobString) return "—";
	try {
		const birthDate = new Date(dobString);
		const today = new Date();
		let age = today.getFullYear() - birthDate.getFullYear();
		const m = today.getMonth() - birthDate.getMonth();
		if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
			age--;
		}
		return age > 0 ? `${age} yrs` : "< 1 yr";
	} catch {
		return "—";
	}
}

// Helper: BMI calculation — verbatim from DoctorSpecializedDirectory.
export function calculateBMI(
	weightKg: number | null | undefined,
	heightM: number | null | undefined,
): number | null {
	if (!weightKg || !heightM || heightM <= 0) return null;
	const heightInMeters = heightM > 3 ? heightM / 100 : heightM;
	const bmi = weightKg / (heightInMeters * heightInMeters);
	return Math.round(bmi * 10) / 10;
}

// Helper: Blood pressure categorization — verbatim from DoctorSpecializedDirectory.
export function getBPCategory(
	bpStr: string | null | undefined,
): BpCategory | null {
	if (!bpStr || !bpStr.includes("/")) return null;
	const parts = bpStr.split("/");
	const sys = parseInt(parts[0], 10);
	const dia = parseInt(parts[1], 10);
	if (isNaN(sys) || isNaN(dia)) return null;

	if (sys >= 140 || dia >= 90) {
		return {
			label: "Hypertensive (High)",
			color: "text-rose-700 bg-rose-50 border-rose-200",
		};
	}
	if ((sys >= 120 && sys <= 139) || (dia >= 80 && dia <= 89)) {
		return {
			label: "Pre-hypertensive",
			color: "text-amber-700 bg-amber-50 border-amber-200",
		};
	}
	if (sys < 90 || dia < 60) {
		return {
			label: "Hypotensive (Low)",
			color: "text-sky-700 bg-sky-50 border-sky-200",
		};
	}
	return {
		label: "Optimal Normal",
		color: "text-emerald-700 bg-emerald-50 border-emerald-200",
	};
}
