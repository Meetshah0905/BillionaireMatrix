import { Task } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Trash2, Edit2 } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { EditTaskDialog } from "./EditTaskDialog";

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const { deleteTask } = useStore();
  const [isEditing, setIsEditing] = useState(false);

  // Calculations for confidence warning
  const isLowConfidence = task.source === "suggested" && task.suggestion && task.suggestion.confidence < 55;

  return (
    <>
        <div 
            className="group relative flex items-center justify-between gap-3 p-3 mb-2 rounded-[var(--radius-sm)] bg-[var(--panel-2)] border border-[var(--border)] hover:border-[var(--border-2)] hover:bg-[var(--bg)] transition-all duration-200"
        >
            {/* Left: Content */}
            <div className="flex flex-col min-w-0 flex-1 cursor-pointer" onClick={() => setIsEditing(true)}>
                <div className="flex items-center gap-2">
                    <span className="font-medium text-[var(--text)] truncate">{task.title}</span>
                    {isLowConfidence && (
                        <span className="text-[10px] text-[var(--bad)] bg-[var(--bad)]/10 px-1.5 py-0.5 rounded border border-[var(--bad)]/20">
                            Low Confidence
                        </span>
                    )}
                </div>
                
                <div className="flex items-center gap-2 mt-1.5">
                    {/* Badges */}
                    <EnergyBadge value={task.energySide} />
                    <MoneyBadge value={task.moneySide} />
                    
                    {/* Confidence / Source */}
                    <div className="ml-auto mr-2 text-[10px] text-[var(--muted)] font-mono">
                        {task.source === "learned" ? (
                            <span className="text-[var(--accent)]">LEARNED</span>
                        ) : task.source === "manual" ? (
                            <span>MANUAL</span>
                        ) : (
                            <span>{task.suggestion?.confidence}% CONF</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Right: Actions (Visible on hover or focus) */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 top-1/2 -translate-y-1/2 bg-[var(--panel-2)] shadow-[-10px_0_20px_var(--panel-2)] pl-2">
                <button 
                    onClick={() => setIsEditing(true)}
                    className="p-1.5 text-[var(--muted)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 rounded transition-colors"
                    title="Edit"
                >
                    <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button 
                    onClick={() => deleteTask(task.id)}
                    className="p-1.5 text-[var(--muted)] hover:text-[var(--danger)] hover:bg-[var(--danger)]/10 rounded transition-colors"
                    title="Delete"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>

        <EditTaskDialog 
            task={task} 
            open={isEditing} 
            onOpenChange={setIsEditing} 
        />
    </>
  );
}

function EnergyBadge({ value }: { value: "gives" | "takes" }) {
    const isGood = value === "gives";
    return (
        <span className={cn(
            "text-[9px] px-1.5 py-0.5 rounded-[4px] uppercase tracking-wider font-bold border",
            isGood 
                ? "text-[var(--good)] bg-[var(--good)]/5 border-[var(--good)]/20" 
                : "text-[var(--bad)] bg-[var(--bad)]/5 border-[var(--bad)]/20"
        )}>
            {isGood ? "+ Energy" : "- Energy"}
        </span>
    );
}

function MoneyBadge({ value }: { value: "makes" | "takes" }) {
    const isGood = value === "makes";
    return (
        <span className={cn(
            "text-[9px] px-1.5 py-0.5 rounded-[4px] uppercase tracking-wider font-bold border",
            isGood 
                ? "text-[var(--good)] bg-[var(--good)]/5 border-[var(--good)]/20" 
                : "text-[var(--bad)] bg-[var(--bad)]/5 border-[var(--bad)]/20"
        )}>
            {isGood ? "+ Money" : "- Money"}
        </span>
    );
}
