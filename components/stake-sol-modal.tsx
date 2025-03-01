"use client";

import { StakeSolForm } from "components/stake-sol-form";
import { Button } from "components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "components/ui/dialog";
import { useState } from "react";

/**
 * Modal that houses the form for a user to stake SOL.
 */
export const StakeSolModal = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg">Stake SOL</Button>
      </DialogTrigger>
      <DialogContent className="w-[500px] max-w-[95vw] bg-zinc-900">
        <DialogHeader>
          <DialogTitle>Stake Tokens</DialogTitle>
          <DialogDescription>
            Stake your SOL tokens to earn rewards
          </DialogDescription>
        </DialogHeader>
        <StakeSolForm onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};
