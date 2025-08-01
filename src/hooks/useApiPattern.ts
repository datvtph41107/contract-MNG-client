import { useState, useCallback } from "react";
import type { ApiError } from "~/types/api.types";

interface UseApiState<T> {
    data: T | null;
    loading: boolean;
    error: ApiError | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
    execute: (...args: unknown[]) => Promise<T>;
    reset: () => void;
}

export function useApi<T>(apiFunction: (...args: unknown[]) => Promise<T>): UseApiReturn<T> {
    const [state, setState] = useState<UseApiState<T>>({
        data: null,
        loading: false,
        error: null,
    });

    const execute = useCallback(
        async (...args: unknown[]): Promise<T> => {
            setState((prev) => ({ ...prev, loading: true, error: null }));

            try {
                const result = await apiFunction(...args);
                setState((prev) => ({ ...prev, data: result, loading: false }));
                return result;
            } catch (error) {
                const apiError = error as ApiError;
                setState((prev) => ({ ...prev, error: apiError, loading: false }));
                throw error;
            }
        },
        [apiFunction],
    );

    const reset = useCallback(() => {
        setState({
            data: null,
            loading: false,
            error: null,
        });
    }, []);

    return {
        ...state,
        execute,
        reset,
    };
}
