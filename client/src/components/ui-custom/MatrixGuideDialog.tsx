import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

export function MatrixGuideDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
          <HelpCircle className="w-4 h-4" />
          <span className="hidden sm:inline">How it works</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>The Billionaire Matrix</DialogTitle>
          <DialogDescription>
            A simple framework to classify tasks based on Energy and Money.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="p-4 rounded-lg border border-border bg-card">
              <h3 className="font-bold text-lg mb-1 text-primary">1. Protect</h3>
              <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                Gives Energy • Takes Money
              </div>
              <p className="text-sm text-foreground/80">
                <strong>Hobbies, Health, Family.</strong> These things cost money but recharge your soul. 
                Protect them at all costs—they prevent burnout.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-primary/20 bg-primary/5 ring-1 ring-primary/10">
              <h3 className="font-bold text-lg mb-1 text-primary">2. Prioritize</h3>
              <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                Gives Energy • Makes Money
              </div>
              <p className="text-sm text-foreground/80">
                <strong>Dream Business, High-Value Work.</strong> The sweet spot. 
                Spend as much time here as possible. This is where you build wealth happily.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-red-50/30">
              <h3 className="font-bold text-lg mb-1 text-red-700">3. Delete</h3>
              <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                Takes Energy • Takes Money
              </div>
              <p className="text-sm text-foreground/80">
                <strong>Bad Habits, Dumb Expenses.</strong> Things that drain you AND your wallet. 
                Eliminate these ruthlessly.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-card">
              <h3 className="font-bold text-lg mb-1 text-foreground">4. Delegate</h3>
              <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                Takes Energy • Makes Money
              </div>
              <p className="text-sm text-foreground/80">
                <strong>Admin, Chores, Grunt Work.</strong> Necessary evils that pay the bills but drain you. 
                Hire someone else to do these as soon as you can afford it.
              </p>
            </div>

          </div>

          <div className="bg-muted/30 p-4 rounded text-sm text-muted-foreground">
            <h4 className="font-semibold text-foreground mb-1">Smart Suggestions</h4>
            <p>
              Type a task like "File taxes" or "Go for a run". The app will try to guess the quadrant. 
              If you manually override it, the app learns your preference for next time.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
