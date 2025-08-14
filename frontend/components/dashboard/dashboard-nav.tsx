"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

const navItems = [
  { id: "overview", label: "Overview", active: true },
  { id: "documents", label: "My documents", active: false },
  { id: "settings", label: "Settings", active: false },
  { id: "notifications", label: "Notifications", active: false },
]

export function DashboardNav() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <nav className="border-b">
      <div className="flex space-x-8 overflow-x-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "py-2 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap",
              activeTab === item.id
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
