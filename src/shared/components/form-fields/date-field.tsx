import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { FieldValues } from "react-hook-form"

import { Button } from "@/shared/components/ui/button"
import { Calendar } from "@/shared/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover"
import { cn } from "@/shared/lib/utils"
import FieldShell from "./field-shell"
import type { BaseFieldProps } from "./types"

type DateFieldProps<T extends FieldValues> = BaseFieldProps<T> & {
  placeholder?: string
}

const DateField = <T extends FieldValues>({
  placeholder = "Pick a date",
  ...shell
}: DateFieldProps<T>) => (
  <FieldShell {...shell}>
    {({ field, id, invalid }) => (
      <Popover>
        <PopoverTrigger
          render={
            <Button
              id={id}
              type="button"
              variant="outline"
              aria-invalid={invalid}
              disabled={field.disabled}
              className={cn(
                "w-full justify-start font-normal",
                !field.value && "text-muted-foreground",
                shell.classNames?.control,
              )}
            />
          }
        >
          <CalendarIcon />
          {field.value ? format(field.value, "PPP") : placeholder}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={field.value}
            onSelect={field.onChange}
          />
        </PopoverContent>
      </Popover>
    )}
  </FieldShell>
)

export default DateField
