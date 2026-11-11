import { MailIcon, PlusIcon } from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import Section from "../section"

const VARIANTS = [
  "default",
  "secondary",
  "outline",
  "ghost",
  "destructive",
  "link",
] as const

const SIZES = ["xs", "sm", "default", "lg"] as const

const ButtonsSection = () => (
  <Section title="Buttons" description="Variants, sizes, icons and states.">
    <div className="flex flex-wrap gap-2">
      {VARIANTS.map((variant) => (
        <Button key={variant} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
    <div className="flex flex-wrap items-center gap-2">
      {SIZES.map((size) => (
        <Button key={size} size={size}>
          {size}
        </Button>
      ))}
    </div>
    <div className="flex flex-wrap items-center gap-2">
      <Button>
        <MailIcon data-icon="inline-start" /> With icon
      </Button>
      <Button variant="outline">
        Add <PlusIcon data-icon="inline-end" />
      </Button>
      <Button size="icon" aria-label="Add">
        <PlusIcon />
      </Button>
      <Button size="icon-sm" variant="outline" aria-label="Add">
        <PlusIcon />
      </Button>
      <Button disabled>Disabled</Button>
    </div>
  </Section>
)

export default ButtonsSection
