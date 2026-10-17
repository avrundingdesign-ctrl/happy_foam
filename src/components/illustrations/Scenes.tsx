/** Flache Szenen-Illustrationen für „Kennst du das?“ */

const INK = "#0F1B2D";

function Head({
  x,
  y,
  look = 0,
  color = "#FFD84D",
}: {
  x: number;
  y: number;
  look?: number;
  color?: string;
}) {
  return (
    <g>
      <circle cx={x} cy={y} r="13" fill={color} stroke={INK} strokeWidth="3" />
      <circle cx={x - 4 + look * 3} cy={y - 1} r="2" fill={INK} />
      <circle cx={x + 4 + look * 3} cy={y - 1} r="2" fill={INK} />
      <path
        d={`M${x - 4} ${y + 6} q4 4 8 0`}
        fill="none"
        stroke={INK}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </g>
  );
}

function WcDoor({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y} width="56" height="96" rx="4" fill="#FFFFFF" stroke={INK} strokeWidth="3" />
      <circle cx={x + 46} cy={y + 52} r="3" fill={INK} />
      <rect
        x={x + 14}
        y={y + 12}
        width="28"
        height="16"
        rx="4"
        fill="#BFE6FF"
        stroke={INK}
        strokeWidth="2"
      />
      <text
        x={x + 28}
        y={y + 24.5}
        textAnchor="middle"
        fontSize="11"
        fontWeight="800"
        fontFamily="var(--font-display), sans-serif"
        fill={INK}
      >
        WC
      </text>
    </g>
  );
}

function Waves({ x, y, color = "#FF8FB1" }: { x: number; y: number; color?: string }) {
  return (
    <g fill="none" stroke={color} strokeWidth="4" strokeLinecap="round">
      <path d={`M${x} ${y - 10} q8 10 0 20`} />
      <path d={`M${x + 10} ${y - 18} q14 18 0 36`} />
      <path d={`M${x + 20} ${y - 26} q20 26 0 52`} />
    </g>
  );
}

export function SceneOffice({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 200" className={className} aria-hidden="true">
      <rect x="0" y="150" width="320" height="50" fill="#BFE6FF" />
      <WcDoor x={240} y={56} />
      <Waves x={210} y={100} />
      {[30, 110].map((x, i) => (
        <g key={x}>
          <rect x={x} y="104" width="70" height="8" rx="3" fill={INK} />
          <rect x={x + 6} y="112" width="5" height="40" fill={INK} />
          <rect x={x + 59} y="112" width="5" height="40" fill={INK} />
          <rect
            x={x + 18}
            y="72"
            width="40"
            height="28"
            rx="4"
            fill="#FFFFFF"
            stroke={INK}
            strokeWidth="3"
          />
          <rect x={x + 34} y="100" width="8" height="5" fill={INK} />
          <Head x={x + 38} y={52 + (i ? 4 : 0)} look={1} color={i ? "#FF8FB1" : "#FFD84D"} />
        </g>
      ))}
      <text
        x="18"
        y="30"
        fontSize="13"
        fontWeight="700"
        fontFamily="var(--font-sans), sans-serif"
        fill="#5B6B80"
      >
        …tipp… tipp…
      </text>
    </svg>
  );
}

export function SceneDate({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 200" className={className} aria-hidden="true">
      <rect x="0" y="150" width="320" height="50" fill="#FFD9E5" />
      {/* dünne Wand */}
      <rect x="196" y="30" width="6" height="120" fill={INK} />
      <WcDoor x={214} y={56} />
      <Waves x={186} y={92} />
      {/* Sofa */}
      <rect
        x="28"
        y="104"
        width="140"
        height="40"
        rx="14"
        fill="#3DDCB4"
        stroke={INK}
        strokeWidth="3"
      />
      <rect
        x="20"
        y="92"
        width="22"
        height="56"
        rx="10"
        fill="#3DDCB4"
        stroke={INK}
        strokeWidth="3"
      />
      <rect
        x="154"
        y="92"
        width="22"
        height="56"
        rx="10"
        fill="#3DDCB4"
        stroke={INK}
        strokeWidth="3"
      />
      <Head x={92} y={84} look={1} color="#FFD84D" />
      {/* Herz */}
      <path
        d="M92 40 c-6 -10 -20 -4 -14 6 l14 14 l14 -14 c6 -10 -8 -16 -14 -6 z"
        fill="#FF8FB1"
        stroke={INK}
        strokeWidth="2.5"
      />
      {/* Weinglas */}
      <path
        d="M128 82 h14 l-2 12 a5 5 0 0 1 -10 0 z M135 99 v10 M129 109 h12"
        fill="none"
        stroke={INK}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SceneTrain({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 200" className={className} aria-hidden="true">
      <rect
        x="0"
        y="20"
        width="320"
        height="140"
        rx="20"
        fill="#FFFFFF"
        stroke={INK}
        strokeWidth="3"
      />
      {[24, 92, 160].map((x) => (
        <rect
          key={x}
          x={x}
          y="40"
          width="52"
          height="34"
          rx="10"
          fill="#BFE6FF"
          stroke={INK}
          strokeWidth="3"
        />
      ))}
      <WcDoor x={240} y={50} />
      <Waves x={214} y={92} />
      {/* Warteschlange */}
      <Head x={60} y={116} look={1} color="#FF8FB1" />
      <Head x={100} y={112} look={1} color="#FFD84D" />
      <Head x={140} y={118} look={1} color="#3DDCB4" />
      <Head x={180} y={114} look={1} color="#BFE6FF" />
      <rect x="0" y="160" width="320" height="10" fill={INK} />
      <circle cx="60" cy="176" r="12" fill={INK} />
      <circle cx="260" cy="176" r="12" fill={INK} />
    </svg>
  );
}
