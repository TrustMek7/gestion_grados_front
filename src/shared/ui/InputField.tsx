import { useId } from 'react'
import type { InputHTMLAttributes } from 'react'

export function InputField({ label, error, id, className = '', ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  return (
    <div className="min-w-0">
      <label htmlFor={fieldId} className="mb-1.5 block text-xs font-medium text-muted">{label}{props.required && <span aria-hidden="true"> *</span>}</label>
      <input id={fieldId} aria-invalid={Boolean(error)} aria-describedby={error ? fieldId + '-error' : undefined}
        className={`min-h-11 w-full rounded-lg border bg-white px-3 py-2 text-sm ${error ? 'border-danger' : 'border-outline'} ${className}`} {...props} />
      {error && <p id={fieldId + '-error'} className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  )
}
