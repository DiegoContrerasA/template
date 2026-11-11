import { useTranslate } from "@/shared/lib/i18n"

const Home = () => {
  const { t } = useTranslate()

  return (
    <div>
      <h1>{t("home.title")}</h1>
      <p>{t("home.subtitle")}</p>
    </div>
  )
}

export default Home
