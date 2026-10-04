import { clsx } from 'clsx';
import type { InputHTMLAttributes } from 'react';

import styles from './Input.module.scss';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
    return <input className={clsx(styles.input, className)} {...props} />;
}
