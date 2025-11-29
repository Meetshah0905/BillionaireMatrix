import { Quadrant, Task } from "@/lib/types";
import { TaskItem } from "./TaskItem";
import { cn } from "@/lib/utils";

interface MatrixCellProps {
  quadrant: Quadrant;
  tasks: Task[];
  className?: string;
}

export function MatrixCell({ quadrant, tasks, className }: MatrixCellProps) {
  return (
    <div className={cn("flex flex-col h-full border border-border bg-white rounded-lg overflow-hidden shadow-sm", className)}>
      <div className="bg-muted/50 px-4 py-3 border-b border-border flex justify-between items-center">
        <h3 className="font-semibold text-sm tracking-tight text-foreground">{quadrant}</h3>
        <span className="text-xs text-muted-foreground font-medium bg-white px-2 py-0.5 rounded border border-border/50">
            {tasks.length}
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 min-h-[150px]">
        {tasks.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-muted-foreground/50 italic">
                No tasks
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
