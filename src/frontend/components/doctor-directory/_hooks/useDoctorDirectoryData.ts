import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/utils/api";
import type {
	DirectoryCategory,
	DirectoryPatient,
	DirectoryQueueItem,
	EnrichedDirectoryPatient,
	InitialCategory,
	SpecializedSubFilter,
} from "../directory-types";

interface PatientsResponse {
	success?: boolean;
	data?: DirectoryPatient[];
}

interface QueueResponse {
	success?: boolean;
	data?: DirectoryQueueItem[];
}

/**
 * Directory data hook — owns queue/list + filter state verbatim from
 * DoctorSpecializedDirectory (fetch, live-queue merge, pools, search).
 */
export function useDoctorDirectoryData(initialCategory: InitialCategory) {
	// Main Category: 'standard' or 'specialized'
	const [activeCategory, setActiveCategory] = useState<DirectoryCategory>(
		() => {
			if (
				initialCategory === "specialized" ||
				initialCategory === "maternity" ||
				initialCategory === "emergency"
			) {
				return "specialized";
			}
			return "standard";
		},
	);

	// Sub-category for specialized: 'all', 'maternity', 'emergency'
	const [specializedSubFilter, setSpecializedSubFilter] =
		useState<SpecializedSubFilter>(() => {
			if (initialCategory === "maternity") return "maternity";
			if (initialCategory === "emergency") return "emergency";
			return "all";
		});

	const [patients, setPatients] = useState<DirectoryPatient[]>([]);
	const [queueEncounters, setQueueEncounters] = useState<DirectoryQueueItem[]>(
		[],
	);
	const [isLoading, setIsLoading] = useState(true);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("all");

	// Sync initialCategory changes if prop updates
	useEffect(() => {
		if (
			initialCategory === "specialized" ||
			initialCategory === "maternity" ||
			initialCategory === "emergency"
		) {
			setActiveCategory("specialized");
			if (initialCategory === "maternity")
				setSpecializedSubFilter("maternity");
			else if (initialCategory === "emergency")
				setSpecializedSubFilter("emergency");
			else setSpecializedSubFilter("all");
		} else if (initialCategory === "standard") {
			setActiveCategory("standard");
		}
	}, [initialCategory]);

	// Load authoritative clinical patients & live queue
	const fetchData = async () => {
		setIsRefreshing(true);
		try {
			const [patientsRaw, queueRaw] = await Promise.all([
				apiFetch("/patients"),
				apiFetch("/patients/opd/queue").catch(() => ({
					success: false,
					data: [],
				})),
			]);
			const patientsRes = patientsRaw as PatientsResponse;
			const queueRes = queueRaw as QueueResponse;

			if (patientsRes.success && Array.isArray(patientsRes.data)) {
				setPatients(patientsRes.data);
			}
			if (queueRes.success && Array.isArray(queueRes.data)) {
				setQueueEncounters(queueRes.data);
			}
		} catch (err) {
			console.error("Failed to load clinical directory data:", err);
		} finally {
			setIsLoading(false);
			setIsRefreshing(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	// Merge live queue info (real-time clinical status, queue ID, vitals updates) with patient record
	const enrichedPatients: EnrichedDirectoryPatient[] = useMemo(() => {
		const queueMap = new Map<string, DirectoryQueueItem>();
		queueEncounters.forEach((q) => {
			if (q.patient_id) queueMap.set(q.patient_id, q);
		});

		return patients.map((p) => {
			const queueItem = queueMap.get(p.id);
			const effectiveStatus = queueItem?.status
				? queueItem.status === "Processing"
					? "IN CONSULTATION"
					: queueItem.status
				: p.status || "Active";

			const effectiveVitals = queueItem?.blood_pressure
				? {
						bloodPressure: queueItem.blood_pressure,
						temperature: queueItem.temperature
							? parseFloat(String(queueItem.temperature))
							: p.vitals?.temperature || null,
						pulseRate: queueItem.pulse_rate
							? parseInt(String(queueItem.pulse_rate), 10)
							: p.vitals?.pulseRate || null,
						respiratoryRate: queueItem.respiratory_rate
							? parseInt(String(queueItem.respiratory_rate), 10)
							: p.vitals?.respiratoryRate || null,
						spo2: queueItem.spo2
							? parseInt(String(queueItem.spo2), 10)
							: p.vitals?.spo2 || null,
						weight: queueItem.weight
							? parseFloat(String(queueItem.weight))
							: p.vitals?.weight || null,
						height: queueItem.height
							? parseFloat(String(queueItem.height))
							: p.vitals?.height || null,
					}
				: p.vitals;

			return {
				...p,
				queueItem,
				effectiveStatus,
				effectiveVitals,
			};
		});
	}, [patients, queueEncounters]);

	// Separate pools
	const standardPatients = useMemo(() => {
		return enrichedPatients.filter(
			(p) => p.cardType === "Standard" || (!p.cardType && p.gender),
		);
	}, [enrichedPatients]);

	const maternityPatients = useMemo(() => {
		return enrichedPatients.filter(
			(p) =>
				p.cardType === "Maternity" ||
				Boolean(p.maternityDetails?.gravida) ||
				Boolean(p.maternityNumber),
		);
	}, [enrichedPatients]);

	const emergencyPatients = useMemo(() => {
		return enrichedPatients.filter(
			(p) =>
				p.cardType === "Emergency" ||
				Boolean(p.emergencyDetails?.isSickEmergency) ||
				Boolean(p.broughtInByName),
		);
	}, [enrichedPatients]);

	const specializedPatients = useMemo(() => {
		return enrichedPatients.filter(
			(p) =>
				p.cardType === "Maternity" ||
				p.cardType === "Emergency" ||
				Boolean(p.maternityDetails) ||
				Boolean(p.emergencyDetails),
		);
	}, [enrichedPatients]);

	// Determine current active list based on selection
	const currentPool = useMemo(() => {
		if (activeCategory === "standard") {
			return standardPatients;
		}
		if (specializedSubFilter === "maternity") {
			return maternityPatients;
		}
		if (specializedSubFilter === "emergency") {
			return emergencyPatients;
		}
		return specializedPatients;
	}, [
		activeCategory,
		specializedSubFilter,
		standardPatients,
		maternityPatients,
		emergencyPatients,
		specializedPatients,
	]);

	// Apply search query & status filter
	const filteredPatients = useMemo(() => {
		return currentPool.filter((p) => {
			// Search match
			const query = searchQuery.toLowerCase().trim();
			const matchesSearch =
				!query ||
				p.name?.toLowerCase().includes(query) ||
				p.hospitalNumber?.toLowerCase().includes(query) ||
				p.maternityNumber?.toLowerCase().includes(query) ||
				p.phoneNumber?.toLowerCase().includes(query) ||
				p.address?.toLowerCase().includes(query) ||
				p.broughtInByName?.toLowerCase().includes(query) ||
				p.emergencyDetails?.customDetails?.toLowerCase().includes(query);

			// Status match
			let matchesStatus = true;
			if (statusFilter !== "all") {
				const s = (p.effectiveStatus || "").toUpperCase();
				if (statusFilter === "waiting") {
					matchesStatus =
						s.includes("WAITING") ||
						s.includes("PENDING") ||
						s.includes("QUEUED") ||
						s.includes("TRIAGE");
				} else if (statusFilter === "consulting") {
					matchesStatus =
						s.includes("CONSULTATION") || s.includes("PROCESSING");
				} else if (statusFilter === "lab") {
					matchesStatus = s.includes("LAB") || s.includes("RESULTS");
				} else if (statusFilter === "completed") {
					matchesStatus =
						s.includes("COMPLETED") ||
						s.includes("DISCHARGED") ||
						s.includes("DONE");
				}
			}

			return matchesSearch && matchesStatus;
		});
	}, [currentPool, searchQuery, statusFilter]);

	return {
		activeCategory,
		setActiveCategory,
		specializedSubFilter,
		setSpecializedSubFilter,
		isLoading,
		isRefreshing,
		searchQuery,
		setSearchQuery,
		statusFilter,
		setStatusFilter,
		fetchData,
		standardPatients,
		maternityPatients,
		emergencyPatients,
		specializedPatients,
		currentPool,
		filteredPatients,
	};
}

export type DoctorDirectoryData = ReturnType<typeof useDoctorDirectoryData>;
