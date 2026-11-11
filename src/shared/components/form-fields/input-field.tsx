import type { FieldValues } from "react-hook-form"

import { Input } from "@/shared/components/ui/input"
import FieldShell from "./field-shell"
import type { BaseFieldProps } from "./types"

type InputFieldProps<T extends FieldValues> = BaseFieldProps<T> & {
  type?: React.ComponentProps<"input">["type"]
  placeholder?: string
}

const InputField = <T extends FieldValues>({
  type = "text",
  placeholder,
  ...shell
}: InputFieldProps<T>) => (
  <FieldShell {...shell}>
    {({ field, id, invalid }) => (
      <Input
        {...field}
        id={id}
        type={type}
        placeholder={placeholder}
        aria-invalid={invalid}
        className={shell.classNames?.control}
      />
    )}
  </FieldShell>
)

export default InputField
