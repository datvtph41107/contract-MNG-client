import React from "react";
import styles from "./NetworkStatus.module.scss";

interface NetworkStatusProps {
    isConnected: boolean;
    apiUrl?: string;
    onRetry?: () => void;
}

const NetworkStatus: React.FC<NetworkStatusProps> = ({ 
    isConnected, 
    apiUrl = "the backend API", 
    onRetry 
}) => {
    if (isConnected) return null;

    return (
        <div className={styles.networkStatus}>
            <div className={styles.container}>
                <div className={styles.icon}>⚠️</div>
                <div className={styles.content}>
                    <h3 className={styles.title}>Backend API Not Available</h3>
                    <p className={styles.message}>
                        Unable to connect to {apiUrl}. Please ensure the backend server is running.
                    </p>
                    <div className={styles.actions}>
                        {onRetry && (
                            <button 
                                className={styles.retryButton}
                                onClick={onRetry}
                            >
                                Retry Connection
                            </button>
                        )}
                        <div className={styles.instructions}>
                            <p><strong>For developers:</strong></p>
                            <ul>
                                <li>Check if the backend API server is running</li>
                                <li>Verify the API URL in your environment configuration</li>
                                <li>Ensure CORS is properly configured</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NetworkStatus;
