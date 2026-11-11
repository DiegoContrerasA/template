import type { FieldValues } from "react-hook-form"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import FieldShell from "./field-shell"
import type { BaseFieldProps } from "./types"

export type SelectOption = { value: string; label: string }

type SelectFieldProps<T extends FieldValues> = BaseFieldProps<T> & {
  options: SelectOption[]
  placeholder?: string
}

const SelectField = <T extends FieldValues>({
  options,
  placeholder,
  ...shell
}: SelectFieldProps<T>) => (
  <FieldShell {...shell}>
    {({ field, id, invalid }) => (
      <Select
        items={options}
        value={field.value ?? null}
        onValueChange={field.onChange}
        disabled={field.disabled}
      >
        <SelectTrigger
          id={id}
          aria-invalid={invalid}
          onBlur={field.onBlur}
          className={shell.classNames?.control ?? "w-full"}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )}
  </FieldShell>
)

export default SelectField
