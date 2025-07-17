

// const express = require('express');  // ✅ Optional here, not needed unless using Router

// const ci_check = (req, res) => {
//   try {
//     const data = req.body.cijobs;  // ✅ Use `const` and always check if req.body exists

//     if (!data || data.length === 0) {
//       console.log("No CI jobs found");
//       return res.status(200).json({ status: "failed" });  // ✅ Send JSON consistently
//     }

//     console.log("CI Jobs received:", data);  // 🔍 Optional for debug
//     return res.status(200).json({ status: "received", length: data.length });
//   } catch (err) {
//     console.error("Error in ci_check:", err);
//     return res.status(500).json({ status: "error", message: "Internal server error" });
//   }
// };



// module.exports = ci_check;


import express from 'express';
//import React, { useEffect, useState } from "react";
//import Passed from "../assets/passed.jsx";
//import Failedr from "../assets/failedr.jsx";
// const fetch = require('node-fetch');
import { URL } from 'url';
console.log(typeof(fetch))
//console.log("Received body:", req.body);
// CI domain to platform mapping
const ciDomainMap = {
  "github.com": "github",
  "app.circleci.com": "circleci",
  "ci-hadoop.apache.org": "jenkins",
  "ci-builds.apache.org": "jenkins",
  "ci-couchdb.apache.org": "jenkins",
  "ci-hbase.apache.org": "jenkins",
  "tigera.semaphoreci.com": "semaphore",
  "ci.hibernate.org": "jenkins",
  "buildbot.mariadb.org": "buildbot",
  "buildbot.python.org": "buildbot",
  "ci.jenkins.io": "jenkins",
  "ci.wildfly.org": "jenkins",
  "app.travis-ci.com": "travis",
  "prow.k8s.io": "prow",
  "testgrid.k8s.io": "testgrid"
};

// CI-specific handlers
const ciHandlers = {
//   async github(url) {
//     try {
//     //   const match = url.match(/github\.com\/([^/]+\/[^/]+)/);
//       const match = url.match(/^https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/actions(?:\/workflows\/([^\/]+\.ya?ml))?$/);
//       if (!match) return "Invalid GitHub URL";
//       const api = `https://api.github.com/${match[1]}/actions/runs`;
//       const res = await fetch(api);
//       const data = await res.json();
//       return data.workflow_runs?.[0]?.conclusion || "Unknown";
//     } catch (err) {
//       return "GitHub Error: " + err.message;
//     }
//   }






// async github(url) {
//     try {
//          const match = url.match(/^https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/actions(?:\/workflows\/([^\/]+\.ya?ml))?$/);
//         if (!match) return "Invalid GitHub URL";
        
//         const owner = match[1];
//         const repo = match[2];
//         const workflow = match[3]; // This captures the .yml file name
        
//         // API URL - NO workflow file in the path!
//         const api = `https://api.github.com/repos/${owner}/${repo}/actions/runs`;
//         console.log("API URL:", api);
        
//         const res = await fetch(api, {
//             headers: {
//                 'User-Agent': 'CI-Status-Checker',
//                 'Accept': 'application/vnd.github.v3+json'
//             }
//         });
        
//         if (!res.ok) {
//             return `GitHub API Error: ${res.status} ${res.statusText}`;
//         }
        
//         const data = await res.json();
//         return data.workflow_runs?.[0]?.conclusion || "Unknown";
//     } catch (err) {
//         return "GitHub Error: " + err.message;
//     }
// }

async  github(url) {
    try {
        const match = url.match(/^https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/actions(?:\/workflows\/([^\/]+\.ya?ml))?$/);
        if (!match) return "Invalid GitHub URL";

        const owner = match[1];             
        const repo = match[2];
        const workflow = match[3]; // Optional

        const api = `https://api.github.com/repos/${owner}/${repo}/actions/runs`;
        console.log("API URL:", api);

        const headers = {
            'User-Agent': 'CI-Status-Checker',
            'Accept': 'application/vnd.github.v3+json',
        };

        // Add Authorization header if token is set
        if (process.env.GITHUB_TOKEN) {
            headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
        }

        const res = await fetch(api, { headers });

        if (!res.ok) {
            return `GitHub API Error: ${res.status} ${res.statusText}`;
        }

        const data = await res.json();
        console.log(data.workflow_runs[0]);
        return data.workflow_runs?.[0]?.conclusion || "Unknown";
    } catch (err) {
        return "GitHub Error: " + err.message;
    }
}



,

  async circleci(url) {
    try {
      const match = url.match(/github\/([^/]+\/[^/]+)/);
      if (!match) return "Invalid CircleCI URL";
      const api = `https://circleci.com/api/v2/project/github/${match[1]}/pipeline`;
      const res = await fetch(api);
      const data = await res.json();
      return data.items?.[0]?.status || "Unknown";
    } catch (err) {
      return "CircleCI Error: " + err.message;
    }
  },

  async jenkins(url) {
    /* 
    try {
      //jobUrl ="https://ibmz-ci.osuosl.org/job/TensorFlow_IBMZ_CI/";
      const apiUrl = `${jobUrl}api/json?tree=color,lastBuild[result,number,timestamp]`
      //const apiUrl = "https://ci-couchdb.apache.org/job/jenkins-cm1/job/FullPlatformMatrix/job/main/api/json?tree=color,lastBuild[result,number,timestamp]";
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return data.color.includes('blue')? "success" : "failed";
      /*const response = await fetch('/jenkins/job/zookeeper-multi-branch-build-s390x/job/master/api/json?tree=color,lastBuild[result,number,timestamp]', {
        method: 'GET',
      })
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      return data.color.includes('red')? "success" : "failed";
    } catch (error) {
      console.error("Error checking CI job status:", error);
      return "failed";
    }
    */
    try {
      //const apiUrl = `${url.replace(/\/$/, "")}/api/json?tree=color,lastBuild[result,number,timestamp]`;
      console.log("Url from jenkins: ", url);
      const apiUrl = `${url}/api/json?tree=color,lastBuild[result,number,timestamp]`;
      //const res = await fetch(api);
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await res.json();
       return data.color && data.color.includes("blue") ? "success" : "failed";
    } catch (error) {
      console.error("Error checking CI job status:", error);
      return "failed";
    }
  },

  async buildbot(url) {
    try {
      const api = `${url.replace(/\/$/, "")}/json`;
      const res = await fetch(api);
      const data = await res.json();
      return data.builders ? "Buildbot OK" : "Unknown Buildbot status";
    } catch (err) {
      return "Buildbot Error: " + err.message;
    }
  },

  async unknown() {
    return "Unsupported CI platform";
  }
};

// Helper to detect platform
function getCITypeFromURL(url) {
  try {
    const domain = new URL(url).hostname;
    return ciDomainMap[domain] || "unknown";
  } catch {
    return "unknown";
  }
}

// Main controller for one CI job
const ci_check = async (req, res) => {
  try {
    const jobUrl = req.body.cijob;

    if (!jobUrl) {
      return res.status(400).json({ status: "failed", message: "CI job URL is required" });
    }

    const platform = getCITypeFromURL(jobUrl);
    const handler = ciHandlers[platform] || ciHandlers.unknown;
    const status = await handler(jobUrl);

    return res.status(200).json({ url: jobUrl, platform, status });
  } catch (err) {
    console.error("Error in ci_check:", err);
    return res.status(500).json({ status: "error", message: "Internal server error" });
  }
};/*
export const ci_check = ({ ciJob }) => {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!ciJob || ciJob.trim() === "") {
      setStatus("failed");
      return;
    }

    const fetchStatus = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/ci", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ciJob }), // 👈 Must match backend
        });

        const data = await response.json();
        console.log("CI Response:", data);

        if (data.status === "failed") {
          setStatus("failed");
        } else {
          setStatus("passed");
        }
      } catch (error) {
        console.error("Error fetching CI status:", error);
        setStatus("failed");
      }
    };

    fetchStatus();
  }, [ciJob]);

  if (status === "loading") return <div>Checking...</div>;
  if (status === "passed") return <Passed />;
  return <Failedr />;
};*/

//module.exports = ci_check;
export default ci_check;
