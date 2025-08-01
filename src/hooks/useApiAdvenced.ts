import { useState, useCallback, useRef, useEffect } from "react";
import type { ApiError } from "~/types/api.types";

interface UseApiAdvancedOptions {
    // Tự động reset error sau một khoảng thời gian
    autoResetError?: number;
    // Tự động reset data sau một khoảng thời gian
    autoResetData?: number;
    // Retry khi gặp lỗi
    retryCount?: number;
    // Delay giữa các lần retry
    retryDelay?: number;
    // Callback khi thành công
    onSuccess?: (data: any) => void;
    // Callback khi có lỗi
    onError?: (error: ApiError) => void;
}

interface UseApiAdvancedState<T> {
    data: T | null;
    loading: boolean;
    error: ApiError | null;
    retryAttempt: number;
}

interface UseApiAdvancedReturn<T> extends UseApiAdvancedState<T> {
    execute: (...args: any[]) => Promise<T>;
    reset: () => void;
    retry: () => Promise<T | undefined>;
}

export function useApiAdvanced<T>(
    apiFunction: (...args: any[]) => Promise<T>,
    options: UseApiAdvancedOptions = {},
): UseApiAdvancedReturn<T> {
    const { autoResetError = 0, autoResetData = 0, retryCount = 0, retryDelay = 1000, onSuccess, onError } = options;

    const [state, setState] = useState<UseApiAdvancedState<T>>({
        data: null,
        loading: false,
        error: null,
        retryAttempt: 0,
    });

    const lastArgsRef = useRef<any[]>([]);
    const errorTimeoutRef = useRef<NodeJS.Timeout>();
    const dataTimeoutRef = useRef<NodeJS.Timeout>();

    const executeWithRetry = useCallback(
        async (args: any[], attempt = 0): Promise<T> => {
            setState((prev) => ({
                ...prev,
                loading: true,
                error: null,
                retryAttempt: attempt,
            }));

            try {
                const result = await apiFunction(...args);

                setState((prev) => ({
                    ...prev,
                    data: result,
                    loading: false,
                    error: null,
                    retryAttempt: 0,
                }));

                // Success callback
                onSuccess?.(result);

                // Auto reset data
                if (autoResetData > 0) {
                    if (dataTimeoutRef.current) {
                        clearTimeout(dataTimeoutRef.current);
                    }
                    dataTimeoutRef.current = setTimeout(() => {
                        setState((prev) => ({ ...prev, data: null }));
                    }, autoResetData);
                }

                return result;
            } catch (error) {
                const apiError = error as ApiError;

                // Retry logic
                if (attempt < retryCount) {
                    await new Promise((resolve) => setTimeout(resolve, retryDelay));
                    return executeWithRetry(args, attempt + 1);
                }

                setState((prev) => ({
                    ...prev,
                    error: apiError,
                    loading: false,
                    retryAttempt: 0,
                }));

                // Error callback
                onError?.(apiError);

                // Auto reset error
                if (autoResetError > 0) {
                    if (errorTimeoutRef.current) {
                        clearTimeout(errorTimeoutRef.current);
                    }
                    errorTimeoutRef.current = setTimeout(() => {
                        setState((prev) => ({ ...prev, error: null }));
                    }, autoResetError);
                }

                throw error;
            }
        },
        [apiFunction, retryCount, retryDelay, autoResetError, autoResetData, onSuccess, onError],
    );

    const execute = useCallback(
        async (...args: any[]): Promise<T> => {
            lastArgsRef.current = args;
            return executeWithRetry(args);
        },
        [executeWithRetry],
    );

    const retry = useCallback(async (): Promise<T | undefined> => {
        if (lastArgsRef.current.length > 0) {
            return execute(...lastArgsRef.current);
        }
    }, [execute]);

    const reset = useCallback(() => {
        setState({
            data: null,
            loading: false,
            error: null,
            retryAttempt: 0,
        });

        // Clear timeouts
        if (errorTimeoutRef.current) {
            clearTimeout(errorTimeoutRef.current);
        }
        if (dataTimeoutRef.current) {
            clearTimeout(dataTimeoutRef.current);
        }
    }, []);

    // Cleanup timeouts on unmount
    useEffect(() => {
        return () => {
            if (errorTimeoutRef.current) {
                clearTimeout(errorTimeoutRef.current);
            }
            if (dataTimeoutRef.current) {
                clearTimeout(dataTimeoutRef.current);
            }
        };
    }, []);

    return {
        ...state,
        execute,
        reset,
        retry,
    };
}
