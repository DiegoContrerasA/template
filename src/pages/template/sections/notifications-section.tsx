import { toast } from "sonner"

import { Button } from "@/shared/components/ui/button"
import Section from "../section"

const fakeRequest = () =>
  new Promise<void>((resolve) => setTimeout(resolve, 1500))

const NotificationsSection = () => (
  <Section title="Notifications" description="Toasts via sonner.">
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={() => toast("Default")}>
        Default
      </Button>
      <Button variant="outline" onClick={() => toast.success("Saved")}>
        Success
      </Button>
      <Button variant="outline" onClick={() => toast.error("Something failed")}>
        Error
      </Button>
      <Button variant="outline" onClick={() => toast.warning("Careful")}>
        Warning
      </Button>
      <Button variant="outline" onClick={() => toast.info("Heads up")}>
        Info
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast("Event created", {
            description: "Monday, 10:00 AM",
            action: { label: "Undo", onClick: () => toast.info("Undone") },
          })
        }
      >
        With action
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.promise(fakeRequest(), {
            loading: "Saving...",
            success: "Saved!",
            error: "Failed",
          })
        }
      >
        Promise
      </Button>
    </div>
  </Section>
)

export default NotificationsSection
