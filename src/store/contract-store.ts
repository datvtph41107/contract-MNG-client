import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ContractParty {
    name: string;
    taxCode: string;
    representative: string;
    position: string;
    address: string;
    phone: string;
    email: string;
}

export interface Milestone {
    id: number;
    title: string;
    description: string;
    type: string;
    dueDate: Date | string;
    status: string;
    priority: string;
    assignee: string;
    tasks: Task[];
}

export interface Task {
    id: number;
    title: string;
    description: string;
    assignee: string;
    dueDate: Date | string;
    status: string;
    priority: string;
    estimatedHours?: number;
}

export interface AttachedFile {
    id: number;
    name: string;
    size: string;
    type: string;
}

interface ContractData {
    // Stage 1: Draft
    contractCode: string;
    contractName: string;
    contractType: string;
    manager: string;
    projectDescription: string;
    contractValue: string;
    startDate: Date | null;
    endDate: Date | null;
    paymentMethod: string;
    paymentSchedule: string;
    acceptanceConditions: string;
    attachedFiles: AttachedFile[];
    version: string;
    internalNotes: string;

    // Stage 2: Parties
    partyA: ContractParty;
    partyB: ContractParty;

    // Stage 3: Milestones
    milestones: Milestone[];

    // Completion status
    completedStages: boolean[];
}

interface ContractStore {
    contractData: ContractData;
    updateContractData: (data: Partial<ContractData>) => void;
    validateStage: (stage: number) => boolean;
    markStageComplete: (stage: number) => void;
    resetContract: () => void;
}

const initialContractData: ContractData = {
    contractCode: `HD-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
    contractName: "",
    contractType: "",
    manager: "",
    projectDescription: "",
    contractValue: "",
    startDate: null,
    endDate: null,
    paymentMethod: "Chuyển khoản",
    paymentSchedule: "Thanh toán theo tiến độ",
    acceptanceConditions: "",
    attachedFiles: [],
    version: "Draft v1.0",
    internalNotes: "",
    partyA: {
        name: "",
        taxCode: "",
        representative: "",
        position: "",
        address: "",
        phone: "",
        email: "",
    },
    partyB: {
        name: "",
        taxCode: "",
        representative: "",
        position: "",
        address: "",
        phone: "",
        email: "",
    },
    milestones: [],
    completedStages: [false, false, false, false],
};

export const useContractStore = create<ContractStore>()(
    persist(
        (set, get) => ({
            contractData: initialContractData,

            updateContractData: (data) => {
                set((state) => ({
                    contractData: { ...state.contractData, ...data },
                }));
            },

            validateStage: (stage: number) => {
                const { contractData } = get();

                switch (stage) {
                    case 1:
                        return true;
                        return !!(
                            contractData.contractName &&
                            contractData.contractType &&
                            contractData.manager &&
                            contractData.projectDescription
                        );
                    case 2:
                        return true;
                        return !!(
                            contractData.partyA.name &&
                            contractData.partyA.representative &&
                            contractData.partyB.name &&
                            contractData.partyB.representative
                        );
                    case 3:
                        return true;
                        return contractData.milestones.length > 0;
                    case 4:
                        return true; // Preview is always accessible if previous stages are complete
                    default:
                        return false;
                }
            },

            markStageComplete: (stage: number) => {
                set((state) => {
                    const newCompletedStages = [...state.contractData.completedStages];
                    newCompletedStages[stage - 1] = true;
                    return {
                        contractData: {
                            ...state.contractData,
                            completedStages: newCompletedStages,
                        },
                    };
                });
            },

            resetContract: () => {
                set({ contractData: initialContractData });
            },
        }),
        {
            name: "contract-storage",
        },
    ),
);
