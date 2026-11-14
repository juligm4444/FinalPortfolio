import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import App from './App.jsx'

export { prerenderUrls, splitLocale } from './i18n/routes.js'
export { getRouteMeta, headHtml } from './i18n/meta.js'

/** Render one URL to markup. The scripts hydrate it on the client. */
export function render(url) {
  return renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  )
}
