import { useId } from "react"
import {
  Controller,
  type ControllerFieldState,
  type ControllerRenderProps,
  type FieldValues,
} from "react-hook-form"

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/shared/components/ui/field"
import type { BaseFieldProps } from "./types"

type FieldShellProps<T extends FieldValues> = BaseFieldProps<T> & {
  /** Render the control; receives RHF's `field`, the generated `id` and the invalid flag. */
  children: (args: {
    field: ControllerRenderProps<T>
    fieldState: ControllerFieldState
    id: string
    invalid: boolean
  }) => React.ReactNode
  /** Put the label after the control (switch / checkbox layouts). */
  horizontal?: boolean
}

const labelNode = (id: string, label?: string, className?: string) =>
  label && (
    <FieldLabel htmlFor={id} className={className}>
      {label}
    </FieldLabel>
  )

/**
 * Glue between react-hook-form and shadcn's `Field`: wires label, description
 * and error message to a single `Controller`. Every `*Field` is built on it.
 */
const FieldShell = <T extends FieldValues>({
  control,
  name,
  label,
  description,
  disabled,
  classNames,
  horizontal = false,
  children,
}: FieldShellProps<T>) => {
  const id = useId()

  return (
    <Controller
      control={control}
      name={name}
      disabled={disabled}
      render={({ field, fieldState }) => (
        <Field
          orientation={horizontal ? "horizontal" : "vertical"}
          data-invalid={fieldState.invalid}
          data-disabled={disabled}
          className={classNames?.root}
        >
          {!horizontal && labelNode(id, label, classNames?.label)}
          {children({ field, fieldState, id, invalid: fieldState.invalid })}
          {horizontal && labelNode(id, label, classNames?.label)}
          {description && (
            <FieldDescription className={classNames?.description}>
              {description}
            </FieldDescription>
          )}
          {fieldState.invalid && (
            <FieldError
              errors={[fieldState.error]}
              className={classNames?.error}
            />
          )}
        </Field>
      )}
    />
  )
}

export default FieldShell
