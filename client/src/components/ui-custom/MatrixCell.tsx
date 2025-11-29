import { Quadrant, Task } from "@/lib/types";
import { TaskItem } from "./TaskItem";
import { cn } from "@/lib/utils";

interface MatrixCellProps {
  quadrant: Quadrant;
  tasks: Task[];
  className?: string;
  sublabel: string;
}

export function MatrixCell({ quadrant, tasks, className, sublabel }: MatrixCellProps) {
  const isEmpty = tasks.length === 0;

  // Example tasks for empty states
  const getExamples = (q: Quadrant) => {
    switch (q) {
        case "PROTECT": return ["Family dinner", "Gym workout", "Reading"];
        case "PRIORITIZE": return ["Sales call", "Launch product", "Client meeting"];
        case "DELETE": return ["Doomscrolling", "Junk food", "Unnecessary meeting"];
        case "DELEGATE": return ["Bookkeeping", "Cleaning", "Data entry"];
        default: return [];
    }
  };

  const examples = getExamples(quadrant);

  return (
    <div className={cn(
        "flex flex-col h-full bg-[var(--panel)] rounded-[var(--radius)] border border-[var(--border)] shadow-[var(--shadow)] overflow-hidden relative group transition-colors hover:border-[var(--border-2)]", 
        className
    )}>
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-[var(--panel)]/95 backdrop-blur-sm px-4 py-3 border-b border-[var(--border)] flex justify-between items-start">
        <div>
            <h3 className="font-bold text-sm tracking-tight text-[var(--text)]">{quadrant}</h3>
            <div className="text-[10px] font-medium text-[var(--muted)] uppercase tracking-wider mt-0.5">
                {sublabel}
            </div>
        </div>
        <span className="text-xs font-mono text-[var(--muted)] bg-[var(--panel-2)] px-2 py-0.5 rounded-full border border-[var(--border)]">
            {tasks.length}
        </span>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 min-h-[200px]">
        {isEmpty ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4 opacity-60">
                <p className="text-xs text-[var(--muted)] mb-3">Drop tasks here by adding above.</p>
                <div className="space-y-2 w-full max-w-[180px]">
                    {examples.map((ex, i) => (
                        <div key={i} className="text-[10px] py-1.5 px-2 rounded border border-dashed border-[var(--border)] text-[var(--faint)] bg-[var(--bg)]/50 select-none">
                            {ex}
                        </div>
                    ))}
                </div>
            </div>
        ) : (
            <div className="flex flex-col">
                {tasks.map(task => (
                    <TaskItem key={task.id} task={task} />
                ))}
            </div>
        )}
      </div>
    </div>
  );
}
