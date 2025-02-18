import {
  Tooltip as RadixTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "components/ui/tooltip";
import type { ReactNode } from "react";

export const Tooltip = ({
  content,
  children
}: {
  content: ReactNode;
  children: ReactNode;
}) => {
  return (
    <TooltipProvider>
      <RadixTooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>{content}</TooltipContent>
      </RadixTooltip>
    </TooltipProvider>
  );
};
