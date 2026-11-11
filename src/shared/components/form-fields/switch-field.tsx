import type { FieldValues } from "react-hook-form"

import { Switch } from "@/shared/components/ui/switch"
import FieldShell from "./field-shell"
import type { BaseFieldProps } from "./types"

const SwitchField = <T extends FieldValues>(props: BaseFieldProps<T>) => (
  <FieldShell {...props} horizontal>
    {({ field, id, invalid }) => (
      <Switch
        id={id}
        checked={Boolean(field.value)}
        onCheckedChange={field.onChange}
        disabled={field.disabled}
        aria-invalid={invalid}
        className={props.classNames?.control}
      />
    )}
  </FieldShell>
)

export default SwitchField
