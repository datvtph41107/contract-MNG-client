import { PublicApiClient } from "../clients/PublicApiClient";
import { PrivateApiClient } from "../clients/PrivateApiClient";
import { Logger } from "~/core/Logger";
import type { ApiMethod, ApiResponse } from "~/core/types/api.types";

export class ApiClient {
    private static instance: ApiClient;
    private logger = Logger.getInstance();

    private clients = {
        public: new PublicApiClient(),
        private: new PrivateApiClient(),
    };

    static getInstance(): ApiClient {
        if (!ApiClient.instance) {
            ApiClient.instance = new ApiClient();
        }
        return ApiClient.instance;
    }

    call<TResponse, TPayload = unknown>(
        method: ApiMethod,
        clientType: keyof typeof this.clients,
        url: string,
        payload?: TPayload,
    ): Promise<ApiResponse<TResponse>> {
        const client = this.clients[clientType];

        this.logger.request({ method, url });

        const methodHandlers: Record<ApiMethod, () => Promise<ApiResponse<TResponse>>> = {
            GET: () => client.get<TResponse, TPayload>(url, payload),
            DELETE: () => client.delete<TResponse>(url),
            POST: () => client.post<TResponse, TPayload>(url, payload),
            PUT: () => client.put<TResponse, TPayload>(url, payload),
            PATCH: () => client.patch<TResponse, TPayload>(url, payload),
        };

        const promise = methodHandlers[method]();

        return promise
            .then((res) => {
                this.logger.response({ status: res.status, config: { url } });
                return res;
            })
            .catch((err) => {
                this.logger.error(`Request failed: ${method} ${url}`, err);
                throw err;
            });
    }

    public = this.createClientMethods("public");
    private = this.createClientMethods("private");

    private createClientMethods(clientType: "public" | "private") {
        const methods = {} as Record<ApiMethod, typeof this.call>;

        (["GET", "POST", "PUT", "PATCH", "DELETE"] as ApiMethod[]).forEach((method) => {
            methods[method] = <T, P = unknown>(url: string, payload?: P) => this.call<T, P>(method, clientType, url, payload);
        });

        return methods;
    }
}
