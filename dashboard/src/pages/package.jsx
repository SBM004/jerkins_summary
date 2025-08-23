import React from "react";
import { useState, useEffect, useMemo } from "react";
import Passed from "../assets/passed.jsx";
import Failedr from "../assets/failedr.jsx";
import { Ci_check } from "../checkStatus/cibuild.jsx";
import Search from "../assets/searchi.jsx";
import Tabledata from "../components/tabledata.jsx";
import { getBuildStatus } from "../utils/getBuildStatus.js";
import Empty from "../assets/empty.jsx";
import Broken from "../assets/broken.jsx";
import "./package.css";

export default function PackagePage() {
  const [data, setData] = useState(null);
  const [showdata, setshowdata] = useState(null);
  const [search, setSearch] = useState("");
  const [searchdata, setSearchdata] = useState(null);
  const [selectedItem, setSelect] = useState(null);
  const [searchKey, setSearchKey] = useState("packageName");
  const [biFilter, setBiFilter] = useState("all");
  const [ciFilter, setCiFilter] = useState("all");
  const [imageFilter, setImageFilter] = useState("all");
  const [binaryFilter, setBinaryFilter] = useState("all");
  const [dockerFilter, setDockerFilter] = useState("all");
  const [ciStatusMap, setCiStatusMap] = useState({});
  // State for modal and comment editing
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentPackage, setCommentPackage] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [buildType, setBuildType] = useState("BI Build");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 3;

  const [brokenStates, setBrokenStates] = useState({
    biBroken: false,
    ciBroken: false,
    imageBroken: false,
    binaryBroken: false,
    dockerBroken: false,
  });

  // Add this function at the top of your component
  const computeLatestComment = (pkg) => {
    const comments = Object.values(pkg.comments || {})
      .flat()
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    if (!comments.length) return "";
    const latest = comments[0];
    const buildTypeKey = Object.entries(pkg.comments || {}).find(([key, arr]) =>
      arr.some((c) => c.timestamp === latest.timestamp)
    )?.[0];
    const latestText = latest?.text || latest?.comment || "";
    return buildTypeKey ? `${buildTypeKey}: ${latestText}` : latestText;
  };

  useEffect(() => {
    fetch("http://localhost:3000/data/packages")
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
      fetch("http://localhost:3000/data/packages")
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
      const filterdata = data.map((items, index) => ({
        id: index + 1,
        packageName: items.packageName,
        packageOwner: items.owner,
        verification: items.verification,
        ciJob: items.ciJob,
        distrosucc: items.distroSuccess,
        distrofail: items.distroFailure,
        imageSize: items.imageSize,
        comment: items.comment,
        _id: items._id,
        biBroken: items.biBroken,
        dockerBroken: items.dockerBroken,
        imageBroken: items.imageBroken,
        binaryBroken: items.binaryBroken,
        ciBroken: items.ciBroken,
        latest_comment: computeLatestComment(items), // <-- Add this
      }));
      setshowdata(filterdata);
      setSearchdata(filterdata);
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

  /*async function sendStatusToServer(packageName, type, status) {
    try {
      await fetch("http://localhost:3000/api/build-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageName, type, status }),
      });
    } catch (err) {
      console.error("Error sending status to server:", err);
    }
  }*/

  // Fetch statuses only when data is loaded
  useEffect(() => {
    async function fetchStatuses() {
      const res = await fetch("http://localhost:3000/api/build-status");
      const statuses = await res.json();
      setshowdata((prev) =>
        prev.map((item) => ({
          ...item,
          ...statuses[item.packageName], // merge statuses by packageName
        }))
      );
    }
    if (showdata) fetchStatuses();
    // Only run when showdata is first set, not on every change
    // eslint-disable-next-line
  }, [showdata]);

  function matchesFilter(item, type, filter) {
    // Handle "broken" filter for each build type
    if (filter === "broken") {
      if (type === "bi") return item.biBroken;
      if (type === "ci") return item.ciBroken;
      if (type === "image") return item.imageBroken;
      if (type === "binary") return item.binaryBroken;
      if (type === "docker") return item.dockerBroken;
    }

    let status;
    if (type === "ci") {
      status = ciStatusMap[item.packageName];
      // Treat "notfound" as "failed" for filtering
      if (status === "notfound") status = "failed";
    } else {
      status = getBuildStatus(type, item);
    }
    if (filter === "all") return true;
    if (filter === "empty") return status === "empty";
    if (filter === "cancel") return status === "cancel";
    return status === filter;
  }

  // Memoized filtered data based on search and all build filters
  const filteredData = useMemo(() => {
    const baseData = search === "" && showdata ? showdata : searchdata || [];
    return baseData.filter(
      (item) =>
        matchesFilter(item, "bi", biFilter) &&
        matchesFilter(item, "ci", ciFilter) &&
        matchesFilter(item, "image", imageFilter) &&
        matchesFilter(item, "binary", binaryFilter) &&
        matchesFilter(item, "docker", dockerFilter)
    );
  }, [
    showdata,
    searchdata,
    search,
    biFilter,
    ciFilter,
    imageFilter,
    binaryFilter,
    ciStatusMap, // <-- add this
  ]);

  // Compute comment history for the selected package
  const commentHistory = useMemo(() => {
    if (!commentPackage) return [];

    // Convert the existing comments from the package
    const packageComments = Object.entries(commentPackage.comments || {})
      .flatMap(([type, list]) =>
        (list || []).map((c) => ({
          ...c,
          type,
          timestamp: c.timestamp || c.date,
        }))
      )
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Extract DB comment if available
    let dbComment = [];
    if (commentPackage.comment && commentPackage.comment.trim() !== "") {
      const currentYear = new Date().getFullYear();
      const datePart = commentPackage.comment.substring(0, 5); // e.g. "08/23"
      console.log("Comment package: ", commentPackage);
      let parsedDate = new Date(0); // fallback
      if (/^\d{2}\/\d{2}$/.test(datePart)) {
        const [month, day] = datePart.split("/").map(Number);
        parsedDate = new Date(currentYear, month - 1, day);
      }

      dbComment = [
        {
          type: "Initial", // or "DB Comment"
          text: commentPackage.comment,
          timestamp: commentPackage.createdAt || parsedDate,
          user: commentPackage.owner || "Current User",
        },
      ];
    }

    // Place DB comment as the oldest entry
    return [...dbComment, ...packageComments];
  }, [commentPackage]);

  const paginatedComments = commentHistory.slice(
    (currentPage - 1) * commentsPerPage,
    currentPage * commentsPerPage
  );
  const totalPages = Math.ceil(commentHistory.length / commentsPerPage);

  // Double-click handler for comment cell
  function handleCommentDoubleClick(pkg) {
    fetch(`http://localhost:3000/data/packages/${pkg._id}`)
      .then((res) => res.json())
      .then((freshPkg) => {
        setCommentPackage(freshPkg);
        setShowCommentModal(true);
        setNewComment("");
        setBuildType("BI Build");
        setEditingIndex(null);
        setEditingText("");
        setCurrentPage(1);
        setBrokenStates({
          biBroken: freshPkg.biBroken ?? false,
          dockerBroken: freshPkg.dockerBroken ?? false,
          imageBroken: freshPkg.imageBroken ?? false,
          binaryBroken: freshPkg.binaryBroken ?? false,
          ciBroken: freshPkg.ciBroken ?? false,
        });
      });
  }

  // Add comment handler
  const handleAddComment = async () => {
    if (!newComment.trim() || !commentPackage) return;
    const id = commentPackage._id;
    const normalizedType = buildType.replace(" Build", "");
    try {
      await fetch(`http://localhost:3000/data/packages/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ buildType: normalizedType, text: newComment }),
      });
      setNewComment("");
      // Refresh package data
      const updated = await fetch(
        `http://localhost:3000/data/packages/${id}`
      ).then((r) => r.json());
      setCommentPackage(updated);
      setshowdata((prev) =>
        prev.map((item) =>
          item._id === id
            ? { ...item, latest_comment: computeLatestComment(updated) }
            : item
        )
      );
    } catch (err) {
      console.error("Add comment failed", err);
    }
  };

  // Edit comment handlers
  const handleEdit = (paginatedIdx) => {
    const globalIdx = (currentPage - 1) * commentsPerPage + paginatedIdx;
    setEditingIndex(globalIdx);
    setEditingText(commentHistory[globalIdx].text);
  };

  const handleSave = async (paginatedIdx) => {
    const globalIdx = (currentPage - 1) * commentsPerPage + paginatedIdx;
    const comment = commentHistory[globalIdx];
    if (!comment) return;
    const payload = {
      type: comment.type,
      text: editingText,
      timestamp: comment.timestamp,
    };
    try {
      await fetch(
        `http://localhost:3000/data/packages/${commentPackage._id}/comments/edit`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      setEditingIndex(null);
      setEditingText("");
      // Refresh package data
      const updated = await fetch(
        `http://localhost:3000/data/packages/${commentPackage._id}`
      ).then((r) => r.json());
      setCommentPackage(updated);
      setshowdata((prev) =>
        prev.map((item) =>
          item._id === commentPackage._id
            ? { ...item, latest_comment: computeLatestComment(updated) }
            : item
        )
      );
    } catch (err) {
      console.error("Edit comment failed", err);
    }
  };

  // Delete comment handler
  const handleDelete = async (paginatedIdx) => {
    const globalIdx = (currentPage - 1) * commentsPerPage + paginatedIdx;
    const comment = commentHistory[globalIdx];
    if (!comment) return;
    const payload = { type: comment.type, timestamp: comment.timestamp };
    try {
      await fetch(
        `http://localhost:3000/data/packages/${commentPackage._id}/comments/delete`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      // Refresh package data
      const updated = await fetch(
        `http://localhost:3000/data/packages/${commentPackage._id}`
      ).then((r) => r.json());
      setCommentPackage(updated);
      setshowdata((prev) =>
        prev.map((item) =>
          item._id === commentPackage._id
            ? { ...item, latest_comment: computeLatestComment(updated) }
            : item
        )
      );
    } catch (err) {
      console.error("Delete comment failed", err);
    }
  };

  return (
    <div className="relative main overflow-y-auto flex flex-col bg-white max-h-[85vh] m-5 mx-10 mb-10 rounded-sm">
      <div className="flex flex-row items-center justify-between p-5 py-3 border-b-2 border-gray-200">
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

      <div className="flex flex-row gap-4 px-5 py-1 bg-gray-50 border-b border-gray-200 justify-end items-center">
        <div>
          <label className="mr-1 font-semibold">BI:</label>
          <select
            value={biFilter}
            onChange={(e) => setBiFilter(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="all">All</option>
            <option value="passed">Passed</option>
            <option value="failed">Failed</option>
            <option value="empty">Empty</option>
            <option value="unknown">Unknown</option>
            <option value="running">Running</option>
            <option value="broken">Broken</option>
          </select>
        </div>
        <div>
          <label className="mr-1 font-semibold">CI:</label>
          <select
            value={ciFilter}
            onChange={(e) => setCiFilter(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="all">All</option>
            <option value="passed">Passed</option>
            <option value="failed">Failed</option>
            <option value="empty">Empty</option>
            <option value="cancel">Cancelled</option>
            <option value="unknown">Unknown</option>
            <option value="running">Running</option>
            <option value="broken">Broken</option>
          </select>
        </div>
        <div>
          <label className="mr-1 font-semibold">Image:</label>
          <select
            value={imageFilter}
            onChange={(e) => setImageFilter(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="all">All</option>
            <option value="passed">Passed</option>
            <option value="failed">Failed</option>
            <option value="empty">Empty</option>
            <option value="unknown">Unknown</option>
            <option value="running">Running</option>
            <option value="broken">Broken</option>
          </select>
        </div>
        <div>
          <label className="mr-1 font-semibold">Binary:</label>
          <select
            value={binaryFilter}
            onChange={(e) => setBinaryFilter(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="all">All</option>
            <option value="passed">Passed</option>
            <option value="failed">Failed</option>
            <option value="empty">Empty</option>
            <option value="unknown">Unknown</option>
            <option value="running">Running</option>
            <option value="broken">Broken</option>
          </select>
        </div>
        <div>
          <label className="mr-1 font-semibold">Docker:</label>
          <select
            value={dockerFilter}
            onChange={(e) => setDockerFilter(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="all">All</option>
            <option value="passed">Passed</option>
            <option value="failed">Failed</option>
            <option value="empty">Empty</option>
            <option value="unknown">Unknown</option>
            <option value="running">Running</option>
            <option value="broken">Broken</option>
          </select>
        </div>
      </div>

      <div className="text-xs text-center flex flex-row items-center bg-gray-200 h-[6vh] justify-between py-5 px-9 font-semibold text-ellipsis">
        <div className="w-[0.5%]">Sr no.</div>
        <div className="w-[18%]">Package Name</div>
        <div className="w-[10%]">BI Build</div>
        <div className="w-[10%]">CI Build</div>
        <div className="w-[10%]">Image Build</div>
        <div className="w-[10%]">Binary Build</div>
        <div className="w-[10%]">Docker Build</div>
        <div className="w-[8%]">Package Owner</div>
        <div className="w-[6%]">Image Size</div>
        <div className="w-[42%]">Comment</div>
      </div>
      <div className="content relative overflow-y-auto max-h-[70vh]">
        <div className="flex flex-col min-full w-full">
          {filteredData.length > 0 ? (
            filteredData.map((items, index) => (
              <div
                key={items.packageName}
                //key={items.id || index}
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
                  {items.biBroken ? (
                    <Broken />
                  ) : getBuildStatus("bi", items) === "passed" ? (
                    <Passed />
                  ) : (
                    <Failedr />
                  )}
                </div>
                <div className="w-[10%]">
                  {items.ciBroken ? (
                    <Broken />
                  ) : (
                    <Ci_check
                      ciJob={items.ciJob}
                      onStatus={(status) => {
                        setCiStatusMap((prev) => {
                          if (prev[items.packageName] === status) return prev; // No change, no update
                          return {
                            ...prev,
                            [items.packageName]: status,
                          };
                        });
                      }}
                    />
                  )}
                </div>
                <div className="w-[10%]">
                  {items.imageBroken ? (
                    <Broken />
                  ) : getBuildStatus("image", items) === "passed" ? (
                    <Passed />
                  ) : (
                    <Failedr />
                  )}
                </div>
                <div className="w-[10%]" style={{ height: "2vh" }}>
                  {items.binaryBroken ? (
                    <Broken />
                  ) : getBuildStatus("binary", items) === "passed" ? (
                    <Passed />
                  ) : (
                    <Failedr />
                  )}
                </div>
                <div className="w-[10%]" style={{ height: "2vh" }}>
                  {items.dockerBroken ? (
                    <Broken />
                  ) : getBuildStatus("docker", items) === "passed" ? (
                    <Passed />
                  ) : getBuildStatus("docker", items) === "failed" ? (
                    <Failedr />
                  ) : (
                    <Empty />
                  )}
                </div>
                {/*<div className="w-[10%]" style={{ height: "2vh" }}>
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
                </div>*/}
                <div className="w-[9%]">{items.packageOwner}</div>
                <div className="w-[3%] text-[2vh] overflow-auto whitespace-nowrap">
                  {items.imageSize}
                </div>
                <div
                  className="ml-2 overflow-y-auto overflow-x-hidden w-[40%] h-full text-[1.5vh] font-bold leading-tight cursor-pointer"
                  style={{
                    maxHeight: "6em", // 3 lines approx
                    lineHeight: "1.2em", // row height
                    wordBreak: "break-word", // wrap long words
                    whiteSpace: "normal", // allow multi-line
                  }}
                  onDoubleClick={() => handleCommentDoubleClick(items)}
                >
                  {/*console.log(
                    " items ",
                    items,
                    " comment: ",
                    items.comment,
                    " latest_comment: ",
                    items.latest_comment
                  )*/}
                  {items.latest_comment === "" || null
                    ? items.comment === "" || null
                      ? "No Comment"
                      : items.comment
                    : items.latest_comment}
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-gray-500">No data found</div>
          )}
        </div>
      </div>

      {selectedItem && <Tabledata item={selectedItem} setSelect={setSelect} />}

      {showCommentModal && commentPackage && (
        <div className="modal-overlay">
          <div
            className="modal"
            style={{ maxWidth: "800px", minWidth: "350px", padding: "24px" }}
          >
            <div className="modal-header">
              <h2>{commentPackage.packageName} - Details</h2>
              <button
                className="close-btn"
                onClick={() => setShowCommentModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-content">
              <div className="add-comment-section">
                <h3>Add New Comment</h3>
                <div className="form-group">
                  <label>Build Type</label>
                  <select
                    value={buildType}
                    onChange={(e) => setBuildType(e.target.value)}
                    className="select-input"
                  >
                    <option>BI Build</option>
                    <option>CI Build</option>
                    <option>Image Build</option>
                    <option>Binary Build</option>
                    <option>Docker Build</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Comment</label>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Enter your comment..."
                    className="comment-textarea"
                  />
                </div>
                <button className="add-comment-btn" onClick={handleAddComment}>
                  Add Comment
                </button>
              </div>

              {/* --- Insert the Broken States section here --- */}
              <div className="broken-states" style={{ marginTop: "24px" }}>
                <h3>Broken States</h3>
                <div className="checkboxes-horizontal">
                  {Object.entries(brokenStates).map(([key, val]) => (
                    <label key={key} style={{ marginRight: 12 }}>
                      <input
                        type="checkbox"
                        checked={val}
                        onChange={async () => {
                          const updatedState = !val;
                          setBrokenStates((prev) => ({
                            ...prev,
                            [key]: updatedState,
                          }));
                          // Update backend
                          await fetch(
                            `http://localhost:3000/data/packages/${commentPackage._id}/broken-state`,
                            {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ [key]: updatedState }),
                            }
                          );
                          // Optionally update showdata for main table
                          setshowdata((prev) =>
                            prev.map((item) =>
                              item._id === commentPackage._id
                                ? { ...item, [key]: updatedState }
                                : item
                            )
                          );
                        }}
                      />{" "}
                      {key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (s) => s.toUpperCase())}
                    </label>
                  ))}
                </div>
              </div>
              {/* --- End Broken States section --- */}

              <div className="comment-history" style={{ marginTop: "32px" }}>
                <h3>Comment History</h3>
                <table className="comment-history-table">
                  <thead>
                    <tr>
                      <th>TYPE</th>
                      <th>DATE</th>
                      <th>COMMENT</th>
                      <th>AUTHOR</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedComments.map((comment, paginatedIdx) => (
                      <tr key={comment.timestamp + String(paginatedIdx)}>
                        <td>{comment.type}</td>
                        <td>{new Date(comment.timestamp).toLocaleString()}</td>
                        <td>
                          {editingIndex ===
                          (currentPage - 1) * commentsPerPage + paginatedIdx ? (
                            <input
                              type="text"
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                            />
                          ) : (
                            comment.text
                          )}
                        </td>
                        <td>{comment.user || "System"}</td>
                        <td>
                          <div className="flex gap-2 mt-1">
                            {editingIndex ===
                            (currentPage - 1) * commentsPerPage +
                              paginatedIdx ? (
                              <button
                                onClick={() => handleSave(paginatedIdx)}
                                className="px-3 py-1 bg-green-500 text-gray rounded-lg text-sm font-medium hover:bg-green-600 hover:text-white transition"
                              >
                                Save
                              </button>
                            ) : (
                              <button
                                onClick={() => handleEdit(paginatedIdx)}
                                className="px-3 py-1 bg-blue-500 text-gray rounded-lg text-sm font-medium hover:bg-blue-600 hover:text-white transition"
                              >
                                Edit
                              </button>
                            )}

                            <button
                              onClick={() => handleDelete(paginatedIdx)}
                              className="px-3 py-1 bg-red-500 text-gray rounded-lg text-sm font-medium hover:bg-red-600 hover:text-white transition"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {totalPages > 1 && (
                  <div className="pagination">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i}
                        className={i + 1 === currentPage ? "active" : ""}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
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
