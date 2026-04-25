import { Link } from "react-router-dom";
import { useLazyTopper } from "@/context/LazyTopperContext";
import { buildPracticePath, buildWorksheetPath, buildTopicPath, buildLoginPath, buildCheckPath } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { Layers, ClipboardList, Sparkles, Timer, BookOpen } from "lucide-react";
import type { ActionSource } from "@/lib/types";

interface TopicActionsProps {
  topicSlug: string;
  source: ActionSource;
}

export function TopicActions({ topicSlug, source }: TopicActionsProps) {
  const { subject, stream, auth, setActionSource } = useLazyTopper();
  const handle = () => setActionSource(source);

  const gated = (path: string, reason: string) =>
    auth === "trial-active" ? path : buildLoginPath({ reason, redirect: path });

  return (
    <div className="flex flex-wrap gap-2">
      <Button asChild variant="secondary" size="sm" onClick={handle}>
        <Link to={buildTopicPath(topicSlug, source)}>
          <BookOpen className="h-3.5 w-3.5" /> Topic Hub
        </Link>
      </Button>
      <Button asChild variant="default" size="sm" onClick={handle}>
        <Link to={buildPracticePath({ scope: "topic", subject, stream, topic: topicSlug, mode: "practice-set", source })}>
          <Layers className="h-3.5 w-3.5" /> Practice
        </Link>
      </Button>
      <Button asChild variant="secondary" size="sm" onClick={handle}>
        <Link to={buildPracticePath({ scope: "topic", subject, stream, topic: topicSlug, mode: "predicted", source })}>
          <Sparkles className="h-3.5 w-3.5" /> Predicted Qs
        </Link>
      </Button>
      <Button asChild variant="secondary" size="sm" onClick={handle}>
        <Link to={gated(
          buildPracticePath({ scope: "topic", subject, stream, topic: topicSlug, mode: "chapter-test", source }),
          "open-chapter-test"
        )}>
          <Timer className="h-3.5 w-3.5" /> Chapter Test
        </Link>
      </Button>
      <Button asChild variant="secondary" size="sm" onClick={handle}>
        <Link to={buildWorksheetPath({ scope: "topic", subject, stream, topic: topicSlug, source })}>
          <ClipboardList className="h-3.5 w-3.5" /> Worksheet
        </Link>
      </Button>
      <Button asChild variant="ghost" size="sm" onClick={handle}>
        <Link to={gated(buildCheckPath({ topic: topicSlug, source }), "open-check")}>
          Check answers
        </Link>
      </Button>
    </div>
  );
}
