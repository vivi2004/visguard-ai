"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ToggleTheme() {
    const [isDark, setIsDark] = useState(false)

    // ⏪ Load theme from localStorage when component mounts
    useEffect(() => {
        const storedTheme = localStorage.getItem("theme")
        if (storedTheme === "dark") {
            setIsDark(true)
            document.documentElement.classList.add("dark")
        } else {
            setIsDark(false)
            document.documentElement.classList.remove("dark")
        }
    }, [])

    // 🔁 Save theme to localStorage and update <html> class when isDark changes
    useEffect(() => {
        const root = window.document.documentElement
        if (isDark) {
            root.classList.add("dark")
            localStorage.setItem("theme", "dark")
        } else {
            root.classList.remove("dark")
            localStorage.setItem("theme", "light")
        }
    }, [isDark])

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDark(!isDark)}
            className="absolute top-4 right-4 md:static md:ml-2"
        >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Toggle Theme</span>
        </Button>
    )
}
