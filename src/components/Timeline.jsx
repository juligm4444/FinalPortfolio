import { motion } from 'framer-motion'
import GlassBlock from './GlassBlock.jsx'

/**
 * Brutalist editorial timeline.
 * items: [{ period, title, subtitle?, detail?, role?, company?, bullets? }]
 *
 * `glass` — when true, every step is wrapped in its own translucent panel
 * so each block reads as a separate, easy-to-parse card while the hex bg
 * still bleeds through behind them.
 */
export default function Timeline({ items, glass = false }) {
  return (
    <ol className="relative" style={{ borderLeft: '2px solid var(--fg)' }}>
      {items.map((item, i) => (
        <motion.li
          key={i}
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.06 }}
          className="relative pl-8 pb-8 last:pb-0 md:pl-12"
        >
          {/* Pink slab marker */}
          <span
            aria-hidden
            className="absolute"
            style={{
              left: -8,
              top: glass ? 30 : 6,
              width: 14,
              height: 14,
              background: '#FF0871',
              zIndex: 2,
            }}
          />
          {glass ? (
            <GlassBlock padding="22px 26px">
              <ItemBody item={item} />
            </GlassBlock>
          ) : (
            <ItemBody item={item} />
          )}
        </motion.li>
      ))}
    </ol>
  )
}

function ItemBody({ item }) {
  return (
    <>
      <p
        className="font-nav uppercase"
        style={{
          fontSize: 12,
          letterSpacing: '0.22em',
          color: 'var(--fg-muted)',
        }}
      >
        {item.period}
      </p>
      <h3
        className="mt-2 font-display"
        style={{
          color: 'var(--fg)',
          fontSize: 'clamp(22px, 2.4vw, 30px)',
          lineHeight: 1.15,
          fontWeight: 700,
        }}
      >
        {item.title || item.role}
      </h3>
      {(item.subtitle || item.company) && (
        <p
          className="mt-1 font-body"
          style={{ color: 'var(--fg-soft)', fontSize: 15 }}
        >
          {item.subtitle || item.company}
        </p>
      )}
      {item.detail && (
        <p
          className="mt-3 font-body"
          style={{
            color: 'var(--fg-soft)',
            fontSize: 15,
            lineHeight: 1.65,
            maxWidth: '52ch',
          }}
        >
          {item.detail}
        </p>
      )}
      {item.bullets && (
        <ul className="mt-4 space-y-2">
          {item.bullets.map((b, k) => (
            <li
              key={k}
              className="relative pl-5 font-body"
              style={{
                color: 'var(--fg-soft)',
                fontSize: 15,
                lineHeight: 1.6,
                maxWidth: '60ch',
              }}
            >
              <span
                aria-hidden
                className="absolute"
                style={{
                  left: 0,
                  top: '0.65em',
                  width: 8,
                  height: 2,
                  background: 'var(--fg)',
                }}
              />
              {b}
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
