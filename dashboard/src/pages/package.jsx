import React from "react";
import { useState, useEffect } from "react";
import Passed from "../assets/passed.jsx";
import Failedr from "../assets/failedr.jsx";
import { Ci_check } from "../checkStatus/cibuild.jsx";
import Search from "../assets/searchi.jsx";
import Tabledata from "../components/tabledata.jsx";

export default function PackagePage() {
  const [data, setData] = useState(null);
  const [showdata, setshowdata] = useState(null);
  const [search, setSearch] = useState("");
  const [searchdata, setSearchdata] = useState(null);
  const [selectedItem, setSelect] = useState(null);
  const [searchKey, setSearchKey] = useState("packageName");
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

    const fetching = setInterval(() => {
      console.log("reload");
      fetch("http://localhost:3000/data")
        .then((response) => {
          return response.json();
          //  console.log(response)
        })
        .then((dataa) => {
          setData(dataa);
          // console.log(dataa);
        })
        .catch((error) => {
          console.log(error);
        });
    }, 100000);

    console.log("doing");
    return () => clearInterval(fetching);
    // fetch('http://localhost:3000/ci_check/packages').then(response=>{
    //   console.log(response)
    // }).catch(error=>{
    //   console.log(error)
    // })
  }, []);
  useEffect(() => {
    if (data && data.length > 0) {
      const filterdata = data.map((items, index) => {
        // console.log(items.distroSuccess);
        return {
          id: index + 1,
          packageName: items.packageName,
          packageOwner: items.owner,
          verification: items.verification,
          ciJob: items.ciJob,
          distrosucc: items.distroSuccess,
          distrofail: items.distroFailure,
          imageSize: items.imageSize,
          comment: items.comment,
        };
      });
      setshowdata(filterdata);
      setSearchdata(filterdata); // initially show all
    }
  }, [data]);

  /* useEffect(() => {
    if (search !== "") {
      const searchdata = showdata.filter((item) => {
        return item.packageName.toLowerCase().includes(search.toLowerCase());
      });
      setSearchdata(searchdata);
    } else {
      setSearchdata(showdata); // reset to full list if search is cleared
    }
  }, [search]);*/
  const headers = {
    "Package Name": "packageName",
    "Package Owner": "packageOwner",
    /*
    "Image Size": "imageSize",
    Comment: "comment",*/
  };

  useEffect(() => {
    if (search !== "") {
      const filtered = showdata.filter((item) => {
        const value = item[searchKey];
        return value?.toString().toLowerCase().includes(search.toLowerCase());
      });
      setSearchdata(filtered);
    } else {
      setSearchdata(showdata);
    }
  }, [search, searchKey, showdata]);

  return (
    <div className="relative main overflow-y-auto flex flex-col bg-white max-h-[85vh] m-5 mx-10 mb-10">
      <div className="flex flex-row items-center justify-between p-5 border-b-2 border-gray-200">
        <p className="text-lg font-semibold">All Packages</p>
        <div className="flex items-center bg-gray-200 rounded-xl overflow-hidden border border-gray-300">
          <select
            className="bg-gray-200 px-2 py-2 outline-none text-sm border-r border-gray-300"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          >
            {Object.entries(headers).map(([label, key]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          <div className="relative">
            <input
              type="text"
              placeholder={`Search by ${Object.keys(headers).find(
                (k) => headers[k] === searchKey
              )}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-gray-200 px-10 outline-none text-sm w-[250px]"
            />
            <Search className="relative left-3 top-2.5 text-gray-500 w-5 h-5" />
          </div>
        </div>
      </div>

      {/*<div className="relative main overflow-y-auto flex flex-col bg-white max-h-[85vh] m-5 mx-10 mb-10">
      {/* <ul>

        {
            data?data.map((items)=>{
                <li>items</li>
            }):<p>no data</p>
        }
        </ul> }
      <div className="flex  flex-row items-center justify-between p-5 border-gray-200 border-b-2">
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
      </div>*/}

      <div className="text-xs text-center flex flex-row items-center bg-gray-200 h-[6vh] justify-between py-5 px-4 font-semibold text-ellipsis">
        <div className="w-[0.5%]">Sr no.</div>
        <div className="w-[18%]">Package Name</div>
        <div className="w-[10%]">BI Build</div>
        <div className="w-[10%]">CI Build</div>
        <div className="w-[10%]">Image Build</div>
        <div className="w-[10%]">Binary Build</div>
        <div className="w-[8%]">Package Owner</div>
        <div className="w-[5%]">Image Size</div>
        <div className="w-[40%]">Comment</div>
      </div>
      <div className="content relative overflow-y-auto max-h-[70vh]">
        <div className="flex flex-col min-full w-full">
          {search === "" && showdata ? (
            showdata.map((items, index) => (
              <div
                key={items.id || index}
                className="text-sm text-center flex flex-row items-center bg-white h-[6vh] py-1 justify-between px-5 border-b"
              >
                {/* for now i have done same condition for ci and image after asking the proper critera make some changes */}
                <div className="w-[0.5%] ">{index + 1}</div>
                <div
                  className="cursor-pointer w-[18%]"
                  onClick={() => {
                    setSelect(items);
                  }}
                >
                  {items.packageName}
                </div>
                <div className="w-[10%]" style={{ height: "2vh" }}>
                  {items.distrofail === "" ? <Passed /> : <Failedr />}
                </div>
                <div className="w-[10%]">
                  {<Ci_check ciJob={items.ciJob} />}
                </div>
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
                <div className="w-[8%]">{items.packageOwner}</div>
                <div className="w-[5%] text-[2vh] leading-tight overflow-hidden">
                  {items.imageSize}
                </div>
                <div className="  break-word overflow-y-auto w w-[40%]  my-2  h-full text-[1.5vh] font-bold leading-tight">
                  {items.comment === "" || null ? "No Comment " : items.comment}
                </div>
              </div>
            ))
          ) : searchdata && searchdata.length > 0 ? (
            searchdata.map((items, index) => (
              <div
                key={items.id || index}
                className="text-sm text-center flex flex-row items-center bg-white h-[6vh] py-1 justify-between px-5 border-b"
              >
                {/* for now i have done same condition for ci and image after asking the proper critera make some changes */}
                <div className="w-[0.5%] ">{index + 1}</div>
                <div
                  className="cursor-pointer w-[18%]"
                  onClick={() => {
                    setSelect(items);
                  }}
                >
                  {items.packageName}
                </div>
                <div className="w-[10%]" style={{ height: "2vh" }}>
                  {items.distrofail === "" ? <Passed /> : <Failedr />}
                </div>
                <div className="w-[10%]">
                  {<Ci_check ciJob={items.ciJob} />}
                </div>
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
                <div className="w-[8%]">{items.packageOwner}</div>
                <div className="w-[5%] text-[2vh] leading-tight overflow-hidden">
                  {items.imageSize}
                </div>
                <div className="  break-word overflow-y-auto w w-[40%]  my-2  h-full text-[1.5vh] font-bold leading-tight">
                  {items.comment === "" || null ? "No Comment " : items.comment}
                </div>
              </div>
              /*<div
              key={items.id || index}
              className="text-sm text-center flex flex-row items-center bg-white h-[12vh] py-1 justify-between px-5 border-b"
            >
              {/* for now i have done same condition for ci and image after asking the proper critera make some changes 
              <div className="w-[6%]">{index + 1}</div>
              <div className="w-[18%]" onClick={()=>setSelect(items)}>{items.packageName}</div>
           
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
              <div className="w-[10%]">{items.packageOwner}</div>
              <div className="w-[10%] text-xs leading-tight">{items.imageSize}</div>
              <div className="  break-word overflow-y-auto w w-[30%] flex justify-center my-2 items-center h-full text-xs text-center text-align">{items.comment==="" ||  null?"No Comment ":items.comment}</div>
            </div>*/
            ))
          ) : (
            <div className="p-4 text-gray-500">No data found</div>
          )}
        </div>
      </div>

      {selectedItem && <Tabledata item={selectedItem} setSelect={setSelect} />}
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
