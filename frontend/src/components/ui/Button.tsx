import React from 'react';
import styles from './Button.module.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    fullWidth = false,
    className = '',
    children,
    ...props
}) => {
    const classes = [
        styles.button,
        styles[variant],
        fullWidth ? styles.fullWidth : '',
        className
    ].join(' ');

    return (
        <button className={classes} {...props}>
            {children}
        </button>
    );
};
