// components/AppHeader.tsx
import { SidebarTrigger } from "@/components/ui/sidebar"
import React from "react"
import LanguageSelector from "./LanguageSelector"

function AppHeader({ children }: { children?: React.ReactNode }) {
  return (
    <div className="p-2 shadow-sm flex items-center justify-between w-full">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
      </div>
      <div>

        {children}
        </div>
      <LanguageSelector />
    </div>
  )
}

export default AppHeader
