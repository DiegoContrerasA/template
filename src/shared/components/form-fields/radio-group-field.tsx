import type { FieldValues } from "react-hook-form"

import { Label } from "@/shared/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group"
import FieldShell from "./field-shell"
import type { BaseFieldProps } from "./types"

export type RadioOption = { value: string; label: string }

type RadioGroupFieldProps<T extends FieldValues> = BaseFieldProps<T> & {
  options: RadioOption[]
}

const RadioGroupField = <T extends FieldValues>({
  options,
  ...shell
}: RadioGroupFieldProps<T>) => (
  <FieldShell {...shell}>
    {({ field, id, invalid }) => (
      <RadioGroup
        id={id}
        value={field.value ?? ""}
        onValueChange={field.onChange}
        disabled={field.disabled}
        aria-invalid={invalid}
        className={shell.classNames?.control}
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-center gap-2">
            <RadioGroupItem
              id={`${id}-${option.value}`}
              value={option.value}
              aria-invalid={invalid}
            />
            <Label htmlFor={`${id}-${option.value}`} className="font-normal">
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    )}
  </FieldShell>
)

export default RadioGroupField
