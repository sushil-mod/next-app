import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge classes with tailwind-merge with clsx full feature */
const cn = (...classes: ClassValue[]) => twMerge(clsx(...classes));

export default cn;
