/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export function getAge(dobString: string): number {
	if (!dobString) return 0;
	const dob = new Date(dobString);
	const diffMs = Date.now() - dob.getTime();
	const ageDate = new Date(diffMs);
	return Math.abs(ageDate.getUTCFullYear() - 1970);
}
