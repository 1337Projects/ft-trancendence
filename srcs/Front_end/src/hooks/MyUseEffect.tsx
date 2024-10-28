import { useEffect } from "react"

export default function MyUseEffect(fn : () => void, args : React.DependencyList) {
    useEffect(() => {
        const timer = setTimeout(fn, 100)
        return () => clearTimeout(timer)
    }, args)

}