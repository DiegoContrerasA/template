import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import {
  CheckboxField,
  DateField,
  InputField,
  RadioGroupField,
  SelectField,
  SwitchField,
  TextareaField,
} from "@/shared/components/form-fields"
import { Button } from "@/shared/components/ui/button"
import { FieldGroup } from "@/shared/components/ui/field"
import Section from "../section"

const schema = z.object({
  name: z.string().min(2, "At least 2 characters"),
  email: z.email("Invalid email"),
  role: z.string().min(1, "Select a role"),
  plan: z.string().min(1, "Choose a plan"),
  birthday: z.date({ error: "Pick a date" }),
  nickname: z.string().optional(),
  bio: z.string().optional(),
  newsletter: z.boolean(),
  terms: z.boolean().refine((value) => value, "You must accept the terms"),
})

type FormValues = z.infer<typeof schema>

const ROLES = [
  { value: "admin", label: "Admin" },
  { value: "member", label: "Member" },
]

const PLANS = [
  { value: "free", label: "Free" },
  { value: "pro", label: "Pro" },
]

const FormsSection = () => {
  const { control, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
      plan: "",
      nickname: "",
      bio: "",
      newsletter: false,
      terms: false,
    },
  })

  const onSubmit = (values: FormValues) => {
    toast.success("Form submitted", { description: values.email })
    reset()
  }

  return (
    <Section
      title="Forms"
      description="react-hook-form + zod + shadcn. Submit empty to see the errors."
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          <InputField
            control={control}
            name="name"
            label="Name"
            placeholder="Jane Doe"
          />
          <InputField
            control={control}
            name="email"
            label="Email"
            type="email"
            description="We never share it."
          />
          <SelectField
            control={control}
            name="role"
            label="Role"
            placeholder="Select a role"
            options={ROLES}
          />
          <RadioGroupField
            control={control}
            name="plan"
            label="Plan"
            options={PLANS}
          />
          <DateField control={control} name="birthday" label="Birthday" />
          <TextareaField control={control} name="bio" label="Bio" rows={3} />
          <SwitchField
            control={control}
            name="newsletter"
            label="Subscribe to newsletter"
          />
          <CheckboxField
            control={control}
            name="terms"
            label="I accept the terms"
          />
          <InputField
            control={control}
            name="nickname"
            label="Override example"
            classNames={{
              label: "text-primary",
              control: "border-primary",
            }}
          />
          <Button type="submit" className="self-start">
            Submit
          </Button>
        </FieldGroup>
      </form>
      <p className="text-sm text-muted-foreground">
        Every field accepts <code>classNames</code> (root, label, control,
        description, error) to override styles per usage.
      </p>
    </Section>
  )
}

export default FormsSection
