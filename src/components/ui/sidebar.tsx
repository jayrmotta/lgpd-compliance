import * as React from "react"
import { cn } from "@/lib/utils"

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "compact"
  position?: "left" | "right"
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, variant = "default", position = "left", children, ...props }, ref) => {
    return (
      <aside
        ref={ref}
        className={cn(
          "flex flex-col bg-background border-r border-border",
          {
            "w-64": variant === "default",
            "w-16": variant === "compact",
            "border-l border-r-0": position === "right",
          },
          className
        )}
        {...props}
      >
        {children}
      </aside>
    )
  }
)
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex h-16 shrink-0 items-center border-b border-border px-4", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex-1 overflow-auto", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
SidebarContent.displayName = "SidebarContent"

const SidebarFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex h-16 shrink-0 items-center border-t border-border px-4", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
SidebarFooter.displayName = "SidebarFooter"

export { Sidebar, SidebarHeader, SidebarContent, SidebarFooter }
