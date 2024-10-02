
import React, { createContext, useState } from 'react'
import { ApearanceContextType } from '../Types';



export const ApearanceContext = createContext<ApearanceContextType | null>(null);

export default function ApearanceProvider({children}) {

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

