import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Task, EnergySide, MoneySide } from "@/lib/types";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface EditTaskDialogProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditTaskDialog({ task, open, onOpenChange }: EditTaskDialogProps) {
  const { updateTask } = useStore();
  const [title, setTitle] = useState(task.title);
  const [notes, setNotes] = useState(task.notes || "");
  const [energy, setEnergy] = useState<EnergySide>(task.energySide);
  const [money, setMoney] = useState<MoneySide>(task.moneySide);

  const handleSave = () => {
    updateTask(task.id, {
      title,
      notes,
      energySide: energy,
      moneySide: money,
      source: "manual" // Editing counts as manual override
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
                <Label>Energy</Label>
                <div className="flex flex-col gap-2">
                    <Button 
                        variant={energy === "gives" ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setEnergy("gives")}
                        className={cn("w-full justify-start", energy === "gives" && "bg-green-600 hover:bg-green-700")}
                    >
                        Gives Energy
                    </Button>
                    <Button 
                        variant={energy === "takes" ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setEnergy("takes")}
                        className={cn("w-full justify-start", energy === "takes" && "bg-red-600 hover:bg-red-700")}
                    >
                        Takes Energy
                    </Button>
                </div>
            </div>
            <div className="grid gap-2">
                <Label>Money</Label>
                <div className="flex flex-col gap-2">
                    <Button 
                        variant={money === "makes" ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setMoney("makes")}
                        className={cn("w-full justify-start", money === "makes" && "bg-emerald-600 hover:bg-emerald-700")}
                    >
                        Makes Money
                    </Button>
                    <Button 
                        variant={money === "takes" ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setMoney("takes")}
                        className={cn("w-full justify-start", money === "takes" && "bg-orange-600 hover:bg-orange-700")}
                    >
                        Takes Money
                    </Button>
                </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
