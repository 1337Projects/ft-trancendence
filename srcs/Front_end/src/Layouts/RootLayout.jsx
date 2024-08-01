import { Outlet } from "react-router-dom";



export default function RootLayout() {
    return (
        <>
            <div className="sidebar">
                <ul>
                    <li>1</li>
                    <li>2</li>
                    <li>3</li>
                </ul>
            </div>
            <main>
                <Outlet />
            </main>
        </>
    )
}