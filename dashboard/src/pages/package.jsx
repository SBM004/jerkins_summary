import React from "react";
import { useState, useEffect } from "react";
import Passed from "../assets/passed.jsx";
import Failedr from "../assets/failedr.jsx";
import { Ci_check } from "../checkStatus/cibuild.jsx";
import Search from "../assets/searchi.jsx";

export default function PackagePage() {
  const [data, setData] = useState(null);
  const [showdata, setshowdata] = useState(null);
  const [search, setSearch] = useState("");
  const [searchdata, setSearchdata] = useState(null);
  useEffect(() => {
    fetch("http://localhost:3000/data")
      .then((response) => {
        return response.json();
        //  console.log(response)
      })
      .then((dataa) => {
        setData(dataa);
        console.log(dataa);
      })
      .catch((error) => {
        console.log(error);
      });

    // fetch('http://localhost:3000/ci_check/packages').then(response=>{
    //   console.log(response)
    // }).catch(error=>{
    //   console.log(error)
    // })
  }, []);
  useEffect(() => {
    if (data && data.length > 0) {
      const filterdata = data.map((items, index) => {
        return {
          id: index + 1,
          packageName: items.packageName,
          biBuild: "true",
          ciBuild: "true",
          imageBuild: "true",
          binaryBuild: "true",
          packageOwner: items.owner,
          verification: items.verification,
          ciJob: items.ciJob,
          distrosucc: items.distroSuccess,
          distrofail: items.distroFailure,
        };
      });
      setshowdata(filterdata);
      setSearchdata(filterdata); // initially show all
    }
  }, [data]);

  useEffect(() => {
    if (search !== "") {
      const searchdata = showdata.filter((item) => {
        return item.packageName.toLowerCase().includes(search.toLowerCase());
      });
      setSearchdata(searchdata);
    } else {
      setSearchdata(showdata); // reset to full list if search is cleared
    }
  }, [search]);

  return (
    <div className="flex flex-col bg-white h-[50vh] m-5 mx-10 mb-10">
      {/* <ul>

        {
            data?data.map((items)=>{
                <li>items</li>
            }):<p>no data</p>
        }
        </ul> */}
      <div className="flex flex-row items-center justify-between p-5 border-gray-200 border-b-2">
        <p>All Packages</p>
        <div className="relative">
          <input
            placeholder="search for package..."
            value={search}
            className="text-left rounded-xl bg-gray-200 border-gray-200 border-b-2 pl-10 pr-4"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
          <Search />
        </div>
      </div>

      <div className="text-xs text-center flex flex-row items-center bg-gray-200 h-[6vh] justify-between py-5 px-4 font-semibold text-ellipsis">
        <div className="w-[6%]">Sr no.</div>
        <div className="w-[19%]">Package Name</div>
        <div className="w-[10%]">BI Build</div>
        <div className="w-[10%]">CI Build</div>
        <div className="w-[10%]">Image Build</div>
        <div className="w-[10%]">Binary Build</div>
        <div className="w-[20%]">Package Owner</div>
      </div>

      <div className="flex flex-col h-full w-full">
        {search === "" && showdata ? (
          showdata.map((items, index) => (
            <div
              key={items.id || index}
              className="text-sm text-center flex flex-row items-center bg-white h-[10vh] py-5 justify-between px-4 border-b"
            >
              {/* for now i have done same condition for ci and image after asking the proper critera make some changes */}
              <div className="w-[6%]">{index + 1}</div>
              <div className="w-[19%]">{items.packageName}</div>
              <div className="w-[10%]" style={{ height: "2vh" }}>
                {items.distrofail === "" ? <Passed /> : <Failedr />}
              </div>
              <div className="w-[10%]">{<Ci_check ciJob={items.ciJob} />}</div>
              <div className="w-[10%]">
                {items.distrosucc.toLowerCase().includes("image") ? (
                  <Passed />
                ) : (
                  <Failedr />
                )}
              </div>
              <div className="w-[10%]" style={{ height: "2vh" }}>
                {items.distrofail === "" ? <Passed /> : <Failedr />}
              </div>
              <div className="w-[20%]">{items.packageOwner}</div>
            </div>
          ))
        ) : searchdata && searchdata.length > 0 ? (
          searchdata.map((items, index) => (
            <div
              key={items.id || index}
              className="text-sm text-center flex flex-row items-center bg-white h-[10vh] py-5 justify-between px-4 border-b"
            >
              <div className="w-[6%]">{index + 1}</div>
              <div className="w-[19%]">{items.packageName}</div>
              <div className="w-[10%]">{items.biBuild}</div>
              <div className="w-[10%]">{items.ciBuild}</div>
              <div className="w-[10%]">{items.imageBuild}</div>
              <div className="w-[10%]">{items.binaryBuild}</div>
              <div className="w-[20%]">{items.packageOwner}</div>
            </div>
          ))
        ) : (
          <div className="p-4 text-gray-500">No data found</div>
        )}
      </div>
    </div>
  );
}

// import React, { useState, useEffect } from 'react';

// export default function PackagePage() {
//   const [data, setData] = useState(null);
//   const [showdata, setShowdata] = useState(null);
//   const [searchdata, setSearchdata] = useState(null);
//   const [search, setSearch] = useState("");

//   // Fetching data
//   useEffect(() => {
//     fetch('/summary.json')
//       .then((response) => response.json())
//       .then((dataa) => setData(dataa))
//       .catch((error) => console.log(error));
//   }, []);

//   // Preparing mapped showdata
//   useEffect(() => {
//     if (data && data.length > 0) {
//       const filterdata = data.map((items, index) => ({
//         id: index + 1,
//         packageName: items.packageName,
//         biBuild: "true",
//         ciBuild: "true",
//         imageBuild: "true",
//         binaryBuild: "true",
//         packageOwner: items.owner
//       }));
//       setShowdata(filterdata);
//       setSearchdata(filterdata); // initially show all
//     }
//   }, [data]);

//   // Search filtering
//   useEffect(() => {
//     if (search !== "") {
//       const filtered = showdata?.filter((item) =>
//         item.packageName.toLowerCase().includes(search.toLowerCase())
//       );
//       setSearchdata(filtered);
//     } else {
//       setSearchdata(showdata); // reset to full list if search is cleared
//     }
//   }, [search, showdata]);

//   return (
//     <div className="flex flex-col bg-white h-[50vh] m-5 mb-10">
//       {/* Header + Search Input */}
//       <div className="flex flex-row items-center justify-between p-5 border-gray-200 border-b-2">
//         <p>All Packages</p>
//         <input
//           placeholder="Search package name"
//           value={search}
//           className="text-center rounded-xl bg-gray-200 border-gray-200 border-b-2 px-3 py-1"
//           onChange={(e) => setSearch(e.target.value)}
//         />
//       </div>

//       {/* Table Headers */}
//       <div className="text-xs text-center flex flex-row items-center bg-gray-200 h-[6vh] justify-between py-5 px-4 font-semibold text-ellipsis">
//         <div className="w-[6%]">Sr no.</div>
//         <div className="w-[19%]">Package Name</div>
//         <div className="w-[10%]">BI Build</div>
//         <div className="w-[10%]">CI Build</div>
//         <div className="w-[10%]">Image Build</div>
//         <div className="w-[10%]">Binary Build</div>
//         <div className="w-[20%]">Package Owner</div>
//       </div>

//       {/* Table Rows */}
//       <div className="flex flex-col h-full w-full">
//         {searchdata && searchdata.length > 0 ? (
//           searchdata.map((items, index) => (
//             <div
//               key={items.id || index}
//               className="text-sm text-center flex flex-row items-center bg-white h-[10vh] py-5 justify-between px-4 border-b"
//             >
//               <div className="w-[6%]">{index + 1}</div>
//               <div className="w-[19%]">{items.packageName}</div>
//               <div className="w-[10%]">{items.biBuild}</div>
//               <div className="w-[10%]">{items.ciBuild}</div>
//               <div className="w-[10%]">{items.imageBuild}</div>
//               <div className="w-[10%]">{items.binaryBuild}</div>
//               <div className="w-[20%]">{items.packageOwner}</div>
//             </div>
//           ))
//         ) : (
//           <div className="p-4 text-gray-500 text-center">No matching packages found</div>
//         )}
//       </div>
//     </div>
//   );
// }
