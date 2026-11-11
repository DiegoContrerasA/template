import type { FieldValues } from "react-hook-form"

import { Textarea } from "@/shared/components/ui/textarea"
import FieldShell from "./field-shell"
import type { BaseFieldProps } from "./types"

type TextareaFieldProps<T extends FieldValues> = BaseFieldProps<T> & {
  placeholder?: string
  rows?: number
}

const TextareaField = <T extends FieldValues>({
  placeholder,
  rows,
  ...shell
}: TextareaFieldProps<T>) => (
  <FieldShell {...shell}>
    {({ field, id, invalid }) => (
      <Textarea
        {...field}
        id={id}
        rows={rows}
        placeholder={placeholder}
        aria-invalid={invalid}
        className={shell.classNames?.control}
      />
    )}
  </FieldShell>
)

export default TextareaField
