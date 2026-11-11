import { useTranslate } from "@/shared/lib/i18n"

const Login = () => {
  const { t } = useTranslate()

  return (
    <div>
      <h1>{t("login.title")}</h1>
      <p>{t("login.subtitle")}</p>
    </div>
  )
}

export default Login
