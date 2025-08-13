import React from "react";
import { NavLink } from "react-router-dom";
import ChartIcon from "../assets/chart";
import CubeIcon from "../assets/cube";
import Activity from "../assets/activity";
import HDI from "../assets/hd";

export default function Navbar() {
  return (
    <nav className="text-sm   top-0 bg-white border-gray-200 flex flex-row items-center justify- w-full min-h-10   flex-nowrap ">
      <div className="leftcontainer pl-5 w-full flex flex-row items-center gap-3">
        <div className="flex flex-row items-center">
          <CubeIcon size={34} color="blue" strokeWidth="1.5" />
          <p>PackageFlow</p>
        </div>

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex flex-row items-center border-gray-200 pl-2 pr-2 py-1 rounded-md hover:bg-blue-300 ${
              isActive && "bg-blue-300"
            }`
          }
        >
          <ChartIcon size={20} />
          Dashboard
        </NavLink>

        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-row items-center border-gray-200 pl-2 pr-2 py-1 rounded-md hover:bg-blue-300 ${
              isActive && "bg-blue-300"
            }`
          }
        >
          <CubeIcon size={24} />
          Package Status
        </NavLink>
        <NavLink
          to="/"
          className={`flex flex-row items-center border-gray-200 pl-2 pr-2 py-1 rounded-md hover:bg-blue-300 ${() =>
            isActive ? "bg-blue-300" : "bg-black"}`}
        >
          <Activity size={24} />
          Reports
        </NavLink>
        <NavLink
          to="/"
          className={`flex flex-row items-center border-gray-200 pl-2 pr-2 py-1 rounded-md hover:bg-blue-300 ${() =>
            isActive ? "bg-blue-300" : "bg-black"}`}
        >
          <HDI size={24} />
          Distribution
        </NavLink>
      </div>
      <div className="leftcontainer  flex flex-row items-center pr-10">
        <p>account</p>
      </div>
    </nav>
  );
}
