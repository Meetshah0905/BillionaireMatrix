import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { suggestClassification } from "@/lib/suggestionEngine";
import { Suggestion } from "@/lib/types";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function TaskInput() {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [overrideEnergy, setOverrideEnergy] = useState<"gives" | "takes" | null>(null);
  const [overrideMoney, setOverrideMoney] = useState<"makes" | "takes" | null>(null);

  const { addTask, customRules } = useStore();

  useEffect(() => {
    if (!title.trim()) {
      setSuggestion(null);
      setOverrideEnergy(null);
      setOverrideMoney(null);
      return;
    }

    const result = suggestClassification(title, customRules);
    setSuggestion(result);
  }, [title, customRules]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!title.trim()) return;

    addTask(title, notes, {
      energy: overrideEnergy || undefined,
      money: overrideMoney || undefined,
    });

    setTitle("");
    setNotes("");
    setShowNotes(false);
    setOverrideEnergy(null);
    setOverrideMoney(null);
  };

  const finalEnergy = overrideEnergy || suggestion?.suggestedEnergy || "gives";
  const finalMoney = overrideMoney || suggestion?.suggestedMoney || "makes";

  return (
    <div className="space-y-4 mb-8">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a task (e.g., 'File taxes', 'Go to gym')"
              className="w-full p-3 pl-4 text-lg bg-white border border-border rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
              data-testid="input-task-title"
            />
          </div>
          <button
            type="submit"
            disabled={!title.trim()}
            className="bg-primary text-primary-foreground px-6 py-3 rounded font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            data-testid="button-add-task"
          >
            Add <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Notes Toggle */}
        <div className="mt-2">
            <button 
                type="button" 
                onClick={() => setShowNotes(!showNotes)}
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
                {showNotes ? "- Hide notes" : "+ Add notes"}
            </button>
        </div>

        <AnimatePresence>
            {showNotes && (
                <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mt-2"
                >
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add details..."
                        className="w-full p-3 text-sm bg-white border border-border rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-primary/20 min-h-[80px]"
                    />
                </motion.div>
            )}
        </AnimatePresence>
      </form>

      {/* Suggestion & Overrides Panel */}
      <AnimatePresence>
        {title.trim() && suggestion && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-card border border-border rounded-md p-4 shadow-sm"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              {/* Left: Suggestion Info */}
              <div className="flex items-start gap-3">
                <div className="mt-1 text-primary/50">
                    <Sparkles className="w-5 h-5" />
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="font-medium text-sm text-foreground">
                            Suggested: <span className="font-bold uppercase">{getQuadrantName(finalEnergy, finalMoney)}</span>
                        </h3>
                        {suggestion.usedLearnedRule && (
                            <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">Learned</span>
                        )}
                    </div>
                    
                    <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-x-3">
                        <span>Confidence: {suggestion.confidence}%</span>
                        {suggestion.matched.length > 0 && (
                            <span>Keywords: {suggestion.matched.join(", ")}</span>
                        )}
                    </div>
                </div>
              </div>

              {/* Right: Overrides */}
              <div className="flex items-center gap-4 text-sm">
                {/* Energy Toggle */}
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Energy</span>
                    <div className="flex bg-muted rounded p-0.5">
                        <button
                            type="button"
                            onClick={() => setOverrideEnergy("gives")}
                            className={cn(
                                "px-3 py-1 rounded-sm text-xs transition-all",
                                finalEnergy === "gives" ? "bg-white shadow-sm text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Gives
                        </button>
                        <button
                            type="button"
                            onClick={() => setOverrideEnergy("takes")}
                            className={cn(
                                "px-3 py-1 rounded-sm text-xs transition-all",
                                finalEnergy === "takes" ? "bg-white shadow-sm text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Takes
                        </button>
                    </div>
                </div>

                {/* Money Toggle */}
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Money</span>
                    <div className="flex bg-muted rounded p-0.5">
                        <button
                            type="button"
                            onClick={() => setOverrideMoney("makes")}
                            className={cn(
                                "px-3 py-1 rounded-sm text-xs transition-all",
                                finalMoney === "makes" ? "bg-white shadow-sm text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Makes
                        </button>
                        <button
                            type="button"
                            onClick={() => setOverrideMoney("takes")}
                            className={cn(
                                "px-3 py-1 rounded-sm text-xs transition-all",
                                finalMoney === "takes" ? "bg-white shadow-sm text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Takes
                        </button>
                    </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function getQuadrantName(energy: string, money: string) {
    if (energy === "gives" && money === "takes") return "Protect";
    if (energy === "gives" && money === "makes") return "Prioritize";
    if (energy === "takes" && money === "takes") return "Delete";
    if (energy === "takes" && money === "makes") return "Delegate";
    return "Unknown";
}
