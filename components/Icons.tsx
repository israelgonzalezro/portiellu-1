type IconProps = { name: string; size?: number };

const paths: Record<string, React.ReactNode> = {
  mountain: (
    <>
      <path d="M3 20 10 7l4 7 2-3 5 9Z" />
      <path d="m8.5 10 1.5 1.5 1.5-1.5" />
    </>
  ),
  church: (
    <>
      <path d="M12 2v4M10 4h4" />
      <path d="M6 21V11l6-5 6 5v10" />
      <path d="M10 21v-4a2 2 0 0 1 4 0v4M3 21h18" />
    </>
  ),
  parking: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="3" />
      <path d="M10 17V8h3a2.5 2.5 0 0 1 0 5h-3" />
    </>
  ),
  wifi: (
    <>
      <path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.5 16a5 5 0 0 1 7 0" />
      <circle cx="12" cy="19" r="1" />
    </>
  ),
  linen: (
    <>
      <path d="M4 6h16v13H4z" />
      <path d="M4 10h16M9 6V4h6v2" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="15" r="4" />
      <path d="m11 12 9-9M17 6l2 2M15 8l2 2" />
    </>
  ),
  bridge: (
    <>
      <path d="M2 18h20M4 18v-3a8 8 0 0 1 16 0v3" />
      <path d="M12 7V4M2 11l2 1M22 11l-2 1" />
    </>
  ),
  lake: (
    <>
      <path d="m3 13 5-8 3 5 2-3 4 6" />
      <path d="M2 17c2 0 2-1 4-1s2 1 4 1 2-1 4-1 2 1 4 1 2-1 4-1M2 21c2 0 2-1 4-1s2 1 4 1 2-1 4-1 2 1 4 1 2-1 4-1" />
    </>
  ),
  boat: (
    <>
      <path d="M3 15h18l-3 4H6Z" />
      <path d="m8 15 4-10 4 10M12 5v10" />
    </>
  ),
  wave: (
    <>
      <path d="M2 12c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2M2 17c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2" />
      <circle cx="17" cy="5" r="2" />
    </>
  ),
  hike: (
    <>
      <circle cx="13" cy="4" r="2" />
      <path d="m9 21 2-6 3 2v4M11 15l1-6 4 3 3 1M12 9l-4 2-1 4M18 11v10" />
    </>
  ),
  phone: (
    <path d="M5 3h3l2 5-2.5 1.5a11 11 0 0 0 5 5L14 12l5 2v3a2 2 0 0 1-2 2A15 15 0 0 1 3 5a2 2 0 0 1 2-2Z" />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12Z" />
      <circle cx="12" cy="9" r="2.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </>
  ),
  camera: (
    <>
      <path d="M4 8h3l2-3h6l2 3h3v11H4Z" />
      <circle cx="12" cy="13" r="3.5" />
    </>
  ),
  check: <path d="m5 12 5 5 9-10" />
};

export default function Icon({ name, size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] ?? paths.check}
    </svg>
  );
}

// Logo provisional: silueta de hórreo (tejado a cuatro aguas sobre pegollos).
export function HorreoMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path d="M24 5 4 19h40Z" fill="currentColor" />
      <rect x="10" y="20" width="28" height="11" rx="1" fill="none" stroke="currentColor" strokeWidth="2.4" />
      <path d="M17 20v11M24 20v11M31 20v11" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 32h32" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M13 33l1.5 9M35 33l-1.5 9M21 33l.6 9M27 33l-.6 9" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M11 43h6M19 43h6M25 43h6M31 43h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
