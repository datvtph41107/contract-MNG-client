"use client";

import { useState } from "react";
import { useContractStore } from "~/store/contract-store";
import { generateContractCode, formatVietnameseDate } from "~/utils/contract.utils";
import type { DateRange, ContractFormData } from "../types/contract.types";

export const useContractForm = () => {
    const { contractData, updateContractData } = useContractStore();

    const [selectedType, setSelectedType] = useState(contractData.contractType || "service");
    const [selectedDrafter, setSelectedDrafter] = useState(contractData.drafter || "");
    const [selectedManager, setSelectedManager] = useState(contractData.contractManager || "");
    const [dateRange, setDateRange] = useState<DateRange>({
        startDate: contractData.startDate ? new Date(contractData.startDate) : null,
        endDate: contractData.endDate ? new Date(contractData.endDate) : null,
    });

    const defaultValues: ContractFormData = {
        contractCode: contractData.contractCode || generateContractCode(),
        title: contractData.title || "",
        contractType: selectedType,
        creationDate: formatVietnameseDate(new Date()),
        drafter: selectedDrafter,
        contractManager: selectedManager,
        description: contractData.description || "",
        startDate: contractData.startDate || "",
        endDate: contractData.endDate || "",
        ...contractData,
    };

    const handleSubmit = (data: ContractFormData) => {
        const formattedData = {
            ...data,
            contractType: selectedType,
            drafter: selectedDrafter,
            contractManager: selectedManager,
            startDate: dateRange.startDate?.toISOString() || "",
            endDate: dateRange.endDate?.toISOString() || "",
            creationDate: formatVietnameseDate(new Date()),
        };
        updateContractData(formattedData);
        console.log("Form submitted:", formattedData);
    };

    const handleError = (errors: any) => {
        console.log("Form errors:", errors);
    };

    return {
        // State
        selectedType,
        selectedDrafter,
        selectedManager,
        dateRange,
        defaultValues,

        // Handlers
        setSelectedType,
        setSelectedDrafter,
        setSelectedManager,
        setDateRange,
        handleSubmit,
        handleError,
    };
};
