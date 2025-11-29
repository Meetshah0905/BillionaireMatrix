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

  // If quadrant filter is active, we might only show one cell, 
  // but user asked for a matrix layout. 
  // However, "Quadrant filter" implies we only see tasks from that quadrant.
  // For the matrix VIEW, it's better to show all 4 cells but empty if filtered out.
  // Let's stick to standard 2x2.

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
        {/* Row 1 */}
        <div className="space-y-1">
             <div className="hidden md:block text-center text-xs font-medium text-muted-foreground mb-2 uppercase tracking-widest">Takes Money</div>
             <MatrixCell quadrant="PROTECT" tasks={protectTasks} className="h-[300px] md:h-[400px]" />
             <div className="text-center text-xs text-muted-foreground mt-1 md:hidden">Gives Energy + Takes Money</div>
        </div>
        <div className="space-y-1">
            <div className="hidden md:block text-center text-xs font-medium text-muted-foreground mb-2 uppercase tracking-widest">Makes Money</div>
            <MatrixCell quadrant="PRIORITIZE" tasks={prioritizeTasks} className="h-[300px] md:h-[400px] border-primary/20 ring-1 ring-primary/5" />
             <div className="text-center text-xs text-muted-foreground mt-1 md:hidden">Gives Energy + Makes Money</div>
        </div>

        {/* Row 2 */}
        <div className="space-y-1">
            <MatrixCell quadrant="DELETE" tasks={deleteTasks} className="h-[300px] md:h-[400px] bg-red-50/10" />
             <div className="text-center text-xs text-muted-foreground mt-1 md:hidden">Takes Energy + Takes Money</div>
        </div>
        <div className="space-y-1">
            <MatrixCell quadrant="DELEGATE" tasks={delegateTasks} className="h-[300px] md:h-[400px]" />
             <div className="text-center text-xs text-muted-foreground mt-1 md:hidden">Takes Energy + Makes Money</div>
        </div>
    </div>
  );
}
