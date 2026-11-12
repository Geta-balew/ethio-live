/* Decorative, blurred YouTube play-button logos floating in the fixed page background. */
type L = { x: string; y: string; s: number; b: number; o: number; r: number; d: number; m?: boolean };

// x/y = position, s = width px, b = blur px, o = opacity, r = rotation deg, d = float duration s, m = also on mobile
const LOGOS: L[] = [
  { x: "3%", y: "13%", s: 120, b: 5, o: 0.26, r: -12, d: 11, m: true },
  { x: "90%", y: "18%", s: 64, b: 1.5, o: 0.22, r: 10, d: 9, m: true },
  { x: "88%", y: "36%", s: 250, b: 18, o: 0.2, r: -8, d: 14, m: true },
  { x: "-5%", y: "57%", s: 210, b: 14, o: 0.16, r: 14, d: 13, m: true },
  { x: "9%", y: "84%", s: 78, b: 2.5, o: 0.2, r: 8, d: 10 },
  { x: "80%", y: "76%", s: 120, b: 7, o: 0.2, r: -14, d: 12, m: true },
  { x: "22%", y: "38%", s: 46, b: 3, o: 0.14, r: 18, d: 8 },
  { x: "70%", y: "58%", s: 40, b: 2, o: 0.14, r: -20, d: 9 },
  { x: "44%", y: "44%", s: 420, b: 60, o: 0.1, r: 0, d: 16 },
];

const Yt = () => (
  <svg viewBox="0 0 28 20" aria-hidden="true">
    <path fill="#ff0033" d="M27.4 3.1A3.5 3.5 0 0 0 24.9.6C22.7 0 14 0 14 0S5.3 0 3.1.6A3.5 3.5 0 0 0 .6 3.1C0 5.3 0 10 0 10s0 4.7.6 6.9a3.5 3.5 0 0 0 2.5 2.5C5.3 20 14 20 14 20s8.7 0 10.9-.6a3.5 3.5 0 0 0 2.5-2.5C28 14.7 28 10 28 10s0-4.7-.6-6.9z" />
    <path fill="#fff" d="M11.2 14.3 18.4 10l-7.2-4.3z" />
  </svg>
);

export default function BgLogos() {
  return (
    <div className="bg-logos">
      {LOGOS.map((l, i) => (
        <span
          key={i}
          className={l.m ? "m" : undefined}
          style={{ left: l.x, top: l.y, width: l.s, filter: `blur(${l.b}px)`, opacity: l.o, ["--r" as string]: `${l.r}deg`, animationDuration: `${l.d}s`, animationDelay: `-${i * 1.7}s` }}
        >
          <Yt />
        </span>
      ))}
    </div>
  );
}
