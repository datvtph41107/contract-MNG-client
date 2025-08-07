import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { ContractDraft, ContractTemplate, ContractFormData } from "~/types/contract.types";
import { contractDraftService } from "~/services/api/contract-draft.service"; // Updated import

interface ContractDraftState {
    drafts: ContractDraft[];
    templates: ContractTemplate[]; // Still managing templates here for now
    currentDraft: ContractDraft | null;
    loading: boolean;
    error: string | null;
}

interface ContractDraftActions {
    // Draft management
    loadDrafts: (contractType?: string) => Promise<void>;
    loadDraft: (draftId: string) => Promise<ContractDraft | null>;
    saveDraft: (draftData: Partial<ContractFormData>, stage: number) => Promise<ContractDraft>;
    deleteDraft: (draftId: string) => Promise<void>;
    duplicateDraft: (draftId: string) => Promise<ContractDraft>;

    // Template management (using contractDraftService for now, as it has getTemplates/createFromTemplate)
    loadTemplates: (contractType?: string) => Promise<void>;
    createFromTemplate: (templateId: string, contractType: string) => Promise<ContractDraft>;

    // Auto-save functionality
    autoSave: (draftData: Partial<ContractFormData>, stage: number) => Promise<void>;

    // State management
    setCurrentDraft: (draft: ContractDraft | null) => void;
    clearError: () => void;
    setLoading: (loading: boolean) => void;
}

export const useContractDraftStore = create<ContractDraftState & ContractDraftActions>()(
    devtools(
        persist(
            (set, get) => ({
                // Initial state
                drafts: [],
                templates: [],
                currentDraft: null,
                loading: false,
                error: null,

                // Actions
                loadDrafts: async (contractType) => {
                    set({ loading: true, error: null });
                    try {
                        const drafts = await contractDraftService.getDrafts(contractType); // Using service
                        set({ drafts, loading: false });
                    } catch (error) {
                        set({
                            error: error instanceof Error ? error.message : "Failed to load drafts",
                            loading: false,
                        });
                    }
                },

                loadDraft: async (draftId) => {
                    set({ loading: true, error: null });
                    try {
                        const draft = await contractDraftService.getDraftById(draftId); // Using service
                        set({ currentDraft: draft, loading: false });
                        return draft;
                    } catch (error) {
                        set({
                            error: error instanceof Error ? error.message : "Failed to load draft",
                            loading: false,
                        });
                        return null;
                    }
                },

                saveDraft: async (draftData, stage) => {
                    set({ loading: true, error: null });
                    try {
                        const { currentDraft } = get();
                        let savedDraft: ContractDraft;

                        if (currentDraft) {
                            // Update existing draft
                            savedDraft = await contractDraftService.updateDraft(currentDraft.id, {
                                // Using service
                                ...draftData,
                                currentStage: stage,
                                updatedAt: new Date().toISOString(),
                            });
                        } else {
                            // Create new draft
                            savedDraft = await contractDraftService.createDraft({
                                // Using service
                                ...draftData,
                                currentStage: stage,
                                createdAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString(),
                            });
                        }

                        // Update drafts list
                        const { drafts } = get();
                        const updatedDrafts = currentDraft
                            ? drafts.map((d) => (d.id === currentDraft.id ? savedDraft : d))
                            : [...drafts, savedDraft];

                        set({
                            drafts: updatedDrafts,
                            currentDraft: savedDraft,
                            loading: false,
                        });

                        return savedDraft;
                    } catch (error) {
                        set({
                            error: error instanceof Error ? error.message : "Failed to save draft",
                            loading: false,
                        });
                        throw error;
                    }
                },

                deleteDraft: async (draftId) => {
                    set({ loading: true, error: null });
                    try {
                        await contractDraftService.deleteDraft(draftId); // Using service
                        const { drafts } = get();
                        set({
                            drafts: drafts.filter((d) => d.id !== draftId),
                            loading: false,
                        });
                    } catch (error) {
                        set({
                            error: error instanceof Error ? error.message : "Failed to delete draft",
                            loading: false,
                        });
                    }
                },

                duplicateDraft: async (draftId) => {
                    set({ loading: true, error: null });
                    try {
                        const newDraft = await contractDraftService.duplicateDraft(draftId); // Using service
                        const { drafts } = get();
                        set({
                            drafts: [...drafts, newDraft],
                            loading: false,
                        });
                        return newDraft;
                    } catch (error) {
                        set({
                            error: error instanceof Error ? error.message : "Failed to duplicate draft",
                            loading: false,
                        });
                        throw error;
                    }
                },

                loadTemplates: async (contractType) => {
                    set({ loading: true, error: null });
                    try {
                        const templates = await contractDraftService.getTemplates(contractType); // Using service
                        set({ templates, loading: false });
                    } catch (error) {
                        set({
                            error: error instanceof Error ? error.message : "Failed to load templates",
                            loading: false,
                        });
                    }
                },

                createFromTemplate: async (templateId, contractType) => {
                    set({ loading: true, error: null });
                    try {
                        const newDraft = await contractDraftService.createFromTemplate(templateId, contractType); // Using service
                        const { drafts } = get();
                        set({
                            drafts: [...drafts, newDraft],
                            currentDraft: newDraft,
                            loading: false,
                        });
                        return newDraft;
                    } catch (error) {
                        set({
                            error: error instanceof Error ? error.message : "Failed to create from template",
                            loading: false,
                        });
                        throw error;
                    }
                },

                autoSave: async (draftData, stage) => {
                    try {
                        const { currentDraft } = get();
                        if (currentDraft) {
                            await contractDraftService.updateDraft(currentDraft.id, {
                                // Using service
                                ...draftData,
                                currentStage: stage,
                                updatedAt: new Date().toISOString(),
                            });
                        }
                    } catch (error) {
                        console.error("Auto-save failed:", error);
                    }
                },

                setCurrentDraft: (draft) => set({ currentDraft: draft }),
                clearError: () => set({ error: null }),
                setLoading: (loading) => set({ loading }),
            }),
            {
                name: "contract-draft-storage",
                partialize: (state) => ({
                    currentDraft: state.currentDraft,
                }),
            },
        ),
        { name: "contract-draft-store" },
    ),
);
