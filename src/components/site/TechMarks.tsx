/* ------------------------------------------------------------------ *
 * The toolkit, drawn.
 *
 * Every mark is inline SVG in the vendor's own colours rather than a
 * logo file: nothing here depends on a remote asset or a CDN, and the
 * set stays sharp at any size. They are approximations of the official
 * marks, not the marks themselves.
 * ------------------------------------------------------------------ */

export function ReactMark() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="2" fill="#61dafb" />
      <g fill="none" stroke="#61dafb" strokeWidth="1.1">
        <ellipse cx="12" cy="12" rx="9.5" ry="3.7" />
        <ellipse
          cx="12"
          cy="12"
          rx="9.5"
          ry="3.7"
          transform="rotate(60 12 12)"
        />
        <ellipse
          cx="12"
          cy="12"
          rx="9.5"
          ry="3.7"
          transform="rotate(120 12 12)"
        />
      </g>
    </svg>
  )
}

export function NextMark() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="10.5" fill="#101014" />
      <path
        d="M8.6 16.5V7.6h1.5l6 8.2"
        fill="none"
        stroke="#fff"
        strokeWidth="1.5"
      />
      <path d="M15.1 7.6h1.4v6.2" fill="none" stroke="#fff" strokeWidth="1.5" />
    </svg>
  )
}

export function FlutterMark() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden>
      <path d="M14.6 2 4.4 12.2l3.1 3.1L20.8 2z" fill="#47c5fb" />
      <path d="M14.5 11.2 9 16.7l3.2 3.2 3-3 5.6-5.7z" fill="#42a5f5" />
      <path d="m9 16.7 3.2 3.2-1 1-3.2-3.2z" fill="#0d5cb6" opacity="0.6" />
    </svg>
  )
}

export function NodeMark() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 2.2 21 7.4v9.2L12 21.8 3 16.6V7.4z" fill="#5fa04e" />
      <path
        d="M12 15.8c-1.9 0-2.6-.9-2.6-1.9h1.3c0 .5.2.8 1.3.8.9 0 1.2-.2 1.2-.7 0-.4-.2-.6-1.5-.7-1.6-.2-2.3-.6-2.3-1.8 0-1.1.9-1.7 2.4-1.7 1.7 0 2.4.6 2.5 1.9h-1.3c-.1-.6-.4-.8-1.2-.8-.9 0-1.1.3-1.1.6 0 .4.2.5 1.5.7 1.6.2 2.3.6 2.3 1.8 0 1.1-.9 1.8-2.5 1.8Z"
        fill="#fff"
      />
    </svg>
  )
}

export function PythonMark() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M11.9 2c-2.6 0-4.4.9-4.4 3v2.3h4.5v.8H5.6C3.5 8.1 2 9.4 2 12s1.4 3.9 3.5 3.9h1.6v-2.4c0-2 1.6-3.6 3.6-3.6h3.7c1.7 0 3-1.4 3-3.1V5C17.4 3 15.6 2 12.9 2Zm-2.4 1.6a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8Z"
        fill="#3572a5"
      />
      <path
        d="M12.1 22c2.6 0 4.4-.9 4.4-3v-2.3H12v-.8h6.4c2.1 0 3.6-1.3 3.6-3.9s-1.4-3.9-3.5-3.9h-1.6v2.4c0 2-1.6 3.6-3.6 3.6H9.6c-1.7 0-3 1.4-3 3.1V19c0 2 1.8 3 4.5 3Zm2.4-1.6a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8Z"
        fill="#ffd845"
      />
    </svg>
  )
}

export function AwsMark() {
  return (
    <svg width="34" height="22" viewBox="0 0 48 30" aria-hidden>
      <text
        x="24"
        y="15"
        textAnchor="middle"
        fontSize="13"
        fontWeight="700"
        fill="#232f3e"
        fontFamily="Arial, Helvetica, sans-serif"
      >
        aws
      </text>
      <path
        d="M8 22c8 5 24 5 32 0"
        fill="none"
        stroke="#ff9900"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path d="M39 19.5 41.5 22 39 24.5" fill="#ff9900" />
    </svg>
  )
}

export function FirebaseMark() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden>
      <path d="m4 18 3-14 3 5.5z" fill="#ffa000" />
      <path d="m4 18 8.5-14.6L15 8z" fill="#ffca28" />
      <path d="M4 18 14 6l6 12-8 3.5z" fill="#ffa000" opacity="0.85" />
      <path d="m4 18 8 3.5 8-3.5-2.4-8.6z" fill="#f57c00" />
    </svg>
  )
}

export function MongoMark() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M12 2c2.6 3 5 5.7 5 9.4 0 3.6-2.2 6.2-4.4 7.3l-.6 3.3-.6-3.3C9.2 17.6 7 15 7 11.4 7 7.7 9.4 5 12 2Z"
        fill="#00ed64"
      />
      <path
        d="M12 2c2.6 3 5 5.7 5 9.4 0 3.6-2.2 6.2-4.4 7.3L12 2Z"
        fill="#00684a"
      />
    </svg>
  )
}

export const TECH = [
  { mark: <ReactMark />, name: 'React' },
  { mark: <NextMark />, name: 'Next.js' },
  { mark: <FlutterMark />, name: 'Flutter' },
  { mark: <NodeMark />, name: 'Node.js' },
  { mark: <PythonMark />, name: 'Python' },
  { mark: <AwsMark />, name: 'AWS' },
  { mark: <FirebaseMark />, name: 'Firebase' },
  { mark: <MongoMark />, name: 'MongoDB' },
] as const
