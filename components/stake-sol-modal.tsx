"use client";

import { Button } from "components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "components/ui/dialog";

/**
 * Modal that houses the form for a user to stake SOL.
 */
export const StakeSolModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-[#512da8] hover:bg-[#512da8]/90">Stake</Button>
      </DialogTrigger>
      <DialogContent className="w-[500px] max-w-[95vw]">
        <DialogHeader>
          <DialogTitle>Stake Sol</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
