import ButtonsSection from "./sections/buttons-section"
import FormsSection from "./sections/forms-section"
import LayoutSection from "./sections/layout-section"
import ModalsSection from "./sections/modals-section"
import NotificationsSection from "./sections/notifications-section"
import TableSection from "./sections/table-section"

const Template = () => (
  <main className="mx-auto flex max-w-3xl flex-col gap-10 p-6">
    <h1 className="text-2xl font-bold">Component template</h1>
    <ButtonsSection />
    <FormsSection />
    <TableSection />
    <ModalsSection />
    <NotificationsSection />
    <LayoutSection />
  </main>
)

export default Template
