import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Task, CustomRules, EnergySide, MoneySide, Quadrant } from './types';
import { suggestClassification } from './suggestionEngine';

interface StoreState {
  tasks: Task[];
  customRules: CustomRules;
  searchQuery: string;
  filters: {
    quadrant: Quadrant | "ALL";
    energy: EnergySide | "ALL";
    money: MoneySide | "ALL";
  };
  
  // Actions
  addTask: (title: string, notes?: string, overrides?: { energy?: EnergySide; money?: MoneySide }) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  learnRule: (title: string, energy: EnergySide, money: MoneySide) => void;
  
  setSearchQuery: (query: string) => void;
  setFilter: (type: "quadrant" | "energy" | "money", value: string) => void;
  resetLearnedRules: () => void;
  importData: (jsonData: string) => boolean;
  exportData: () => string;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      tasks: [],
      customRules: {},
      searchQuery: "",
      filters: {
        quadrant: "ALL",
        energy: "ALL",
        money: "ALL",
      },

      addTask: (title: string, notes = "", overrides?: { energy?: EnergySide; money?: MoneySide }) => {
        const { customRules } = get();
        const suggestion = suggestClassification(title, customRules);
        
        const energySide = overrides?.energy ?? suggestion.suggestedEnergy;
        const moneySide = overrides?.money ?? suggestion.suggestedMoney;
        
        const isManualOverride = 
          (overrides?.energy && overrides.energy !== suggestion.suggestedEnergy) ||
          (overrides?.money && overrides.money !== suggestion.suggestedMoney);

        const newTask: Task = {
          id: uuidv4(),
          title,
          notes,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          energySide,
          moneySide,
          energyScore: suggestion.energyScoreRaw,
          moneyScore: suggestion.moneyScoreRaw,
          source: isManualOverride ? "manual" : (suggestion.usedLearnedRule ? "learned" : "suggested"),
          suggestion
        };

        set((state: StoreState) => ({ tasks: [...state.tasks, newTask] }));

        // If user manually overrode, learn it!
        if (isManualOverride) {
           get().learnRule(title, energySide, moneySide);
        }
      },

      updateTask: (id: string, updates: Partial<Task>) => {
        set((state: StoreState) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: Date.now() } : t)),
        }));
      },

      deleteTask: (id: string) => {
        set((state: StoreState) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }));
      },

      learnRule: (title: string, energy: EnergySide, money: MoneySide) => {
        const normalized = title.toLowerCase().replace(/[^\w\s]/g, "").trim().replace(/\s+/g, " ");
        set((state: StoreState) => {
           const existing = state.customRules[normalized];
           return {
             customRules: {
               ...state.customRules,
               [normalized]: {
                 energySide: energy,
                 moneySide: money,
                 count: existing ? existing.count + 1 : 1
               }
             }
           };
        });
      },

      setSearchQuery: (query: string) => set({ searchQuery: query }),
      
      setFilter: (type: "quadrant" | "energy" | "money", value: string) => set((state: StoreState) => ({
        filters: { ...state.filters, [type]: value as any }
      })),

      resetLearnedRules: () => set({ customRules: {} }),

      exportData: () => {
        const { tasks, customRules } = get();
        return JSON.stringify({ tasks, customRules, version: 1 }, null, 2);
      },

      importData: (jsonData: string) => {
        try {
          const data = JSON.parse(jsonData);
          if (!data.tasks || !Array.isArray(data.tasks)) return false;
          
          set({
            tasks: data.tasks,
            customRules: data.customRules || {},
          });
          return true;
        } catch (e) {
          console.error("Import failed", e);
          return false;
        }
      }
    }),
    {
      name: 'billionaire-matrix-storage',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);
