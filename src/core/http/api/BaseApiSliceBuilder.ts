import {
    createSlice,
    createAsyncThunk,
    type SliceCaseReducers,
    type PayloadAction,
    type ActionReducerMapBuilder,
    type CaseReducer,
    type AsyncThunk,
    type ValidateSliceCaseReducers,
} from "@reduxjs/toolkit";

import type { AxiosError } from "axios";
import type { ApiEndpoint } from "~/core/types/api.types";
import { ApiClient } from "./ApiClient";
import { Logger } from "~/core/Logger";

export type ErrorPayload = {
    statusCode?: number;
    message?: string;
};

export type BaseApiState = {
    loading: boolean;
    error: string | null;
};

export type ApiThunk = AsyncThunk<unknown, { params?: unknown; body?: unknown }, { rejectValue: unknown }>;

type BaseReducers<TState> = {
    clearError: CaseReducer<TState>;
    setLoading: CaseReducer<TState, PayloadAction<boolean>>;
    resetState: CaseReducer<TState>;
};

export interface ApiSliceConfig<TState extends BaseApiState, TReducers extends SliceCaseReducers<TState>> {
    name: string;
    initialState: TState;
    endpoints: Record<string, ApiEndpoint>;
    reducers?: TReducers;
    extraReducers?: (builder: ActionReducerMapBuilder<TState>, thunks: Record<string, ApiThunk>) => void;
    // ✅ New option to disable default loading/error handling
    disableDefaultHandlers?: boolean;
}

function isErrorPayload(payload: unknown): payload is ErrorPayload {
    return typeof payload === "object" && payload !== null && ("statusCode" in payload || "message" in payload);
}

export class BaseApiSliceBuilder<TState extends BaseApiState, TReducers extends SliceCaseReducers<TState> = SliceCaseReducers<TState>> {
    private readonly name: string;
    private readonly initialState: TState;
    private readonly endpoints: Record<string, ApiEndpoint>;
    private readonly reducers?: TReducers;
    private readonly extraReducers?: ApiSliceConfig<TState, TReducers>["extraReducers"];
    private readonly disableDefaultHandlers: boolean;
    private readonly apiClient = ApiClient.getInstance();
    private readonly logger = Logger.getInstance();

    public readonly thunks: Record<string, ApiThunk> = {};

    constructor(config: ApiSliceConfig<TState, TReducers>) {
        this.name = config.name;
        this.initialState = config.initialState;
        this.endpoints = config.endpoints;
        this.reducers = config.reducers;
        this.extraReducers = config.extraReducers;
        this.disableDefaultHandlers = config.disableDefaultHandlers ?? false;

        this.createThunks();
    }

    private createThunks() {
        for (const [key, endpoint] of Object.entries(this.endpoints)) {
            this.thunks[key] = createAsyncThunk(
                `${this.name}/${key}`,
                async (payload: { params?: unknown; body?: unknown } = {}, { rejectWithValue }) => {
                    try {
                        const response = await this.callApi(endpoint, payload);
                        this.logger.info(`Thunk ${this.name}/${key} fulfilled`, response.data);
                        return response.data;
                    } catch (error: unknown) {
                        const axiosError = error as AxiosError;
                        this.logger.error(`Thunk ${this.name}/${key} rejected`, {
                            message: axiosError?.message,
                            response: axiosError?.response?.data,
                            status: axiosError?.response?.status,
                        });

                        if (axiosError?.response?.status === 401) {
                            window.dispatchEvent(new CustomEvent("auth:unauthorized"));
                        }

                        return rejectWithValue(axiosError?.response?.data || axiosError?.message || "Unknown error");
                    }
                },
            );
        }
    }

    private async callApi(endpoint: ApiEndpoint, payload: { params?: unknown; body?: unknown }) {
        const { method, url, clientType = "public", transformParams, transformBody } = endpoint;
        const finalUrl = typeof url === "function" ? url(payload.params) : url;
        const finalParams = transformParams?.(payload.params) ?? payload.params;
        const finalBody = transformBody?.(payload.body) ?? payload.body;

        const isGetOrDelete = method === "GET" || method === "DELETE";
        const requestPayload = isGetOrDelete ? finalParams : finalBody;

        return this.apiClient.call(method, clientType, finalUrl, requestPayload);
    }

    public buildSlice() {
        const baseReducers: BaseReducers<TState> = {
            clearError: (state) => {
                state.error = null;
            },
            setLoading: (state, action: PayloadAction<boolean>) => {
                state.loading = action.payload;
            },
            resetState: (state) => {
                const initial = this.initialState;
                const draft = state as TState;
                for (const key of Object.keys(initial) as Array<keyof TState>) {
                    draft[key] = initial[key];
                }
            },
        };

        const slice = createSlice({
            name: this.name,
            initialState: this.initialState,
            reducers: {
                ...baseReducers,
                ...this.reducers,
            } as ValidateSliceCaseReducers<TState, BaseReducers<TState> & TReducers>,
            extraReducers: (builder) => {
                // ✅ Add default handlers first (only if not disabled)
                if (!this.disableDefaultHandlers) {
                    for (const thunk of Object.values(this.thunks)) {
                        builder
                            .addCase(thunk.pending, (state) => {
                                state.loading = true;
                                state.error = null;
                            })
                            .addCase(thunk.fulfilled, (state) => {
                                state.loading = false;
                            })
                            .addCase(thunk.rejected, (state, action) => {
                                state.loading = false;
                                state.error = action.payload as string;

                                if (isErrorPayload(action.payload)) {
                                    if (action.payload.statusCode === 401 || action.payload.message?.toLowerCase().includes("session")) {
                                        // Custom handling if needed
                                    }
                                }
                            });
                    }
                }

                if (this.extraReducers) {
                    this.extraReducers(builder, this.thunks);
                }
            },
        });

        return {
            slice,
            thunks: this.thunks,
            actions: slice.actions,
            reducer: slice.reducer,
        };
    }
}
