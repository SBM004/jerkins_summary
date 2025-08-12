import React, { useMemo } from "react";

const Tabledata = ({ item, setSelect }) => {
  const distrosSuc = (item.distrosucc || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const distrosFail = (item.distrofail || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const comment = item.comment;
  const packageName = item.packageName;

  const baseDistros = [
    "rh7.8",
    "rh7.9",
    "rh8.6",
    "rh8.7",
    "rh8.8",
    "rh8.9",
    "rh8.10",
    "rh9.0",
    "rh9.1",
    "rh9.2",
    "rh9.3",
    "rh9.4",
    "rh9.5",
    "sl12.5",
    "sl15.4",
    "sl15.5",
    "sl15.6",
    "ub18.04",
    "ub20.04",
    "ub22.04",
    "ub22.10",
    "ub23.04",
    "ub23.10",
    "ub24.04",
    "ub24.10",
    "ub25.04",
  ];

  const chunkArray = (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  const parseVersion = (distro) => {
    const match = distro.match(/^([a-zA-Z]+)([\d.]+)$/);
    if (!match) return { prefix: "", version: [Infinity] };
    const [, prefix, versionStr] = match;
    const version = versionStr.split(".").map((num) => parseInt(num, 10));
    return { prefix, version };
  };

  const allDistros = useMemo(() => {
    const allUsed = [
      ...new Set([...baseDistros, ...distrosSuc, ...distrosFail]),
    ];
    const groups = {
      rh: [],
      sl: [],
      ub: [],
      other: [],
    };

    for (const distro of allUsed) {
      const { prefix } = parseVersion(distro);
      if (groups[prefix]) {
        groups[prefix].push(distro);
      } else {
        groups.other.push(distro);
      }
    }

    // Sort within each group by version
    const versionSort = (a, b) => {
      const va = parseVersion(a).version;
      const vb = parseVersion(b).version;
      for (let i = 0; i < Math.max(va.length, vb.length); i++) {
        const numA = va[i] || 0;
        const numB = vb[i] || 0;
        if (numA !== numB) return numA - numB;
      }
      return 0;
    };

    groups.rh.sort(versionSort);
    groups.sl.sort(versionSort);
    groups.ub.sort(versionSort);
    groups.other.sort();

    const finalList = [
      ...groups.rh,
      ...groups.sl,
      ...groups.ub,
      ...groups.other,
    ];
    return chunkArray(finalList, 5);
  }, [item]);

  const getColor = (distro) => {
    if (distrosSuc.includes(distro)) return "bg-green-600 text-white";
    if (distrosFail.includes(distro)) return "bg-red-600 text-white";
    return "bg-gray-400 text-white";
  };

  return (
    <div className="absolute border-xl backdrop-blur-[2px] border-black min-h-full min-w-full">
      <div className="sticky flex flex-col  items-center border-black border-2 bg-white mx-auto rounded-2xl my-[3vh] md:max-w-[30rem] max-h-[70vh] p-10  gap-1 sm:max-w-[20rem]">
        <div className="PackageName border-2 border-black w-full text-center text-lg font-bold py-2 max-h-[8vh]">
          {packageName}
        </div>

        <div className="Comment border-2 border-black w-full text-sm text-center min-h-[10vh]  max-h-[10.5vh] overflow-y-scroll overflow-x-clip leading-tight">
          {comment || "No comment"}
        </div>

       <div className="DistroGrid w-full border-2 border-black p-2 overflow-y-scroll">
        <div className="grid grid-cols-5 gap-2 ">
            {allDistros.flat().map((distro, idx) => (
            <div
                key={idx}
                className={`rounded py-[0.5vh]  ${getColor(distro)} flex  text-xs text-center`}
            >
                <div className="w-full text-center">
                {distro}

                </div>
            </div>
            ))}
        </div>
        </div>
        <div className="">
        <button
          className=" border-2 border-black rounded-xl px-4 py-1 bg-white hover:bg-gray-100"
          onClick={() => setSelect(null)}
        >
          Cancel
        </button>
         </div>
      </div>
    </div>
  );
};

export default Tabledata;