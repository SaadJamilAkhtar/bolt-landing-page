import { COMPANY } from '../data/site'

/** Bolt-head mark: a hex head stamped with a radial grade marking. Original artwork. */
export function Mark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <polygon points="24,2 43,13 43,35 24,46 5,35 5,13" fill="var(--ink-900)" />
      <polygon points="24,6 39.5,15 39.5,33 24,42 8.5,33 8.5,15" fill="none" stroke="var(--forge-500)" strokeWidth="1.5" />
      <circle cx="24" cy="24" r="10.5" fill="none" stroke="var(--white)" strokeWidth="1.5" />
      <g stroke="var(--forge-500)" strokeWidth="2" strokeLinecap="round">
        <path d="M24 13.5v-0" />
        <path d="M24 24L24 13.5M24 24L33.1 29.25M24 24L14.9 29.25" />
      </g>
      <circle cx="24" cy="24" r="2" fill="var(--white)" />
    </svg>
  )
}

export function Brand() {
  return (
    <span className="brand__lockup">
      <Mark className="brand__mark" />
      <span className="brand__word">
        <span>{COMPANY.lockup[0]}</span>
        <span>{COMPANY.lockup[1]}</span>
      </span>
    </span>
  )
}
