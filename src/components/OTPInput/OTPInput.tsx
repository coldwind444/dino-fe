'use client'

import React, { useEffect, useRef, useState, ChangeEvent, KeyboardEvent } from "react";

type OTPInputProps = {
    length?: number;
    value?: string;
    onChange?: (value: string) => void;
    onComplete?: (value: string) => void;
    autoFocus?: boolean;
    inputMode?: 'numeric' | 'text';
    className?: string;
};

export default function OTPInput({
    length = 5,
    value: controlledValue,
    onChange,
    onComplete,
    autoFocus = true,
    inputMode = 'numeric',
    className = '',
}: OTPInputProps) {
    const isControlled = typeof controlledValue === 'string';
    const [value, setValue] = useState<string>(isControlled ? controlledValue : '');
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (isControlled) setValue(controlledValue || '');
    }, [controlledValue]);

    useEffect(() => {
        if (autoFocus && inputsRef.current[0]) {
            inputsRef.current[0].focus();
        }
    }, [autoFocus]);

    const valueArray = Array.from({ length }, (_, i) => value[i] || '');

    const notifyChange = (next: string) => {
        if (!isControlled) setValue(next);
        onChange?.(next);
        if (next.length === length && !next.includes('')) {
            onComplete?.(next);
        }
    };

    const focusInput = (index: number) => {
        const node = inputsRef.current[index];
        node?.focus();
    };

    const handleInput = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const raw = e.target.value;
        const char = raw.slice(-1);
        const accept = inputMode === 'numeric' ? /[0-9]/ : /[a-zA-Z0-9]/;

        if (!char.match(accept) && raw !== '') {
            e.target.value = valueArray[index] || '';
            return;
        }

        const nextChars = [...valueArray];
        nextChars[index] = char || '';
        const next = nextChars.join('');
        notifyChange(next);

        if (char && index < length - 1) focusInput(index + 1);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
        const key = e.key;

        if (key === 'Backspace') {
            e.preventDefault();
            const nextChars = [...valueArray];
            if (valueArray[index]) {
                nextChars[index] = '';
                notifyChange(nextChars.join(''));
                focusInput(index);
            } else if (index > 0) {
                nextChars[index - 1] = '';
                notifyChange(nextChars.join(''));
                focusInput(index - 1);
            }
        } else if (key === 'ArrowLeft' && index > 0) {
            e.preventDefault();
            focusInput(index - 1);
        } else if (key === 'ArrowRight' && index < length - 1) {
            e.preventDefault();
            focusInput(index + 1);
        } else if (key === 'Enter') {
            e.preventDefault();
            if (value.length === length && !value.includes('')) onComplete?.(value);
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const text = e.clipboardData.getData('text').trim();
        if (!text) return;

        const accept = inputMode === 'numeric' ? /[0-9]/g : /[a-zA-Z0-9]/g;
        const filtered = (text.match(accept) || []).slice(0, length).join('');
        if (!filtered) return;

        notifyChange(filtered.padEnd(length, '').slice(0, length));
        focusInput(filtered.length >= length ? length - 1 : filtered.length);
    };

    return (
        <div className={`inline-flex gap-3 items-center ${className}`}>
            {Array.from({ length }).map((_, i) => (
                <input
                    key={i}
                    ref={(el) => { inputsRef.current[i] = el }}
                    inputMode={inputMode}
                    aria-label={`Digit ${i + 1} of ${length}`}
                    type="text"
                    maxLength={1}
                    value={valueArray[i]}
                    onChange={(e) => handleInput(e, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    onPaste={handlePaste}
                    className="w-12 h-12 text-center text-xl font-medium rounded-lg border border-gray-300 focus:border-blue-500 outline-none shadow-sm"
                    style={{ caretColor: 'transparent' }}
                />
            ))}
        </div>
    );
}