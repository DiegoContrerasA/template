import type { FieldValues } from "react-hook-form"

import { Checkbox } from "@/shared/components/ui/checkbox"
import FieldShell from "./field-shell"
import type { BaseFieldProps } from "./types"

const CheckboxField = <T extends FieldValues>(props: BaseFieldProps<T>) => (
  <FieldShell {...props} horizontal>
    {({ field, id, invalid }) => (
      <Checkbox
        id={id}
        checked={Boolean(field.value)}
        onCheckedChange={field.onChange}
        onBlur={field.onBlur}
        disabled={field.disabled}
        aria-invalid={invalid}
        className={props.classNames?.control}
      />
    )}
  </FieldShell>
)

export default CheckboxField
