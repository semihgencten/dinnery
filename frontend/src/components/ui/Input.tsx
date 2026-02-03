import React, { forwardRef } from 'react';
import styles from './Input.module.scss';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, className = '', ...props }, ref) => {
    return (
        <div className={styles.container}>
            {label && <label className={styles.label} htmlFor={props.id}>{label}</label>}
            <div className={styles.inputWrapper}>
                <input
                    ref={ref}
                    className={`${styles.input} ${className}`}
                    {...props}
                />
            </div>
            {error && <span className={styles.error}>{error}</span>}
        </div>
    );
});

Input.displayName = 'Input';
