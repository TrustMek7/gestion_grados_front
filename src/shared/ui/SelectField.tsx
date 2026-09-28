import { useId } from 'react'
import type { SelectHTMLAttributes } from 'react'

export function SelectField({ label, id, className = '', children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  return (
    <div className="min-w-0">
      <label htmlFor={fieldId} className="mb-1.5 block text-xs font-medium text-muted">{label}</label>
      <select id={fieldId} className={`min-h-11 w-full rounded-lg border border-outline bg-white px-3 py-2 text-sm text-ink disabled:opacity-50 ${className}`} {...props}>{children}</select>
    </div>
  )
}
