'use client';

import { forwardRef, useState } from 'react';
import type { SacredInputProps } from './types';

const SacredInput = forwardRef<HTMLInputElement, SacredInputProps>(
  ({ label, error, type = 'text', className = '', showPasswordToggle = false, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isFocused, setIsFocused] = useState<boolean>(false);

    const inputType =
      showPasswordToggle && type === 'password' ? (showPassword ? 'text' : 'password') : type;

    const handleTogglePassword = (): void => {
      setShowPassword(!showPassword);
    };

    const handleFocus = (): void => {
      setIsFocused(true);
    };

    const handleBlur = (): void => {
      setIsFocused(false);
    };

    return (
      <div className="w-full">
        {label && <label className="sacred-label">{label}</label>}
        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            className={`sacred-input ${error ? 'error' : ''} ${showPasswordToggle ? 'pr-12' : ''} ${className}`}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
          {showPasswordToggle && type === 'password' && (
            <button
              type="button"
              onClick={handleTogglePassword}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-sacred-blue-400 transition-colors duration-200 hover:text-sacred-blue-600"
            >
              {showPassword ? (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                  />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          )}
        </div>
        {error && <p className="sacred-error">{error}</p>}
      </div>
    );
  }
);

SacredInput.displayName = 'SacredInput';

export default SacredInput;
