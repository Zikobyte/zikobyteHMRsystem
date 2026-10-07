/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 3B extraction from OPDRegistrationView.tsx.
 *
 * Catalog hook: owns the clinical pricing catalogue data and the price-edit
 * modal workflow. apiFetch path/method/body and the success message are
 * preserved verbatim from the original component.
 */

import { useState } from "react";
import type { FormEvent } from "react";
import { apiFetch } from "../../../utils/api";

export interface OpdPriceItem {
	id: string;
	item_code: string;
	item_name: string;
	category: string;
	price: string;
}

export interface OpdCatalogNotify {
	setError: (message: string) => void;
	setSuccess: (message: string) => void;
}

export interface UseOpdCatalogParams {
	notify: OpdCatalogNotify;
}

export function useOpdCatalog({ notify }: UseOpdCatalogParams) {
	const { setError, setSuccess } = notify;

	const [prices, setPrices] = useState<OpdPriceItem[]>([]);
	const [selectedPriceItem, setSelectedPriceItem] =
		useState<OpdPriceItem | null>(null);
	const [editPriceVal, setEditPriceVal] = useState("");
	const [isPriceEditOpen, setIsPriceEditOpen] = useState(false);
	const [isSavingPrice, setIsSavingPrice] = useState(false);

	const fetchPrices = async () => {
		try {
			const res = await apiFetch("/patients/opd/prices");
			if (res.success) setPrices(res.data);
		} catch (err) {
			console.error("Failed to load prices", err);
		}
	};

	const handleOpenPriceEdit = (priceItem: OpdPriceItem) => {
		setSelectedPriceItem(priceItem);
		setEditPriceVal(String(priceItem.price));
		setIsPriceEditOpen(true);
	};

	const handlePriceEditSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (!selectedPriceItem) return;

		try {
			setIsSavingPrice(true);
			const response = await apiFetch("/patients/opd/prices", {
				method: "POST",
				body: JSON.stringify({
					itemCode: selectedPriceItem.item_code,
					price: parseFloat(editPriceVal),
				}),
			});

			if (response.success) {
				setSuccess("Catalogue price modified successfully!");
				setIsPriceEditOpen(false);
				fetchPrices();
			}
		} catch (err) {
			setError((err instanceof Error && err.message) || "Price edit failed");
		} finally {
			setIsSavingPrice(false);
		}
	};

	return {
		prices,
		setPrices,
		fetchPrices,
		selectedPriceItem,
		setSelectedPriceItem,
		editPriceVal,
		setEditPriceVal,
		isPriceEditOpen,
		setIsPriceEditOpen,
		isSavingPrice,
		handleOpenPriceEdit,
		handlePriceEditSubmit,
	};
}

export type UseOpdCatalogReturn = ReturnType<typeof useOpdCatalog>;
