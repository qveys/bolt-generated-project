import { forwardRef, useState, useCallback, InputHTMLAttributes } from 'react';
import {
  FloatingLabelBaseProps,
  containerStyles,
  getInputStyles,
  IconElement,
  ErrorMessage,
  FloatingLabel
} from './FloatingLabel';

interface FloatingLabelInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'>, FloatingLabelBaseProps {}

export const FloatingLabelInput = forwardRef<HTMLInputElement, FloatingLabelInputProps>(({
  label,
  error,
  icon,
  value,
  onChange,
  type = 'text',
  required,
  className = '',
  onFocus,
  onBlur,
  id,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const isFloating = isFocused || value || type === 'date';

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    onFocus?.();
  }, [onFocus]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onBlur?.();
  }, [onBlur]);

  return (
    <div className={containerStyles}>
      <IconElement icon={icon} />
      <input
        ref={ref}
        {...props}
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-required={required ? 'true' : undefined}
        className={`
          ${getInputStyles(!!icon, error)}
          placeholder-transparent
          ${className}
        `}
        placeholder={label}
      />
      <FloatingLabel
        label={label}
        required={required}
        isFloating={isFloating}
        hasIcon={!!icon}
        error={error}
        id={id}
      />
      <ErrorMessage id={id} error={error} />
    </div>
  );
});

FloatingLabelInput.displayName = 'FloatingLabelInput';
