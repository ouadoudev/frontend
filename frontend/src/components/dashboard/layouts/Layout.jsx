import { useState } from "react"
import { Navigate, Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import { ScrollArea } from "@/components/ui/scroll-area"
import Header from "./Header"

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const user = JSON.parse(localStorage.getItem("user"))

  if (!user) {
    return <Navigate to="/" replace />
  } else if (user.role === "student") {
    return <Navigate to="/profile" replace />
  }

  return (
    
    <div className="flex h-screen bg-gray-100">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex flex-col w-full">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <ScrollArea className="flex-1 overflow-y-auto mt-8 px-4 md:px-6 lg:px-8">
          <Outlet />
        </ScrollArea>
      </div>
    </div>
  )
}

export default Layout

