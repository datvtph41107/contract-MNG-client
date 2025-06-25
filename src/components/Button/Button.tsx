import type React from "react";
import styles from "./Button.module.scss";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    children: React.ReactNode;
}

export default function Button({ variant = "primary", size = "md", className = "", children, ...props }: ButtonProps) {
    const buttonClass = `${styles.button} ${styles[variant]} ${styles[size]} ${className}`;

    return (
        <button className={buttonClass} {...props}>
            {children}
        </button>
    );
}
