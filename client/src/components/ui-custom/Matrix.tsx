import { useStore } from "@/lib/store";
import { MatrixCell } from "./MatrixCell";
import { Task } from "@/lib/types";

export function Matrix() {
  const { tasks, filters, searchQuery } = useStore();

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    // Search
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
    }

    // Filters
    if (filters.energy !== "ALL" && task.energySide !== filters.energy) return false;
    if (filters.money !== "ALL" && task.moneySide !== filters.money) return false;

    return true;
  });

  // Group by quadrant
  const protectTasks = filteredTasks.filter(t => t.energySide === "gives" && t.moneySide === "takes");
  const prioritizeTasks = filteredTasks.filter(t => t.energySide === "gives" && t.moneySide === "makes");
  const deleteTasks = filteredTasks.filter(t => t.energySide === "takes" && t.moneySide === "takes");
  const delegateTasks = filteredTasks.filter(t => t.energySide === "takes" && t.moneySide === "makes");

  return (
    <div className="w-full">
        {/* Desktop Axis Labels */}
        <div className="hidden md:grid grid-cols-[40px_1fr_1fr] gap-6 mb-4">
            <div></div> {/* Corner spacer */}
            <div className="text-center text-xs font-bold text-[var(--muted)] uppercase tracking-[0.2em]">
                Takes Money (-$)
            </div>
            <div className="text-center text-xs font-bold text-[var(--muted)] uppercase tracking-[0.2em]">
                Makes Money (+$)
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[40px_1fr_1fr] gap-6 w-full">
            
            {/* Row 1: Gives Energy */}
            <div className="hidden md:flex items-center justify-center h-full">
                <div className="text-xs font-bold text-[var(--muted)] uppercase tracking-[0.2em] -rotate-90 w-[200px] text-center whitespace-nowrap">
                    Gives Energy (+E)
                </div>
            </div>

            <div className="space-y-1 h-full">
                 <MatrixCell 
                    quadrant="PROTECT" 
                    sublabel="+Energy / -Money"
                    tasks={protectTasks} 
                    className="h-[300px] md:h-[420px]" 
                 />
            </div>
            <div className="space-y-1 h-full">
                <MatrixCell 
                    quadrant="PRIORITIZE" 
                    sublabel="+Energy / +Money"
                    tasks={prioritizeTasks} 
                    className="h-[300px] md:h-[420px]" 
                />
            </div>

            {/* Row 2: Takes Energy */}
            <div className="hidden md:flex items-center justify-center h-full">
                <div className="text-xs font-bold text-[var(--muted)] uppercase tracking-[0.2em] -rotate-90 w-[200px] text-center whitespace-nowrap">
                    Takes Energy (-E)
                </div>
            </div>

            <div className="space-y-1 h-full">
                <MatrixCell 
                    quadrant="DELETE" 
                    sublabel="-Energy / -Money"
                    tasks={deleteTasks} 
                    className="h-[300px] md:h-[420px]" 
                />
            </div>
            <div className="space-y-1 h-full">
                <MatrixCell 
                    quadrant="DELEGATE" 
                    sublabel="-Energy / +Money"
                    tasks={delegateTasks} 
                    className="h-[300px] md:h-[420px]" 
                />
            </div>
        </div>
    </div>
  );
}
