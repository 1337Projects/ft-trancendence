
import React, { createContext, useState } from 'react'

type ApearanceContextType = {
    theme : String,
    color : string,
    themeHandler : (theme : string) => void,
    colorHandler : (color : string) => void,
}

export const ApearanceContext = createContext<ApearanceContextType | null>(null);

export default function ApearanceProvider({children}) {

    const [theme, setTheme] = useState<string>("")
    const [color, setColor] = useState<string>("")
    let currentTheme = window.localStorage.getItem('theme')
    let currentColor = window.localStorage.getItem('color')

    if (!currentColor) {
        currentColor = '';
        setColor(currentColor)
    }

    if (!currentTheme) {
        currentTheme = 'dark';
        setColor(currentTheme)
    }

    function themeHandler(theme : string) {
        setTheme(theme)
        window.localStorage.setItem('theme', theme)
    }

    function colorHandler(color : string) {
        setColor(color)
        window.localStorage.setItem('color' , 'color')
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

