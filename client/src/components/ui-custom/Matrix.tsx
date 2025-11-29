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
        {/* Desktop Headers */}
        <div className="hidden md:grid grid-cols-[auto_1fr_1fr] gap-6 mb-2">
            <div className="w-8"></div> {/* Spacer for row header */}
            <div className="text-center text-xs font-bold text-muted-foreground uppercase tracking-widest bg-muted/30 py-1 rounded">
                Takes Money (-$)
            </div>
            <div className="text-center text-xs font-bold text-muted-foreground uppercase tracking-widest bg-muted/30 py-1 rounded">
                Makes Money (+$)
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_1fr] gap-4 md:gap-6 w-full">
            
            {/* Row 1: Gives Energy */}
            <div className="hidden md:flex items-center justify-center">
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest -rotate-90 w-8 whitespace-nowrap">
                    Gives Energy (+E)
                </div>
            </div>

            <div className="space-y-1">
                 <MatrixCell quadrant="PROTECT" tasks={protectTasks} className="h-[300px] md:h-[400px]" />
                 <div className="text-center text-xs text-muted-foreground mt-1 md:hidden font-medium">Gives Energy + Takes Money</div>
            </div>
            <div className="space-y-1">
                <MatrixCell quadrant="PRIORITIZE" tasks={prioritizeTasks} className="h-[300px] md:h-[400px] border-primary/20 ring-1 ring-primary/5 bg-primary/[0.02]" />
                 <div className="text-center text-xs text-muted-foreground mt-1 md:hidden font-medium">Gives Energy + Makes Money</div>
            </div>

            {/* Row 2: Takes Energy */}
            <div className="hidden md:flex items-center justify-center">
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest -rotate-90 w-8 whitespace-nowrap">
                    Takes Energy (-E)
                </div>
            </div>

            <div className="space-y-1">
                <MatrixCell quadrant="DELETE" tasks={deleteTasks} className="h-[300px] md:h-[400px] bg-red-50/10" />
                 <div className="text-center text-xs text-muted-foreground mt-1 md:hidden font-medium">Takes Energy + Takes Money</div>
            </div>
            <div className="space-y-1">
                <MatrixCell quadrant="DELEGATE" tasks={delegateTasks} className="h-[300px] md:h-[400px]" />
                 <div className="text-center text-xs text-muted-foreground mt-1 md:hidden font-medium">Takes Energy + Makes Money</div>
            </div>
        </div>
    </div>
  );
}
