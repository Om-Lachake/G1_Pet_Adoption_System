import React from 'react'
import {Menu} from 'lucide-react'
import {LogOut} from 'lucide-react'
const AdminHeader = ({setOpen}) => {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b" >
      <button onClick={()=>setOpen(true)} className='lg:hidden small:block mt-4 w-fit  bg-black text-white  inline-flex items-center rounded-md px-3 py-2 text-sm font-medium shadow gap-2' >
      <Menu size={15} />
      <span className='sr-only'>Toggle Menu</span>
      </button>
      <div className='flex flex-1 justify-end'>
        <button className=' mt-4 w-fit  bg-blue-500 text-white  inline-flex items-center rounded-md px-4 py-2 text-sm font-medium shadow gap-2' >
        <LogOut />
          Logout
        </button>
      </div>
    </header>
  )
}

export default AdminHeader
