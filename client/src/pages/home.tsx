import { Matrix } from "@/components/ui-custom/Matrix";
import { TaskInput } from "@/components/ui-custom/TaskInput";
import { ControlBar } from "@/components/ui-custom/ControlBar";
import { MatrixGuideDialog } from "@/components/ui-custom/MatrixGuideDialog";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-sans selection:bg-[var(--accent)]/30 selection:text-[var(--accent-foreground)] pb-20">
      <div className="max-w-[1200px] mx-auto px-6 py-8 md:py-12">
        
        {/* Header */}
        <header className="mb-12 flex flex-col md:flex-row items-start justify-between gap-6">
            <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text)] mb-2">Billionaire Matrix</h1>
                <p className="text-[var(--muted)] text-lg max-w-xl">
                    A productivity framework to optimize your life by Energy and Money.
                </p>
            </div>
            
            <div className="flex items-center gap-2">
                <MatrixGuideDialog />
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="text-[var(--muted)] hover:text-[var(--text)]"
                >
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </div>
        </header>

        {/* Input Section */}
        <section className="w-full">
            <TaskInput />
        </section>

        {/* Matrix */}
        <main className="mt-8">
            <Matrix />
        </main>

        {/* Footer Controls */}
        <footer className="mt-12">
            <ControlBar />
        </footer>

      </div>
    </div>
  );
}
