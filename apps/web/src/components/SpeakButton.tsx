import { useCallback, useEffect, useRef, useState } from "react";
import { useI18n, useT } from "../i18n";

/**
 * Reads text aloud with the browser's speech synthesis.
 *
 * German traffic terms inside a sentence are spoken by a German voice, because
 * a Turkish or Arabic voice reading "Vorfahrt gewähren" is unintelligible — and
 * those terms are exactly what the learner must recognise in the exam.
 */
const GERMAN_TERMS = [
  "Vorfahrt gewähren",
  "Vorfahrtstraße",
  "Rechts vor Links",
  "Rettungsgasse",
  "Zusatzzeichen",
  "Gefahrzeichen",
  "Verbotszeichen",
  "Vorschriftzeichen",
  "Richtzeichen",
  "Ortstafel",
  "Grünpfeil",
  "Andreaskreuz",
  "Bahnübergang",
  "Fußgängerüberweg",
  "Schrittgeschwindigkeit",
  "Richtgeschwindigkeit",
  "Reißverschluss",
  "Schulterblick",
  "Haltverbot",
  "Halteverbot",
  "Parkscheibe",
  "Umweltzone",
  "Hauptuntersuchung",
  "Probezeit",
  "Aufbauseminar",
  "Fahrerlaubnis",
  "Kraftfahrstraße",
  "Autobahn",
  "StVO",
  "Grundstoff",
  "Zusatzstoff",
  "bei Nässe",
  "Anlieger frei",
];

interface Segment {
  text: string;
  lang: string;
}

/** Splits text so German terms get a German voice and the rest the user's. */
export function segmentForSpeech(text: string, lang: string): Segment[] {
  if (lang.startsWith("de")) return [{ text, lang }];

  const pattern = new RegExp(
    `(${GERMAN_TERMS.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
    "g",
  );

  return text
    .split(pattern)
    .filter((part) => part.length > 0)
    .map((part) => ({
      text: part,
      lang: GERMAN_TERMS.includes(part) ? "de-DE" : lang,
    }));
}

function supported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export interface SpeakButtonProps {
  /** The text to read. Several strings are read in order. */
  text: string | string[];
  className?: string;
  /** "icon" for a compact round button, "label" for icon plus wording. */
  variant?: "icon" | "label";
}

export default function SpeakButton({
  text,
  className = "",
  variant = "icon",
}: SpeakButtonProps) {
  const { bcp47 } = useI18n();
  const t = useT();
  const [speaking, setSpeaking] = useState(false);
  const activeRef = useRef(false);

  const stop = useCallback(() => {
    if (!supported()) return;
    activeRef.current = false;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  // Navigating away must not leave a voice talking to an empty page.
  useEffect(() => stop, [stop]);

  const speak = useCallback(() => {
    if (!supported()) return;

    if (speaking) {
      stop();
      return;
    }

    const body = Array.isArray(text) ? text.join(". ") : text;
    const segments = segmentForSpeech(body, bcp47);

    window.speechSynthesis.cancel();
    activeRef.current = true;
    setSpeaking(true);

    segments.forEach((segment, i) => {
      const utterance = new SpeechSynthesisUtterance(segment.text);
      utterance.lang = segment.lang;
      utterance.rate = 0.95;

      if (i === segments.length - 1) {
        utterance.onend = () => {
          if (activeRef.current) setSpeaking(false);
        };
        utterance.onerror = () => setSpeaking(false);
      }

      window.speechSynthesis.speak(utterance);
    });
  }, [bcp47, speaking, stop, text]);

  if (!supported()) return null;

  const label = speaking ? t("action.stopListening") : t("action.listen");

  if (variant === "label") {
    return (
      <button
        type="button"
        onClick={speak}
        aria-label={label}
        className={`inline-flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1 text-xs font-medium text-muted transition hover:border-line-strong hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 ${className}`}
      >
        <SpeakerIcon speaking={speaking} />
        {label}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={speak}
      aria-label={label}
      title={label}
      className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-line text-muted transition hover:border-line-strong hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 ${className}`}
    >
      <SpeakerIcon speaking={speaking} />
    </button>
  );
}

function SpeakerIcon({ speaking }: { speaking: boolean }) {
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M11 5 6 9H2v6h4l5 4z" />
      {speaking ? (
        <path d="M17 8l4 8M21 8l-4 8" />
      ) : (
        <>
          <path d="M15.5 8.5a5 5 0 0 1 0 7" />
          <path d="M18.5 5.5a9 9 0 0 1 0 13" />
        </>
      )}
    </svg>
  );
}
