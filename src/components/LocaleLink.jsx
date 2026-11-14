import { forwardRef } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useLocale } from '../i18n/LocaleProvider.jsx'
import { localePath } from '../i18n/routes.js'

/* Drop-in for react-router's Link that prefixes internal paths with the
   current language. `to="/projects"` renders as /es/projects or /en/projects. */
const LocaleLink = forwardRef(function LocaleLink({ to, ...rest }, ref) {
  const { locale } = useLocale()
  const target = typeof to === 'string' ? localePath(locale, to) : { ...to, pathname: localePath(locale, to.pathname ?? '/') }
  return <Link ref={ref} to={target} {...rest} />
})

export const LocaleNavLink = forwardRef(function LocaleNavLink({ to, ...rest }, ref) {
  const { locale } = useLocale()
  return <NavLink ref={ref} to={localePath(locale, to)} {...rest} />
})

export default LocaleLink
