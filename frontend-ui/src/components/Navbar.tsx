'use client';

import Link from "next/link";

type NavbarPropTypes = {
  children?: React.ReactNode;
};

const Navbar: React.FC<NavbarPropTypes> = (props) => {
  
  return (
    <div className="container mx-auto border-2 p-3 bg-white shadow-sm rounded-md my-2 sticky grid grid-cols-12 gap-2 items-center">
      <Link href={'/'} className="text-xl col-span-3 font-bold text-center text-indigo-700">Kanban Board</Link>
      <div className="col-span-9">{props.children}</div>
    </div>
  )
}

export default Navbar