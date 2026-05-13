/** Nine-dot Microsoft 365–style app launcher for the Power Apps shell header */
export default function PowerAppsAppLauncherIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      width={20}
      height={20}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {[0, 1, 2].map((row) =>
        [0, 1, 2].map((col) => (
          <circle
            key={`${row}-${col}`}
            cx={4 + col * 6}
            cy={4 + row * 6}
            r={2}
            fill="currentColor"
          />
        ))
      )}
    </svg>
  );
}
