import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "$/components/ui/tooltip"


interface SimpleTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
}
export default function TooltipWrapper({ children, content }: SimpleTooltipProps) {
  return (<TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent>
        {content}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider >);
}
