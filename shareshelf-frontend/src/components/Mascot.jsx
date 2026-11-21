// "Shelfy", the ShareShelf mascot: an original little book character drawn in SVG.
export default function Mascot({ size = 120, mood = "happy", className = "" }) {
  const cheer = mood === "cheer";

  return (
    <svg
      className={`mascot ${className}`}
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role="img"
      aria-label="Shelfy, the ShareShelf book mascot"
    >
      <ellipse cx="60" cy="113" rx="30" ry="5" fill="rgba(0,0,0,0.15)" />

      {/* legs */}
      <rect x="42" y="92" width="11" height="17" rx="5.5" fill="#4a35c9" />
      <rect x="67" y="92" width="11" height="17" rx="5.5" fill="#4a35c9" />

      {/* book body: cover, pages, spine, bookmark */}
      <rect x="20" y="12" width="80" height="84" rx="16" fill="#6d55f5" />
      <rect x="30" y="18" width="64" height="72" rx="11" fill="#fff6e5" />
      <rect x="20" y="12" width="14" height="84" rx="7" fill="#4a35c9" />
      <path d="M78 10 v24 l7 -6 l7 6 v-24 z" fill="#ff4fa3" />

      {/* face */}
      <circle cx="52" cy="54" r="8" fill="#2b2350" />
      <circle cx="78" cy="54" r="8" fill="#2b2350" />
      <circle cx="55" cy="51" r="3" fill="#fff" />
      <circle cx="81" cy="51" r="3" fill="#fff" />
      <ellipse cx="44" cy="68" rx="6" ry="3.5" fill="#ffb3d1" />
      <ellipse cx="86" cy="68" rx="6" ry="3.5" fill="#ffb3d1" />
      {cheer ? (
        <path d="M56 68 Q65 88 74 68 Z" fill="#c2255c" />
      ) : (
        <path d="M56 69 Q65 78 74 69" stroke="#2b2350" strokeWidth="3" fill="none" strokeLinecap="round" />
      )}

      {/* hands */}
      <circle cx="14" cy={cheer ? 38 : 70} r="7" fill="#6d55f5" />
      <circle cx="106" cy={cheer ? 38 : 70} r="7" fill="#6d55f5" />

      {/* sparkles when cheering */}
      {cheer && (
        <>
          <path d="M8 12 l3 6 6 3 -6 3 -3 6 -3 -6 -6 -3 6 -3z" fill="#ffd43b" />
          <path d="M108 16 l2.5 5 5 2.5 -5 2.5 -2.5 5 -2.5 -5 -5 -2.5 5 -2.5z" fill="#ffd43b" />
        </>
      )}
    </svg>
  );
}
