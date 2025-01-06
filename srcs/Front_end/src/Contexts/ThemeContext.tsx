
import { ApearanceContextType } from '@/types';
import { createContext, ReactNode, useState } from 'react'




export const ApearanceContext = createContext<ApearanceContextType | null>(null);

export default function ApearanceProvider({children} : {children : ReactNode}) {

    let currentTheme = window.localStorage.getItem('theme')
    let currentColor = window.localStorage.getItem('color')
    
    if (!currentColor) {
        currentColor = '#C53F3F';
        window.localStorage.setItem("color", currentColor)
    }
    
    if (!currentTheme) {
        currentTheme = 'dark';
        window.localStorage.setItem("theme", currentTheme)
    }

    const [theme, setTheme] = useState<string>(currentTheme)
    const [color, setColor] = useState<string>(currentColor)
    
    function themeHandler(theme : string) {
        setTheme(theme)
        window.localStorage.setItem('theme', theme)
    }
    
    function colorHandler(color : string) {
        setColor(color)
        window.localStorage.setItem('color' , color)
    }

    const value = {
        theme,
        color,
        themeHandler,
        colorHandler
    }

    return (
        <ApearanceContext.Provider value={value}>
            {children}
        </ApearanceContext.Provider>
    )
}

