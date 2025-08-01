import { Logger } from "../../Logger";

export interface RetryConfig {
    attempts: number;
    delay: number;
    backoff: "linear" | "exponential";
    retryCondition?: (error: any) => boolean;
}

export class RetryManager {
    private static instance: RetryManager;
    private logger: Logger;

    private constructor() {
        this.logger = Logger.getInstance();
    }

    static getInstance(): RetryManager {
        if (!RetryManager.instance) {
            RetryManager.instance = new RetryManager();
        }
        return RetryManager.instance;
    }

    async executeWithRetry<T>(operation: () => Promise<T>, config: RetryConfig): Promise<T> {
        let lastError: any;

        for (let attempt = 1; attempt <= config.attempts; attempt++) {
            try {
                const result = await operation();
                if (attempt > 1) {
                    this.logger.info(`Operation succeeded on attempt ${attempt}`);
                }
                return result;
            } catch (error) {
                lastError = error;

                if (attempt === config.attempts) {
                    this.logger.error(`Operation failed after ${config.attempts} attempts`, error);
                    break;
                }

                if (config.retryCondition && !config.retryCondition(error)) {
                    this.logger.info("Retry condition not met, stopping retries");
                    break;
                }

                const delay = this.calculateDelay(attempt, config);
                this.logger.warn(`Attempt ${attempt} failed, retrying in ${delay}ms`, error);

                await this.sleep(delay);
            }
        }

        throw lastError;
    }

    private calculateDelay(attempt: number, config: RetryConfig): number {
        if (config.backoff === "exponential") {
            return config.delay * Math.pow(2, attempt - 1);
        }
        return config.delay * attempt;
    }

    private sleep(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
