export default function HexBadge({ label, icon }) {
  return (
    <div className="group relative flex items-center justify-center">
      <svg viewBox="0 0 100 115" className="h-[140px] w-auto drop-shadow-sm">
        <polygon
          points="50,2 96,27 96,87 50,112 4,87 4,27"
          fill="var(--white-light)"
          stroke="var(--gray-dark)"
          strokeWidth="2"
          className="transition-colors duration-300 group-hover:fill-[var(--pink)]"
        />
        <foreignObject x="10" y="20" width="80" height="80">
          <div className="flex h-full w-full flex-col items-center justify-center text-center">
            {icon && <div className="mb-1 text-2xl">{icon}</div>}
            <span className="font-display text-[12px] font-bold leading-tight text-black group-hover:text-white-light">
              {label}
            </span>
          </div>
        </foreignObject>
      </svg>
    </div>
  )
}
