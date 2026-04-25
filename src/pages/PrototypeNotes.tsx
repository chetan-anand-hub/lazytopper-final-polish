import { ContextBar } from "@/components/ContextBar";

export default function PrototypeNotes() {
  return (
    <div className="space-y-5">
      <ContextBar title="Prototype notes" subtitle="Implementation handoff for the production engineering team. Hidden from student-facing UI." compact />
      <article className="lt-card p-6 prose prose-sm max-w-none text-sm space-y-5 text-foreground/90">
        <section>
          <h3 className="font-display text-lg font-semibold">Memory persistence (prototype → production)</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Prototype: localStorage keys <code>lazytopper.memory.v1</code> (snapshot on signOut) and <code>lazytopper.active.v1</code> (live trial state).</li>
            <li>Persisted fields: auth, lastRoute, subject, stream, topicSlug, selectedTopicSlugs, paperScope, mode, mistakeAwareEnabled, lastAttempt, mistakeInsight, attemptHistory.</li>
            <li>Production mapping: auth provider session + user_profile + saved_attempts table + last_session row keyed by user_id.</li>
            <li>Logout flow: snapshot → memory store → clear active session → navigate to public landing.</li>
            <li>Login flow: hydrate snapshot, send user to <code>redirect</code> param or <code>memory.lastRoute</code>.</li>
          </ul>
        </section>

        <section>
          <h3 className="font-display text-lg font-semibold">Global context fields</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>classLevel: 10 · subject: Maths | Science · stream: All | Physics | Chemistry | Biology</li>
            <li>topicSlug, selectedTopicSlugs, paperScope: topic | multi-topic | full-subject</li>
            <li>mode: worksheet | practice-set | predicted | timed | chapter-test | full-mock | practice-paper | check-answer</li>
            <li>auth: logged-out | trial-active</li>
            <li>lastAttempt, mistakeInsight, mistakeAwareEnabled, attemptHistory, lastRoute</li>
          </ul>
        </section>

        <section>
          <h3 className="font-display text-lg font-semibold">Me / Progress dashboard charts</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Score trend line — input: attemptHistory ordered by date.</li>
            <li>Subject performance bar — group by subject (and optional stream for Science).</li>
            <li>Mistake mix donut — count by mistakeType (conceptual/calculation/silly/presentation).</li>
            <li>Marks lost by topic — sum(outOf - score) grouped by topicName.</li>
            <li>Recent attempt timeline — last N attempts as cards.</li>
            <li>Production source: saved_attempts + mistake_log tables; charts via Recharts.</li>
          </ul>
        </section>

        <section>
          <h3 className="font-display text-lg font-semibold">Redirect / login contract</h3>
          <ul className="list-disc pl-5 space-y-1 break-all">
            <li>/app/login?reason=&lt;reason&gt;&amp;redirect=&lt;encodedFullPathWithQuery&gt;</li>
            <li>Always carry full context in redirect: subject, stream, scope, topic/topics, mode, mistake.</li>
            <li>All gated CTAs use buildLoginPath; navigation uses react-router navigate() (no full reloads).</li>
          </ul>
        </section>

        <section>
          <h3 className="font-display text-lg font-semibold">Engine mapping (server-side, never shown to students)</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Full mock / chapter test / timed → MockEngine + ExamSimulationEngine, filter by paperScope/subject/stream/topics.</li>
            <li>Predicted Questions → HighlyProbableQuestionsService.</li>
            <li>Worksheet → WorksheetGenerator + PDFExporter, sections A–E, mistakeAware flag.</li>
            <li>Mistake-aware → MistakeInsightsService → PracticePage filters.</li>
            <li>Check &amp; Improve → SolutionChecker + MistakeLogService → updates lastAttempt &amp; mistakeInsight.</li>
            <li>Me / Progress → MistakeInsightsService + saved attempts store.</li>
          </ul>
        </section>

        <section>
          <h3 className="font-display text-lg font-semibold">Student-facing copy rules</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>No engine/service names in student UI. No "production-only" or "prototype" markers.</li>
            <li>Prefer: "Saved to your history", "Sample preview", "Recommended, not required".</li>
            <li>PrototypeNotes route is intentionally not in primary sidebar nav.</li>
          </ul>
        </section>
      </article>
    </div>
  );
}
