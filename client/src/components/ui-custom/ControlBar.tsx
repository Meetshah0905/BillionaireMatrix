import { useStore } from "@/lib/store";
import { Search, Download, Upload, RotateCcw, Filter } from "lucide-react";
import { useRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ControlBar() {
  const { searchQuery, setSearchQuery, exportData, importData, resetLearnedRules, filters, setFilter } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownload = () => {
    const data = exportData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `billionaire-matrix-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const content = event.target?.result as string;
        if (importData(content)) {
            alert("Data imported successfully!");
        } else {
            alert("Failed to import data. Invalid format.");
        }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4 bg-card p-4 rounded-lg border border-border mt-8">
        
        {/* Top Row: Search & Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
            
            {/* Search */}
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                    type="text" 
                    placeholder="Search tasks..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-muted/50 border border-transparent focus:border-border rounded-md focus:outline-none transition-colors"
                />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 items-center">
                <Filter className="w-4 h-4 text-muted-foreground mr-1" />
                
                <Select value={filters.quadrant} onValueChange={(v) => setFilter("quadrant", v)}>
                    <SelectTrigger className="w-[140px] h-9 text-xs">
                        <SelectValue placeholder="Quadrant" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Quadrants</SelectItem>
                        <SelectItem value="PROTECT">Protect</SelectItem>
                        <SelectItem value="PRIORITIZE">Prioritize</SelectItem>
                        <SelectItem value="DELETE">Delete</SelectItem>
                        <SelectItem value="DELEGATE">Delegate</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={filters.energy} onValueChange={(v) => setFilter("energy", v)}>
                    <SelectTrigger className="w-[130px] h-9 text-xs">
                        <SelectValue placeholder="Energy" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Energy</SelectItem>
                        <SelectItem value="gives">Gives Energy</SelectItem>
                        <SelectItem value="takes">Takes Energy</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={filters.money} onValueChange={(v) => setFilter("money", v)}>
                    <SelectTrigger className="w-[130px] h-9 text-xs">
                        <SelectValue placeholder="Money" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Money</SelectItem>
                        <SelectItem value="makes">Makes Money</SelectItem>
                        <SelectItem value="takes">Takes Money</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>

        <div className="h-px bg-border/50 w-full" />

        {/* Bottom Row: Actions */}
        <div className="flex items-center justify-between">
             <button 
                onClick={resetLearnedRules}
                className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 px-2 py-1 rounded hover:bg-muted transition-colors"
                title="Reset learned categorization rules"
            >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Rules
            </button>

            <div className="flex items-center gap-2">
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs flex items-center gap-2 px-3 py-2 rounded hover:bg-muted transition-colors border border-transparent hover:border-border"
                >
                    <Upload className="w-3.5 h-3.5" />
                    Import JSON
                </button>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleUpload} 
                    className="hidden" 
                    accept=".json"
                />

                <button 
                    onClick={handleDownload}
                    className="text-xs flex items-center gap-2 px-3 py-2 rounded bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-sm"
                >
                    <Download className="w-3.5 h-3.5" />
                    Export JSON
                </button>
            </div>
        </div>
    </div>
  );
}
