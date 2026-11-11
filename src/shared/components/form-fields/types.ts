import type { Control, FieldPath, FieldValues } from "react-hook-form"

/**
 * Per-slot class overrides. Every field accepts `classNames` so a single usage
 * can restyle the wrapper, label, control, description or error message
 * without forking the component.
 */
export type FieldClassNames = {
  root?: string
  label?: string
  control?: string
  description?: string
  error?: string
}

export type BaseFieldProps<T extends FieldValues> = {
  control: Control<T>
  name: FieldPath<T>
  label?: string
  description?: string
  disabled?: boolean
  classNames?: FieldClassNames
}
