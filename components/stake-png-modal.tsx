"use client";

import { StakePngForm } from "components/stake-png-form";
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
 * Modal that houses the form for a user to stake PNG tokens.
 */
export const StakePngModal = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg">Stake PNG</Button>
      </DialogTrigger>
      <DialogContent className="w-[500px] max-w-[95vw] bg-zinc-900">
        <DialogHeader>
          <DialogTitle>Stake Tokens</DialogTitle>
          <DialogDescription>
            Stake your PNG tokens to earn rewards
          </DialogDescription>
        </DialogHeader>
        <StakePngForm onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};
