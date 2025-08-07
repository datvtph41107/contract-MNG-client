import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { ContractTypeTemplate } from "~/types/contract-template.types";

interface ContractTemplateState {
    templates: ContractTypeTemplate[];
    loading: boolean;
    error: string | null;
}

interface ContractTemplateActions {
    loadTemplates: () => Promise<void>;
    loadTemplatesByType: (contractType: string) => Promise<void>;
    createTemplate: (template: Partial<ContractTypeTemplate>) => Promise<ContractTypeTemplate>;
    updateTemplate: (id: string, template: Partial<ContractTypeTemplate>) => Promise<ContractTypeTemplate>;
    deleteTemplate: (id: string) => Promise<void>;
    duplicateTemplate: (id: string) => Promise<ContractTypeTemplate>;
    getTemplate: (id: string) => ContractTypeTemplate | null;
    clearError: () => void;
}

export const useContractTemplateStore = create<ContractTemplateState & ContractTemplateActions>()(
    devtools(
        persist(
            (set, get) => ({
                templates: [],
                loading: false,
                error: null,

                loadTemplates: async () => {
                    set({ loading: true, error: null });
                    try {
                        // Mock API call - replace with actual API
                        const response = await fetch("/api/contract-templates");
                        const templates = await response.json();
                        set({ templates, loading: false });
                    } catch (error) {
                        set({
                            error: error instanceof Error ? error.message : "Failed to load templates",
                            loading: false,
                        });
                    }
                },

                loadTemplatesByType: async (contractType: string) => {
                    set({ loading: true, error: null });
                    try {
                        const response = await fetch(`/api/contract-templates?type=${contractType}`);
                        const templates = await response.json();
                        set({ templates, loading: false });
                    } catch (error) {
                        set({
                            error: error instanceof Error ? error.message : "Failed to load templates",
                            loading: false,
                        });
                    }
                },

                createTemplate: async (templateData) => {
                    set({ loading: true, error: null });
                    try {
                        const response = await fetch("/api/contract-templates", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(templateData),
                        });
                        const newTemplate = await response.json();

                        set((state) => ({
                            templates: [...state.templates, newTemplate],
                            loading: false,
                        }));

                        return newTemplate;
                    } catch (error) {
                        set({
                            error: error instanceof Error ? error.message : "Failed to create template",
                            loading: false,
                        });
                        throw error;
                    }
                },

                updateTemplate: async (id, templateData) => {
                    set({ loading: true, error: null });
                    try {
                        const response = await fetch(`/api/contract-templates/${id}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(templateData),
                        });
                        const updatedTemplate = await response.json();

                        set((state) => ({
                            templates: state.templates.map((t) => (t.id === id ? updatedTemplate : t)),
                            loading: false,
                        }));

                        return updatedTemplate;
                    } catch (error) {
                        set({
                            error: error instanceof Error ? error.message : "Failed to update template",
                            loading: false,
                        });
                        throw error;
                    }
                },

                deleteTemplate: async (id) => {
                    set({ loading: true, error: null });
                    try {
                        await fetch(`/api/contract-templates/${id}`, {
                            method: "DELETE",
                        });

                        set((state) => ({
                            templates: state.templates.filter((t) => t.id !== id),
                            loading: false,
                        }));
                    } catch (error) {
                        set({
                            error: error instanceof Error ? error.message : "Failed to delete template",
                            loading: false,
                        });
                        throw error;
                    }
                },

                duplicateTemplate: async (id) => {
                    set({ loading: true, error: null });
                    try {
                        const response = await fetch(`/api/contract-templates/${id}/duplicate`, {
                            method: "POST",
                        });
                        const duplicatedTemplate = await response.json();

                        set((state) => ({
                            templates: [...state.templates, duplicatedTemplate],
                            loading: false,
                        }));

                        return duplicatedTemplate;
                    } catch (error) {
                        set({
                            error: error instanceof Error ? error.message : "Failed to duplicate template",
                            loading: false,
                        });
                        throw error;
                    }
                },

                getTemplate: (id) => {
                    const { templates } = get();
                    return templates.find((t) => t.id === id) || null;
                },

                clearError: () => set({ error: null }),
            }),
            {
                name: "contract-template-storage",
                partialize: (state) => ({
                    templates: state.templates,
                }),
            },
        ),
        { name: "contract-template-store" },
    ),
);
