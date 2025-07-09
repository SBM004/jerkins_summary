import React from 'react';
import {NavLink} from 'react-router-dom';


export default function Navbar(){
    return(
        
        <nav className="text-sm bg-white border-gray-200 flex flex-row items-center justify- w-full h-10   flex-nowrap ">
        
            <div className="leftcontainer pl-5 w-full flex flex-row items-center gap-3">
                
                <p>PackageFlow</p>
               

                 <NavLink to="/dashboard" className={({isActive})=>`border-gray-200 pl-2 pr-2 py-1 hover:bg-blue-300 ${isActive && 'bg-blue-300' }`}>
                    Dashboard
                </NavLink>
                 <NavLink to="/" className={({isActive})=>`border-gray-200 pl-2 pr-2 py-1 hover:bg-blue-300 ${ isActive && 'bg-blue-300'}`}>
                    Package Status
                </NavLink>
                 <NavLink to="/" className={`border-gray-200 pl-2 pr-2 py-1 hover:bg-blue-300 ${()=> isActive ? 'bg-blue-300' : 'bg-black'}`}>
                    Reports
                </NavLink>
                 <NavLink to="/" className={`border-gray-200 pl-2 pr-2 py-1 hover:bg-blue-300 ${()=> isActive ? 'bg-blue-300' : 'bg-black'}`}>
                    Distribution
                </NavLink>

               

            </div>
            <div className="leftcontainer  flex flex-row items-center pr-10">
                <p>account</p>

            </div>

        </nav>

    )
}