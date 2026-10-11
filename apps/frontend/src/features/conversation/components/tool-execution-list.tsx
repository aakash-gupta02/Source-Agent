import { Check } from "lucide-react";

import type { ToolExecutionMetadata } from "@repo/shared/types";
import { toolLabels } from "../message/constant";

export function ToolExecutionList({
  tools,
}: {
  tools?: ToolExecutionMetadata[];
}) {
  if (!tools?.length) return null;

  return (
    <div className="mb-4 ml-1 space-y-1 text-sm text-muted-foreground">
      {tools.map((tool, index) => {
        const label = toolLabels[tool.name] ?? tool.name;

        return (
          <p key={`${tool.name}-${index}`} className="flex items-center gap-2">
            <Check className="size-3" />

            <span>{label}</span>
          </p>
        );
      })}
    </div>
  );
}
