import React from 'react'

const AdminPetTile = () => {
  return (
    <div className='w-full max-w-sm mx-auto bg-zinc-200 pb-2 rounded-lg ' >
        <div>
            <div className='relative'>
            <img
            src="https://i.pinimg.com/736x/3b/c2/c4/3bc2c4b2d87b571b43f6004b9cba41f8.jpg"
            alt="Product-title"
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
        </div>
        <div>
          <h2 className="text-xl font-bold mb-2 mt-4 pl-3">Pet Name</h2>
          <div className="flex justify-between items-center mb-4 pl-3 mt-4">
            <span
              className="text-sm font-semibold text-primary"
            >
              Pet Description
            </span>

          </div>
        </div>
        <div className="flex px-2 justify-between items-center mx-3 mb-2">
          <button className='px-3 py-1 bg-green-500 rounded-md' >Edit</button>
          <button className='px-3 py-1 bg-red-500 rounded-md' >Delete</button>
        </div>
        </div>
    </div>
  )
}

export default AdminPetTile
