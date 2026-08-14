import { IconAlertCircle, IconCheck, IconLoader2 } from "@tabler/icons-react";
import type { PropsWithChildren } from "react";

import { Button } from "@/components/atoms/Button";
import { en } from "@/data/locale/en";
import type { EditorSaveState } from "@/stores/useEditorStore";

type SaveIndicatorProps = PropsWithChildren<{
  lastSavedAt: string | null;
  onReload?: () => void;
  onRetry?: () => void;
  saveState: EditorSaveState;
}>;

const saveLabels: Record<EditorSaveState, string> = en.editor.save;

export const SaveIndicator = ({
  lastSavedAt,
  onReload,
  onRetry,
  saveState,
}: SaveIndicatorProps) => {
  const isProblem = saveState === "failed" || saveState === "conflict";
  const Icon = saveState === "saving" ? IconLoader2 : isProblem ? IconAlertCircle : IconCheck;

  return (
    <div className="flex flex-wrap items-center justify-end gap-2 text-xs text-muted" role="status">
      <Icon
        aria-hidden="true"
        className={saveState === "saving" ? "animate-spin" : ""}
        size={16}
        stroke={2}
      />
      <span>{saveLabels[saveState]}</span>
      {saveState === "clean" && lastSavedAt ? (
        <time dateTime={lastSavedAt}>
          {new Date(lastSavedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </time>
      ) : null}
      {saveState === "failed" && onRetry ? (
        <Button className="min-h-8 px-2.5 py-1 text-xs" onClick={onRetry} variant="secondary">
          {en.editor.save.retry}
        </Button>
      ) : null}
      {saveState === "conflict" && onReload ? (
        <Button className="min-h-8 px-2.5 py-1 text-xs" onClick={onReload} variant="secondary">
          {en.editor.save.reload}
        </Button>
      ) : null}
    </div>
  );
};
