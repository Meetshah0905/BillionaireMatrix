import { Task } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Trash2, Edit2, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { EditTaskDialog } from "./EditTaskDialog";

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const { deleteTask } = useStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
        <motion.div 
            layout
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className="group border-b border-border/50 last:border-0 py-3 hover:bg-muted/30 transition-colors px-2"
        >
        <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2 flex-1 min-w-0">
                {task.notes && (
                    <button 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="mt-1 text-muted-foreground hover:text-foreground"
                    >
                        {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    </button>
                )}
                <div className="flex flex-col min-w-0 cursor-pointer" onClick={() => setIsEditing(true)}>
                    <span className="text-sm font-medium text-foreground truncate block hover:underline decoration-dotted underline-offset-2">{task.title}</span>
                    <div className="flex gap-2 mt-1">
                        <Badge type="energy" value={task.energySide} />
                        <Badge type="money" value={task.moneySide} />
                        {task.source === "learned" && (
                            <span className="text-[10px] text-blue-600 font-medium px-1 rounded bg-blue-50">Learned</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                    onClick={() => setIsEditing(true)}
                    className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded"
                    title="Edit task"
                >
                    <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button 
                    onClick={() => deleteTask(task.id)}
                    className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded"
                    title="Delete task"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>

        <AnimatePresence>
            {isExpanded && task.notes && (
                <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="pl-5 mt-2 text-xs text-muted-foreground overflow-hidden"
                >
                    {task.notes}
                </motion.div>
            )}
        </AnimatePresence>
        </motion.div>

        <EditTaskDialog 
            task={task} 
            open={isEditing} 
            onOpenChange={setIsEditing} 
        />
    </>
  );
}

function Badge({ type, value }: { type: "energy" | "money"; value: string }) {
    const colorClass = 
        (type === "energy" && value === "gives") ? "text-green-600 bg-green-50" :
        (type === "energy" && value === "takes") ? "text-red-600 bg-red-50" :
        (type === "money" && value === "makes") ? "text-emerald-600 bg-emerald-50" :
        "text-orange-600 bg-orange-50";

    const label = 
        (type === "energy" && value === "gives") ? "+Energy" :
        (type === "energy" && value === "takes") ? "-Energy" :
        (type === "money" && value === "makes") ? "+Money" :
        "-Money";

    return (
        <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-medium uppercase tracking-wider", colorClass)}>
            {label}
        </span>
    );
}
