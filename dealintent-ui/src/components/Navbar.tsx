'use client';

import useGlobalStore from "@/store/global";

const Navbar = () => {
  const { loading } =  useGlobalStore();
  
  return (
    <div className="container mx-auto border-2 p-3 bg-white shadow-sm rounded-md my-2 sticky">
      <h2 className="text-xl font-bold text-center text-indigo-700">Kanban Board</h2>
    </div>
  )
}

export default Navbar