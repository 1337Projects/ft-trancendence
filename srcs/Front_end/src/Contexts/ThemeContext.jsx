
import { createContext } from 'react'

export const ThemeContext = createContext(null);
export const ThemeToggelContext = createContext(null);


export function ThemeProvider({children, theme, handler}) {

    return (
        <ThemeContext.Provider value={theme}>
            <ThemeToggelContext.Provider value={handler}>
                {children}
            </ThemeToggelContext.Provider>
        </ThemeContext.Provider>
    )
}

export const ColorContext = createContext(null);
export const ColorToggelContext = createContext(null)


export function ColorProvider({children, color, handler}) {
    return (
        <ColorContext.Provider value={color}>
            <ColorToggelContext.Provider value={handler}>
                {children}
            </ColorToggelContext.Provider>
        </ColorContext.Provider>
    )
}