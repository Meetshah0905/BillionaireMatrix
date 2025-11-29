import { Matrix } from "@/components/ui-custom/Matrix";
import { TaskInput } from "@/components/ui-custom/TaskInput";
import { ControlBar } from "@/components/ui-custom/ControlBar";
import { MatrixGuideDialog } from "@/components/ui-custom/MatrixGuideDialog";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/10">
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        
        {/* Header */}
        <header className="mb-12 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary mb-2">Billionaire Matrix</h1>
                <p className="text-muted-foreground text-lg">Classify tasks by energy and money to optimize your productivity.</p>
            </div>
            <MatrixGuideDialog />
        </header>

        {/* Input Section */}
        <section className="max-w-2xl mx-auto md:mx-0">
            <TaskInput />
        </section>

        {/* Matrix */}
        <main className="mt-12">
            <Matrix />
        </main>

        {/* Footer Controls */}
        <footer className="mt-12 mb-8">
            <ControlBar />
        </footer>

      </div>
    </div>
  );
}
