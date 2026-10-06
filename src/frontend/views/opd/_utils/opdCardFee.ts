/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const OPD_SICK_EMERGENCY_FEE = 25000;
export const OPD_UNBOOKED_LABOUR_FEE = 50000;
export const OPD_ACCIDENT_FEE = 50000;
export const OPD_ON_CALL_AFTER_HOURS_FEE = 5000;

export interface OpdEmergencyFeeFlags {
	isSickEmergency: boolean;
	isUnbookedLabour: boolean;
	isAccident: boolean;
	isDoctorOnCall: boolean;
	isAfterHours: boolean;
}

export function getCalculatedCardFee(flags: OpdEmergencyFeeFlags): number {
	let total = 0;
	if (flags.isSickEmergency) total += OPD_SICK_EMERGENCY_FEE;
	if (flags.isUnbookedLabour) total += OPD_UNBOOKED_LABOUR_FEE;
	if (flags.isAccident) total += OPD_ACCIDENT_FEE;
	if (flags.isDoctorOnCall || flags.isAfterHours)
		total += OPD_ON_CALL_AFTER_HOURS_FEE;
	return total;
}
