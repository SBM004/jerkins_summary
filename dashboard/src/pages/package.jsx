import React from 'react';
import {useState,useEffect} from 'react';

export default function PackagePage() {
    const [data,setData]=useState(null);
    useEffect(()=>{
        fetch('/summary.json').then((response)=>{
            return response.json();
        }).then((dataa)=>{
            setData(dataa)
        }).catch((error)=>{console.log(error)})
    },[])
    return (
        <div className="flex flex-col bg-white h-[50vh] m-5">
        {/* <ul>

        {
            data?data.map((items)=>{
                <li>items</li>
            }):<p>no data</p>
        }
        </ul> */}
        <div className="flex flex-row items-center justify-between p-5 border-gray-200 border-b-2">
            <p>All Packages</p>
            <input placeholder="search" className=" text-center rounded-xl bg-gray-200 border-gray-200 border-b-2 "></input>
        </div>
        <div className="text-sm flex flex-row items-center bg-gray-100 h-[6vh] justify-around ">
            <div>Sr no.</div>
            <div>Package Name </div>
            <div>BI Build</div>
            <div>CI Build</div>
            <div>Image Build</div>
            <div>Binary Build</div>
            <div>Package Owner</div>

        </div>
        <div className="flex flex-col h-full">
            
            {
                data?data.map((items,index)=>{
                    <div key={items.id} className="text-sm flex flex-row items-center bg-gray-100 h-[5vh] justify-around ">
                    <p>{items.id}</p>
                    <p>{items.packageName}</p>
                    <p>{items.packageName}</p>
                    </div>        
                }):<div>no data found</div>
            }
        
        </div>

        
        </div>
    );
}