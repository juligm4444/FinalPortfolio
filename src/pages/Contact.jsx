import { useEffect, useMemo, useState } from 'react'
import { useLocale } from '../i18n/LocaleProvider.jsx'
import Social from '../components/Social.jsx'
import IconButton from '../components/IconButton.jsx'
import { PaperPlaneIcon } from '../components/icons/IconSet.jsx'

const FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/ajax/julian_gm4@hotmail.com'

// ============== input + rate limit constraints (defence in depth) ==============
const LIMITS = {
  name: { min: 2, max: 80 },
  email: { min: 5, max: 120 },
  message: { min: 10, max: 2000 },
}
// allow only "human" characters; strips control chars and HTML angle-brackets
const sanitizeBasic = (s) =>
  String(s)
    .normalize('NFC')
    .replace(/[\x00-\x1F\x7F]/g, '') // control chars
    .replace(/<\s*\/?\s*[a-zA-Z][^>]*>/g, '') // any HTML-ish tag
    .replace(/\s+/g, ' ')
    .trim()
const sanitizeMessage = (s) =>
  String(s)
    .normalize('NFC')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .replace(/<\s*\/?\s*[a-zA-Z][^>]*>/g, '')
    .replace(/\r\n/g, '\n')
    .trim()
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const RATE_KEY = 'juligm4.contactLastSubmit'
const RATE_WINDOW_MS = 30_000 // 30 s between submissions per device
const SESSION_LIMIT = 5 // hard cap per session

const SESSION_KEY = 'juligm4.contactSessionCount'

// simple math captcha — survives a script bot more often than no captcha at all
const buildCaptcha = () => {
  const a = 2 + Math.floor(Math.random() * 7)
  const b = 2 + Math.floor(Math.random() * 7)
  return { a, b, expected: a + b }
}

export default function Contact() {
  const { t, locale } = useLocale()
  const [status, setStatus] = useState('idle') // idle | sending | sent | error | rate
  const [error, setError] = useState(null)
  const [captcha, setCaptcha] = useState(buildCaptcha)
  const [now, setNow] = useState(() => Date.now())

  // every 1s tick, so the cooldown countdown updates if needed
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const labels = useMemo(
    () =>
      locale === 'es'
        ? {
            name: 'Nombre',
            email: 'Correo',
            message: 'Mensaje',
            send: 'Enviar mensaje',
            sending: 'Enviando…',
            sent: '¡Mensaje enviado! Te respondo pronto.',
            error: 'Algo salió mal. Intenta de nuevo en un momento.',
            tooFast: 'Espera unos segundos antes de volver a enviar.',
            sessionFull: 'Has alcanzado el límite de envíos en esta sesión.',
            invalidEmail: 'Correo no válido.',
            tooShortMessage: 'El mensaje es muy corto.',
            tooLong: 'Texto demasiado largo.',
            captcha: '¿Cuánto es',
            captchaError: 'Verificación incorrecta.',
            orWrite: 'O escríbeme directamente a',
            social: 'Encuéntrame en',
          }
        : {
            name: 'Name',
            email: 'Email',
            message: 'Message',
            send: 'Send message',
            sending: 'Sending…',
            sent: 'Message sent! I’ll get back to you soon.',
            error: 'Something went wrong. Please try again in a moment.',
            tooFast: 'Hold on a few seconds before trying again.',
            sessionFull: 'You’ve reached the per-session limit.',
            invalidEmail: 'Invalid email address.',
            tooShortMessage: 'The message is too short.',
            tooLong: 'Text is too long.',
            captcha: 'What is',
            captchaError: 'Verification failed.',
            orWrite: 'Or write directly to',
            social: 'Find me on',
          },
    [locale]
  )

  const lastSubmit = Number(localStorage.getItem(RATE_KEY) || 0)
  const cooldownLeft = Math.max(0, RATE_WINDOW_MS - (now - lastSubmit))

  const onSubmit = async (e) => {
    e.preventDefault()
    setStatus('idle')
    setError(null)

    // ---------- defence in depth ----------
    // 1) per-session hard cap
    const sessionCount = Number(sessionStorage.getItem(SESSION_KEY) || 0)
    if (sessionCount >= SESSION_LIMIT) {
      setStatus('rate')
      setError(labels.sessionFull)
      return
    }
    // 2) device cooldown
    if (cooldownLeft > 0) {
      setStatus('rate')
      setError(`${labels.tooFast} (${Math.ceil(cooldownLeft / 1000)}s)`)
      return
    }

    const form = e.currentTarget
    const data = new FormData(form)

    // 3) honeypot
    if ((data.get('_honey') || '').toString().trim() !== '') {
      setStatus('error')
      setError('bot')
      return
    }

    // 4) sanitise + validate
    const name = sanitizeBasic(data.get('name'))
    const email = sanitizeBasic(data.get('email')).toLowerCase()
    const message = sanitizeMessage(data.get('message'))
    const captchaAns = Number(String(data.get('captcha') || '').trim())

    if (
      name.length < LIMITS.name.min ||
      email.length < LIMITS.email.min ||
      message.length < LIMITS.message.min
    ) {
      setStatus('error')
      setError(labels.tooShortMessage)
      return
    }
    if (
      name.length > LIMITS.name.max ||
      email.length > LIMITS.email.max ||
      message.length > LIMITS.message.max
    ) {
      setStatus('error')
      setError(labels.tooLong)
      return
    }
    if (!EMAIL_RE.test(email)) {
      setStatus('error')
      setError(labels.invalidEmail)
      return
    }
    if (!Number.isFinite(captchaAns) || captchaAns !== captcha.expected) {
      setStatus('error')
      setError(labels.captchaError)
      setCaptcha(buildCaptcha())
      return
    }

    // build a fresh, sanitised payload — never trust the raw FormData
    const payload = new FormData()
    payload.set('name', name)
    payload.set('email', email)
    payload.set('message', message)
    payload.set('_subject', 'New message from juligm4.com')
    payload.set('_template', 'table')
    payload.set('_captcha', 'false')

    setStatus('sending')
    try {
      // 8 s timeout to avoid hung sockets eating UI state
      const ctrl = new AbortController()
      const timer = setTimeout(() => ctrl.abort(), 8000)
      const res = await fetch(FORMSUBMIT_ENDPOINT, {
        method: 'POST',
        body: payload,
        headers: { Accept: 'application/json' },
        signal: ctrl.signal,
        // never send credentials/cookies cross-origin to a 3rd party
        credentials: 'omit',
        referrerPolicy: 'no-referrer',
        mode: 'cors',
      })
      clearTimeout(timer)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      // success — record submit, refresh captcha, reset form
      localStorage.setItem(RATE_KEY, String(Date.now()))
      sessionStorage.setItem(SESSION_KEY, String(sessionCount + 1))
      setStatus('sent')
      setCaptcha(buildCaptcha())
      form.reset()
    } catch (err) {
      setStatus('error')
      setError(err.message || 'unknown')
    }
  }

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 pb-32 pt-20 md:px-8 md:pt-32">
      <h1
        className="font-display"
        style={{
          color: 'var(--fg)',
          fontSize: 'clamp(48px, 7vw, 96px)',
          lineHeight: 1.02,
          fontWeight: 700,
          letterSpacing: '-0.01em',
        }}
      >
        {t('contact.title')}
      </h1>
      <p
        className="mt-6 font-body"
        style={{ color: 'var(--fg-soft)', fontSize: 18, lineHeight: 1.7, maxWidth: '50ch' }}
      >
        {t('contact.lead')}
      </p>

      <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
        {/* ============== form ============== */}
        <form onSubmit={onSubmit} className="md:col-span-7" noValidate autoComplete="on">
          {/* honeypot */}
          <input
            type="text"
            name="_honey"
            tabIndex={-1}
            autoComplete="off"
            style={{ position: 'absolute', left: -10000, top: 'auto', width: 1, height: 1, overflow: 'hidden' }}
          />

          <Field
            label={labels.name}
            name="name"
            type="text"
            required
            maxLength={LIMITS.name.max}
            autoComplete="name"
          />
          <Field
            label={labels.email}
            name="email"
            type="email"
            required
            maxLength={LIMITS.email.max}
            autoComplete="email"
            inputMode="email"
          />
          <Field
            label={labels.message}
            name="message"
            textarea
            required
            rows={6}
            maxLength={LIMITS.message.max}
          />

          {/* captcha — math */}
          <Field
            label={`${labels.captcha} ${captcha.a} + ${captcha.b}?`}
            name="captcha"
            type="number"
            required
            maxLength={3}
            autoComplete="off"
            inputMode="numeric"
            pattern="\d*"
          />

          {/* centered submit */}
          <div className="mt-10 flex justify-center">
            <IconButton
              as="button"
              type="submit"
              variant="primary"
              icon={PaperPlaneIcon}
              size="lg"
              disabled={status === 'sending'}
            >
              {status === 'sending' ? labels.sending : labels.send}
            </IconButton>
          </div>

          {/* status */}
          {status === 'sent' && (
            <p
              role="status"
              className="mt-6 text-center font-body"
              style={{ color: 'var(--fg)', fontSize: 16 }}
            >
              ✓ {labels.sent}
            </p>
          )}
          {(status === 'error' || status === 'rate') && (
            <p
              role="alert"
              className="mt-6 text-center font-body"
              style={{ color: '#FF0066', fontSize: 16 }}
            >
              ✕ {error || labels.error}
            </p>
          )}
        </form>

        {/* ============== sidebar ============== */}
        <aside className="md:col-span-5">
          <div
            className="p-8"
            style={{
              background: 'var(--surface-2)',
              border: '1px solid color-mix(in srgb, var(--fg) 10%, transparent)',
            }}
          >
            <p
              className="font-nav uppercase"
              style={{ color: 'var(--fg-muted)', fontSize: 12, letterSpacing: '0.22em' }}
            >
              {labels.orWrite}
            </p>

            <a
              href={`mailto:${t('contact.cta')}`}
              className="mt-4 block font-display single-line-email"
              style={{
                color: 'var(--fg)',
                fontSize: 'clamp(14px, 1.7vw, 20px)',
                fontWeight: 700,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                transition: 'color 220ms ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#FF0066')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--fg)')}
              onFocus={(e) => (e.currentTarget.style.color = '#FF0066')}
              onBlur={(e) => (e.currentTarget.style.color = 'var(--fg)')}
            >
              {t('contact.cta')}
            </a>

            <p
              className="mt-10 font-nav uppercase"
              style={{ color: 'var(--fg-muted)', fontSize: 12, letterSpacing: '0.22em' }}
            >
              {labels.social}
            </p>
            <Social className="mt-5" size={44} gap={16} />
          </div>
        </aside>
      </div>
    </section>
  )
}

function Field({ label, name, type = 'text', textarea, rows = 4, required, autoComplete, maxLength, ...rest }) {
  return (
    <label className="mt-6 block">
      <span
        className="mb-2 block font-nav uppercase"
        style={{ color: 'var(--fg-muted)', fontSize: 12, letterSpacing: '0.22em' }}
      >
        {label}
      </span>
      {textarea ? (
        <textarea
          name={name}
          required={required}
          rows={rows}
          maxLength={maxLength}
          autoComplete={autoComplete}
          spellCheck="true"
          className="w-full font-body"
          style={fieldStyle}
          onFocus={(e) => (e.currentTarget.style.borderBottomColor = '#FF0066')}
          onBlur={(e) => (e.currentTarget.style.borderBottomColor = 'var(--fg)')}
          {...rest}
        />
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          maxLength={maxLength}
          autoComplete={autoComplete}
          spellCheck={type === 'email' ? 'false' : 'true'}
          className="w-full font-body"
          style={fieldStyle}
          onFocus={(e) => (e.currentTarget.style.borderBottomColor = '#FF0066')}
          onBlur={(e) => (e.currentTarget.style.borderBottomColor = 'var(--fg)')}
          {...rest}
        />
      )}
    </label>
  )
}

const fieldStyle = {
  background: 'transparent',
  color: 'var(--fg)',
  border: '1px solid color-mix(in srgb, var(--fg) 25%, transparent)',
  borderBottom: '2px solid var(--fg)',
  padding: '14px 16px',
  fontSize: 16,
  lineHeight: 1.5,
  outline: 'none',
  resize: 'vertical',
}
