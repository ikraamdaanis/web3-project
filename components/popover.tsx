import {
  PopoverContent,
  PopoverTrigger,
  Popover as RadixPopover
} from "components/ui/popover";
import type { ComponentProps, ReactNode } from "react";

export const Popover = ({
  content,
  children,
  ...props
}: {
  content: ReactNode;
  children: ReactNode;
} & Omit<ComponentProps<typeof PopoverContent>, "children" | "content">) => {
  return (
    <RadixPopover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent {...props}>{content}</PopoverContent>
    </RadixPopover>
  );
};
