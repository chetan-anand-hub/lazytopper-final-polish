import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useLazyTopper } from "@/context/LazyTopperContext";
import { topicBySlug } from "@/lib/topics";
import { getTopicSample } from "@/lib/topicContent";
import { ContextBar } from "@/components/ContextBar";
import { TopicActions } from "@/components/TopicActions";
import { MistakeIntelligencePanel } from "@/components/MistakeIntelligencePanel";
import { Button } from "@/components/ui/button";
import { Plus, Check } from "lucide-react";

export default function TopicHubPage() {
  const { slug } = useParams();
  const { setTopicSlug, setSubject, setStream, selectedTopicSlugs, toggleSelectedTopic, mistakeInsight, setActionSource } = useLazyTopper();
  const topic = topicBySlug(slug);

  useEffect(() => {
    if (topic) {
      setSubject(topic.subject);
      if (topic.subject === "Science") setStream(topic.stream);
      setTopicSlug(topic.slug);
      setActionSource("topicHub");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (!topic) {
    return (
      <div className="space-y-4">
        <ContextBar title="Topic not found" compact />
        <Button asChild><Link to="/app/trends">Back to Exam Trends</Link></Button>
      </div>
    );
  }

  const sample = getTopicSample(topic.slug);
  const inTray = selectedTopicSlugs.includes(topic.slug);
  const isMistakeTopic = mistakeInsight?.topicSlug === topic.slug;

  return (
    <div className="space-y-5">
      <ContextBar
        title={topic.name}
        subtitle={topic.blurb}
        compact
        right={
          <Button size="sm" variant={inTray ? "secondary" : "default"} onClick={() => toggleSelectedTopic(topic.slug)}>
            {inTray ? <><Check className="h-3.5 w-3.5" /> In selection</> : <><Plus className="h-3.5 w-3.5" /> Add to selection</>}
          </Button>
        }
      />

      <section className="lt-card p-5 space-y-3">
        <h3 className="lt-section-title text-lg">Actions for this topic</h3>
        <TopicActions topicSlug={topic.slug} source="topicHub" />
      </section>

      {isMistakeTopic && (
        <section className="lt-card-elevated p-5 border-accent/40">
          <div className="text-xs uppercase tracking-wider text-accent-soft-foreground mb-1">This matches your latest weak area</div>
          <MistakeIntelligencePanel source="topicHub" bare />
        </section>
      )}

      <div className="grid lg:grid-cols-3 gap-5">
        <section className="lt-card p-5 lg:col-span-2 space-y-4">
          <h3 className="lt-section-title text-lg">Highly Probable Questions</h3>
          <ul className="text-sm space-y-2 list-disc pl-5">
            {sample.hpqs.map((q, i) => <li key={i}>{q}</li>)}
          </ul>
          <h3 className="lt-section-title text-lg pt-2">Sample preview</h3>
          <ul className="text-sm space-y-2">
            {sample.examples.map((e, i) => (
              <li key={i} className="flex gap-3">
                <span className="lt-chip shrink-0">{e.type} · {e.marks}m</span>
                <span className="text-foreground/85">{e.q}</span>
              </li>
            ))}
          </ul>
        </section>

        <aside className="space-y-5">
          <section className="lt-card p-5">
            <h3 className="font-display text-base font-semibold mb-2">Common pitfalls</h3>
            <ul className="text-sm space-y-1 list-disc pl-5 text-foreground/85">
              {sample.pitfalls.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          </section>
          <section className="lt-card p-5">
            <h3 className="font-display text-base font-semibold mb-2">High-ROI revision</h3>
            <div className="flex flex-wrap gap-1.5">
              {sample.highROI.map((h) => <span key={h} className="lt-chip-accent">{h}</span>)}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
