import type { ReactNode } from "react";

/**
 * Renders the restricted markdown lessons are authored in: paragraphs,
 * "- " bullets and **bold**. Deliberately not a full markdown parser — the
 * content is ours, and a parser would be a needless dependency and a wider
 * injection surface.
 */
function inline(text: string, keyPrefix: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`${keyPrefix}-${i}`} className="font-semibold text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={`${keyPrefix}-${i}`}>{part}</span>;
  });
}

export default function LessonBody({ body }: { body: string }) {
  const blocks = body.split("\n\n");

  return (
    <div className="space-y-4">
      {blocks.map((block, bi) => {
        const lines = block.split("\n");

        if (lines.every((l) => l.trimStart().startsWith("- "))) {
          return (
            <ul key={bi} className="space-y-1.5">
              {lines.map((line, li) => (
                <li
                  key={li}
                  className="flex gap-2.5 text-[15px] leading-relaxed text-muted"
                >
                  <span className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-accent" />
                  <span>
                    {inline(line.trimStart().slice(2), `${bi}-${li}`)}
                  </span>
                </li>
              ))}
            </ul>
          );
        }

        if (/^\d+\.\s/.test(lines[0])) {
          return (
            <ol key={bi} className="space-y-1.5">
              {lines.map((line, li) => (
                <li
                  key={li}
                  className="flex gap-2.5 text-[15px] leading-relaxed text-muted"
                >
                  <span className="shrink-0 font-mono text-xs text-faint">
                    {line.slice(0, line.indexOf("."))}.
                  </span>
                  <span>
                    {inline(line.replace(/^\d+\.\s*/, ""), `${bi}-${li}`)}
                  </span>
                </li>
              ))}
            </ol>
          );
        }

        return (
          <p key={bi} className="text-[15px] leading-relaxed text-muted">
            {inline(block, `${bi}`)}
          </p>
        );
      })}
    </div>
  );
}

/** Plain text of a lesson body, for the speech synthesiser. */
export function bodyToSpeech(body: string): string {
  return body
    .replace(/\*\*/g, "")
    .split("\n")
    .map((line) => line.replace(/^\s*[-\d.]+\s*/, ""))
    .join(". ");
}
