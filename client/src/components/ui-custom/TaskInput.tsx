import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { suggestClassification } from "@/lib/suggestionEngine";
import { Suggestion } from "@/lib/types";
import { ArrowRight, Sparkles, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function TaskInput() {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
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
    setOverrideEnergy(null);
    setOverrideMoney(null);
  };

  const finalEnergy = overrideEnergy || suggestion?.suggestedEnergy || "gives";
  const finalMoney = overrideMoney || suggestion?.suggestedMoney || "makes";
  const quadrant = getQuadrantName(finalEnergy, finalMoney);

  return (
    <div className="bg-[var(--panel)] rounded-[var(--radius)] border border-[var(--border)] shadow-[var(--shadow)] p-6 mb-8">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8">
        
        {/* Left Column: Inputs */}
        <div className="space-y-4">
            <div>
                <label className="block text-xs font-medium text-[var(--muted)] uppercase tracking-wider mb-2">
                    New Task
                </label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. 'File quarterly taxes' or 'Yoga class'"
                    className="w-full bg-[var(--bg)] text-[var(--text)] border border-[var(--border)] rounded-[var(--radius-sm)] p-3 text-base focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all placeholder-[var(--faint)]"
                    autoFocus
                />
            </div>
            
            <div>
                <div className="relative">
                     <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add optional notes..."
                        className="w-full bg-[var(--bg)] text-[var(--text)] border border-[var(--border)] rounded-[var(--radius-sm)] p-2.5 text-sm focus:outline-none focus:border-[var(--border-2)] transition-all placeholder-[var(--faint)]"
                    />
                </div>
            </div>

            {/* Mobile-only Overrides (visible on small screens) */}
            <div className="md:hidden space-y-4 pt-4 border-t border-[var(--border)]">
                 <OverrideControls 
                    energy={finalEnergy} 
                    money={finalMoney} 
                    setEnergy={setOverrideEnergy} 
                    setMoney={setOverrideMoney} 
                 />
            </div>
            
            <div className="flex items-center justify-end md:justify-start pt-2">
                 <button
                    type="submit"
                    disabled={!title.trim()}
                    className="bg-[var(--accent)] text-white px-6 py-2.5 rounded-[var(--radius-sm)] font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm shadow-lg shadow-[var(--accent)]/20"
                >
                    Add Task <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>

        {/* Right Column: Suggestions & Desktop Overrides */}
        <div className="hidden md:flex flex-col h-full border-l border-[var(--border)] pl-8">
            <label className="block text-xs font-medium text-[var(--muted)] uppercase tracking-wider mb-2">
                Classification
            </label>
            
            <div className="flex-1 flex flex-col">
                {title.trim() && suggestion ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex-1 flex flex-col"
                    >
                        <div className="mb-6">
                            <div className="flex items-center gap-2 text-[var(--text)] mb-1">
                                <Sparkles className="w-4 h-4 text-[var(--accent)]" />
                                <span className="font-medium">Suggested: <span className="font-bold text-[var(--accent)]">{quadrant}</span></span>
                            </div>
                            <div className="text-xs text-[var(--muted)] pl-6">
                                Confidence: <span className={cn(suggestion.confidence > 80 ? "text-[var(--good)]" : "text-[var(--bad)]")}>{suggestion.confidence}%</span>
                                {suggestion.matched.length > 0 && (
                                    <span className="block mt-1 opacity-70">Matches: {suggestion.matched.join(", ")}</span>
                                )}
                            </div>
                        </div>

                        <div className="mt-auto space-y-4">
                            <div className="text-[10px] uppercase text-[var(--muted)] font-bold tracking-widest">Manual Override</div>
                            <OverrideControls 
                                energy={finalEnergy} 
                                money={finalMoney} 
                                setEnergy={setOverrideEnergy} 
                                setMoney={setOverrideMoney} 
                            />
                        </div>
                    </motion.div>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-[var(--faint)] text-sm italic border border-dashed border-[var(--border)] rounded-[var(--radius-sm)] bg-[var(--bg)]/30">
                        Start typing to see suggestions...
                    </div>
                )}
            </div>
        </div>

      </form>
    </div>
  );
}

function OverrideControls({ energy, money, setEnergy, setMoney }: any) {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--muted)]">Energy</span>
                <div className="flex bg-[var(--bg)] p-1 rounded-[8px] border border-[var(--border)]">
                    <button
                        type="button"
                        onClick={() => setEnergy("gives")}
                        className={cn(
                            "px-3 py-1 rounded-[6px] text-[10px] font-medium transition-all",
                            energy === "gives" ? "bg-[var(--panel)] text-[var(--good)] shadow-sm border border-[var(--border)]" : "text-[var(--muted)] hover:text-[var(--text)]"
                        )}
                    >
                        Gives
                    </button>
                    <button
                        type="button"
                        onClick={() => setEnergy("takes")}
                        className={cn(
                            "px-3 py-1 rounded-[6px] text-[10px] font-medium transition-all",
                            energy === "takes" ? "bg-[var(--panel)] text-[var(--bad)] shadow-sm border border-[var(--border)]" : "text-[var(--muted)] hover:text-[var(--text)]"
                        )}
                    >
                        Takes
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--muted)]">Money</span>
                <div className="flex bg-[var(--bg)] p-1 rounded-[8px] border border-[var(--border)]">
                    <button
                        type="button"
                        onClick={() => setMoney("makes")}
                        className={cn(
                            "px-3 py-1 rounded-[6px] text-[10px] font-medium transition-all",
                            money === "makes" ? "bg-[var(--panel)] text-[var(--good)] shadow-sm border border-[var(--border)]" : "text-[var(--muted)] hover:text-[var(--text)]"
                        )}
                    >
                        Makes
                    </button>
                    <button
                        type="button"
                        onClick={() => setMoney("takes")}
                        className={cn(
                            "px-3 py-1 rounded-[6px] text-[10px] font-medium transition-all",
                            money === "takes" ? "bg-[var(--panel)] text-[var(--bad)] shadow-sm border border-[var(--border)]" : "text-[var(--muted)] hover:text-[var(--text)]"
                        )}
                    >
                        Takes
                    </button>
                </div>
            </div>
        </div>
    )
}

function getQuadrantName(energy: string, money: string) {
    if (energy === "gives" && money === "takes") return "PROTECT";
    if (energy === "gives" && money === "makes") return "PRIORITIZE";
    if (energy === "takes" && money === "takes") return "DELETE";
    if (energy === "takes" && money === "makes") return "DELEGATE";
    return "Unknown";
}
