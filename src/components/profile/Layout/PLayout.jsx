import { Outlet } from "react-router-dom"
import Header from "./Header"
import { Navigate } from "react-router-dom"
import Sidebar from "./Sidebar"

const PLayout = () => {
  
  const user = localStorage.getItem("user")
  if(!user){
    return <Navigate to ='/' replace/>
  }
  return (
    
    <main className=" relative max-h-[100%] overflow-hidden bg-gray-100">
    <div className="flex items-start justify-between">
      {/* <div className="relative hidden h-screen  ml-4  lg:block ">
          <Sidebar />
      </div> */}

 <div className="flex flex-col h-full w-full pl-0 md:p-4 md:space-y-4">
         <Header />
         <Outlet />
    
      </div>
      </div>
 </main>
   
  )
}

export default PLayout