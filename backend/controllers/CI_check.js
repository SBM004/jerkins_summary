

import express from 'express';
//import axios from 'axios';
//import https from 'https';
import { URL } from 'url'; // Import the Storage class
import path from 'path'; // For resolving service account key path
import { fileURLToPath } from 'url'; // For ES Modules to get __dirname equivalent

// For ES Modules, to get __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)
//import React, { useEffect, useState } from "react";
//import Passed from "../assets/passed.jsx";
//import Failedr from "../assets/failedr.jsx";
// const fetch = require('node-fetch');
console.log(typeof (fetch))
// --- Google Cloud Storage Setup ---
// Path to your service account key file.
// It's best practice to set this as an environment variable in production:
// e.g., GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/key.json
//const serviceAccountKeyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || path.join(__dirname, 'internship-test-466706-86a2f2b73c99.json');

let storageInstance = null;

// Function to allow server.js to set the storage instance
export const setStorageInstance = (instance) => {
    storageInstance = instance;
    console.log("GCS Storage instance set in CI_check.js handler.");
};

/*let storage;
try {
    // Initialize Google Cloud Storage client with the service account key
    storage = new Storage({
        keyFilename: serviceAccountKeyPath,
    });
    console.log('Google Cloud Storage client initialized successfully.');
} catch (error) {
    console.error('Failed to initialize Google Cloud Storage client:', error.message);
    console.error('Please ensure your service account key file path is correct and accessible.');
    // In a real application, you might want to gracefully handle this
    // or log and prevent the server from starting if GCS is critical.
    // For now, we'll let it proceed, but GCS-related handlers will fail.
}*/
//console.log("Received body:", req.body);
// CI domain to platform mapping
const ciDomainMap = {
    "github.com": "github",
    "app.circleci.com": "circleci",
    "ci-hadoop.apache.org": "jenkins",
    "ci-builds.apache.org": "jenkins",
    "ci-couchdb.apache.org": "jenkins",
    "ci-hbase.apache.org": "jenkins",
    "ibmz-ci.osuosl.org": "jenkins",
    "tigera.semaphoreci.com": "semaphore",
    "ci.hibernate.org": "jenkins",
    "buildbot.mariadb.org": "buildbot",
    "buildbot.python.org": "buildbot",
    "ci.jenkins.io": "jenkins",
    //"ci.wildfly.org": "jenkins",
    "app.travis-ci.com": "travis",
    "build.gluster.org": "jenkins",
    "prow.k8s.io": "prow",
    "testgrid.k8s.io": "testgrid",

    "buildfarm.postgresql.org": "buildfarm",
    "buildfarm.openssl.org": "buildfarm",
    "buildfarm2.postgresql.org": "buildfarm",
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

    async github(url) {
        try {
            const match = url.match(/^https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/actions(?:\/workflows\/([^\/]+\.ya?ml))?$/);
            if (!match) return "Invalid GitHub URL";

            const owner = match[1];
            const repo = match[2];
            const workflow = match[3]; // Optional

            const api = `https://api.github.com/repos/${owner}/${repo}/actions/runs`;
            // console.log("API URL:", api);

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
            // console.log(data.workflow_runs[0]);
            return data.workflow_runs?.[0]?.conclusion || "unknown";
        } catch (err) {
            return "GitHub Error: " + err.message;
        }
    }



    ,

    async circleci(url) {
        try {
            const match = url.match(/^https:\/\/app\.circleci\.com\/pipelines\/github\/([^\/]+)\/([^\/]+)/);
            if (!match) return { error: "Invalid CircleCI URL" };

            const owner = match[1];
            const repo = match[2];
            const pipelineUrl = `https://circleci.com/api/v2/project/github/${owner}/${repo}/pipeline`;

            const headers = {
                "Circle-Token": process.env.CIRCLECI_TOKEN,
                "Accept": "application/json",
            };

            const pipelineRes = await fetch(pipelineUrl, { headers });
            const pipelineData = await pipelineRes.json();
            const latestPipeline = pipelineData.items?.[0];
            if (!latestPipeline) return "No pipelines found";

            const workflowUrl = `https://circleci.com/api/v2/pipeline/${latestPipeline.id}/workflow`;
            const workflowRes = await fetch(workflowUrl, { headers });
            const workflowData = await workflowRes.json();
            const latestWorkflow = workflowData.items?.[0];

            return latestWorkflow?.status || "Unknown";
        } catch (err) {
            return "CircleCI Error: " + err.message;
        }
    },

    /*async jenkins(url) {
      async function fetchJson(apiUrl) {
        const res = await fetch(apiUrl, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
  
        if (!res.ok) {
          throw new Error(`HTTP ${res.status} for ${apiUrl}`);
        }
  
        return res.json();
      }
  
      async function checkJobOrFolder(apiUrl) {
          const data = await fetchJson(apiUrl);
  
          // Folder: recurse into jobs
          if (data.jobs && Array.isArray(data.jobs)) {
            const results = [];
  
            for (const job of data.jobs) {
              if (!job.url) continue;
              const jobStatus = await checkJobOrFolder(`${job.url}api/json`);
              results.push({ name: job.name, status: jobStatus });
            }
  
            // Prioritize failed > unstable > running > success
            const firstFailed = results.find(j => j.status === "failed");
            const firstUnstable = results.find(j => j.status === "unstable");
            const firstRunning = results.find(j => j.status === "running");
            const firstSuccess = results.find(j => j.status === "success");
  
            if (firstFailed) return "failed";
            if (firstUnstable) return "unstable";
            if (firstRunning) return "running";
            if (firstSuccess) return "success";
            return "unknown";
          }
  
          // Job: return status by color
          const color = data.color || '';
          if (color.includes("anime")) return "running";
          if (color.includes("blue")) return "success";
          if (color.includes("red")) return "failed";
          if (color.includes("yellow")) return "unstable";
          if (color.includes("aborted")) return "aborted";
          return "unknown";
        }
  
        try {
          const cleanUrl = url.replace(/\/+$/, '');
          const apiUrl = `${cleanUrl}/api/json`;
          const status = await checkJobOrFolder(apiUrl);
          return status;
        } catch (err) {
          console.error("Error checking Jenkins status:", err);
          return "failed";
        }
    },*/

    async jenkins(url) {
        //IP Based URL's work only if the below line is not commented but it is not suitable for production
        //process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
        try {
            const cleanUrl = url.replace(/\/+$/, '');
            if (cleanUrl.includes("jenkins.io")) {
                try {
                    // Extract words using regex
                    const match = url.match(/job\/([^\/]+)\/job\/([^\/]+)\/job\/([^\/]+)\/?/);
                    if (!match) {
                        throw new Error("Invalid Jenkins folder job URL");
                    }

                    const word0 = match[1];
                    const word1 = match[2];
                    const word2 = match[3];

                    // Construct the icon status URL
                    const jobPath = `${word0}%2F${word1}%2F${word2}`;
                    const iconUrl = `https://ci.jenkins.io/buildStatus/icon?job=${jobPath}`;

                    // Fetch the SVG icon
                    const response = await fetch(iconUrl);
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status} fetching ${iconUrl}`);
                    }

                    const svgText = await response.text();
                    console.log("Jenkins io", svgText);

                    // Extract status text from SVG (e.g., "Success", "Failure")
                    if (svgText.includes("passing")) return "success";
                    if (svgText.includes("failing") || svgText.includes("error")) return "failed";
                    return "unknown";
                } catch (err) {
                    console.error("Error checking Jenkins icon status:", err);
                    return "failed";
                }
            }

            /*if (cleanUrl.includes("build.gluster.org")) {
                const agent = new https.Agent({
                    rejectUnauthorized: false, // ignore certificate error
                });

                const apiUrl = `${cleanUrl}/api/json?tree=color,lastBuild[result,number,timestamp]`;
                //console.log("Calling Jenkins API:", apiUrl);

                try {
                    const response = await axios.get(apiUrl, { httpsAgent: agent });
                    console.log("CI Job Status:", response.data);
                } catch (error) {
                    console.error("Error fetching CI job status inside:", error.message);
                }
            }*/

            //NEWLY ADDED FOR IP ADDRESS URL
            const hostname = new URL(cleanUrl).hostname;
            if (/^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)) {
                const lastBuildUrl = `${cleanUrl}/lastBuild/api/json`;
                //lastBuildUrl = lastBuildUrl.replace("https://", "http://");
                console.log("Lastbuild for IP: ", lastBuildUrl);

                try {
                    const response = await fetch(lastBuildUrl, {
                        method: 'GET',
                        redirect: 'follow',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });

                    if (!response.ok) {
                        const text = await response.text(); // get body text for debugging
                        console.error(`Fetch failed: ${response.status} ${response.statusText}`);
                        console.error("Response body:", text);
                        throw new Error(`HTTP ${response.status} fetching ${lastBuildUrl}`);
                    }

                    const data = await response.json();
                    console.log("Status from IP: ", data.result?.toLowerCase());
                    return data.result?.toLowerCase() || "unknown";

                } catch (error) {
                    console.error("Error fetching Jenkins status for IP:", error.message);
                    return "failed";
                }
            }


            const apiUrl = `${cleanUrl}/api/json?tree=color,lastBuild[result,number,timestamp]`;
            //console.log("Calling Jenkins API:", apiUrl);

            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status} URL ${apiUrl}`);
            }

            const data = await response.json();
            // console.log("Jenkins Response:", data);
            const color = data.color || '';
            if (color.includes("anime")) {
                return "running";
            } else if (color.includes("blue")) {
                return "success";
            } else if (color.includes("red")) {
                return "failed";
            } else if (color.includes("yellow")) {
                return "unstable";
            } else if (color.includes("aborted")) {
                return "aborted";
            } else {
                return "unknown";
            }

            //return data.color && data.color.includes("blue") ? "success" : "failed";
            //return data.color && data.color.includes("anime") ? "running" : data.color && data.color.includes("blue")? "success": "failed";
        } catch (error) {
            console.error("Error checking CI job status (Jenkins):", error);
            console.log("Error for: ", url);
            return "failed";
        }
    },


    /*async jenkins(url) {
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
      *//*remove later
try {
//const apiUrl = `${url.replace(/\/$/, "")}/api/json?tree=color,lastBuild[result,number,timestamp]`;
console.log("Url from jenkins: ", url);
const apiUrl = `${url}/api/json?tree=color,lastBuild[result,number,timestamp]`;
console.log("Jenkins api", apiUrl)
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
},*/

    async travis(url) {
        try {
            const match = url.match(/^https:\/\/app\.travis-ci\.com\/github\/([^\/]+)\/([^\/]+)/);
            if (!match) return { error: "Invalid Travis CI URL" };

            const owner = match[1];
            const repo = match[2];
            const branch = "master"; // or detect/allow custom branches

            const badgeUrl = `https://api.travis-ci.com/${owner}/${repo}.svg?branch=${branch}`;
            const res = await fetch(badgeUrl);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const svgText = await res.text();

            if (svgText.includes("passing")) return "success";
            if (svgText.includes("failing") || svgText.includes("error")) return "failed";

            return "unknown";
        } catch (err) {
            return "TravisCI Error: " + err.message;
        }
    },
    async buildfarm(baseUrl) {
        try {
            // Handle different URL patterns and extract animal name
            let animalName = null;

            // Try to extract animal name from URL query parameters
            const urlObj = new URL(baseUrl);
            animalName = urlObj.searchParams.get('animal') || urlObj.searchParams.get('name');

            // Try to extract from URL path
            if (!animalName) {
                const pathMatch = baseUrl.match(/\/([^\/\?#]+)$/);
                if (pathMatch) {
                    animalName = decodeURIComponent(pathMatch[1]);
                }
            }

            const origin = urlObj.origin;
            const domain = urlObj.hostname;

            console.log("Origin:", origin);
            console.log("Domain:", domain);
            console.log("Animal Name:", animalName);

            // Try different URL approaches for different buildfarm systems
            const apiUrls = [];

            // PostgreSQL buildfarm
            if (domain.includes('postgresql.org')) {
                apiUrls.push(`${origin}/cgi-bin/show_status.pl`);
                apiUrls.push(`${origin}/cgi-bin/show_status.pl?animal=${animalName || ''}`);
            }

            // OpenSSL buildfarm
            if (domain.includes('openssl.org')) {
                apiUrls.push(`${origin}/cgi-bin/show_status.pl`);
                apiUrls.push(`${origin}/cgi-bin/show_status.pl?animal=${animalName || ''}`);
            }

            // Generic buildfarm URLs
            apiUrls.push(`${origin}/cgi-bin/show_status.pl`);
            apiUrls.push(`${origin}/show_status.pl`);
            apiUrls.push(`${origin}/status`);
            apiUrls.push(`${origin}/`);

            // If original URL is different, try it as well
            if (!apiUrls.includes(baseUrl)) {
                apiUrls.unshift(baseUrl);
            }

            for (const apiUrl of apiUrls) {
                console.log("Trying:", apiUrl);

                try {
                    const res = await fetch(apiUrl, {
                        headers: {
                            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                            'User-Agent': 'CI-Status-Checker'
                        }
                    });

                    if (!res.ok) continue;

                    const html = await res.text();

                    // Parse HTML and extract status - inline implementation
                    try {
                        // Simple regex-based parsing since we can't use cheerio in this context
                        // Look for common table patterns

                        let tableRows = [];

                        // Extract table rows
                        const tableRowRegex = /<tr[^>]*>(.*?)<\/tr>/gis;
                        let match;
                        while ((match = tableRowRegex.exec(html)) !== null) {
                            tableRows.push(match[1]);
                        }

                        // Process each row
                        for (const row of tableRows) {
                            // Extract table cells - inline implementation
                            const cells = [];
                            const cellRegex = /<td[^>]*>(.*?)<\/td>/gis;
                            let cellMatch;

                            while ((cellMatch = cellRegex.exec(row)) !== null) {
                                // Remove HTML tags and get clean text
                                const cellContent = cellMatch[1].replace(/<[^>]*>/g, '').trim();
                                cells.push(cellContent);
                            }

                            if (cells.length < 2) continue;

                            const name = cells[0];
                            if (!name || name.toLowerCase().includes('animal') || name.toLowerCase().includes('name')) {
                                continue; // Skip header rows
                            }

                            // If looking for specific animal, check if this row matches
                            if (animalName && !name.toLowerCase().includes(animalName.toLowerCase())) {
                                continue;
                            }

                            // Extract status from various columns
                            let status = "unknown";

                            // Get status column indexes based on domain - inline implementation
                            let statusColumnIndexes = [];
                            if (domain.includes('postgresql.org')) {
                                statusColumnIndexes = [4, 3, 2, 1]; // PostgreSQL typically has status in column 4
                            } else if (domain.includes('openssl.org')) {
                                statusColumnIndexes = [3, 2, 1, 4]; // OpenSSL might be different
                            } else {
                                statusColumnIndexes = [4, 3, 2, 1, 5]; // Try common positions
                            }

                            for (const columnIndex of statusColumnIndexes) {
                                if (columnIndex < cells.length) {
                                    const cellContent = cells[columnIndex];

                                    // Extract status from cell - inline implementation
                                    let extractedStatus = "unknown";
                                    if (cellContent) {
                                        const content = cellContent.toLowerCase();

                                        // Check for image alt text patterns
                                        if (content.includes('alt=')) {
                                            const altMatch = content.match(/alt=["']([^"']+)["']/);
                                            if (altMatch) {
                                                extractedStatus = altMatch[1];
                                            }
                                        }

                                        // Check for title attributes
                                        if (extractedStatus === "unknown" && content.includes('title=')) {
                                            const titleMatch = content.match(/title=["']([^"']+)["']/);
                                            if (titleMatch) {
                                                extractedStatus = titleMatch[1];
                                            }
                                        }

                                        // Check for common status keywords in text
                                        if (extractedStatus === "unknown") {
                                            if (content.includes('ok') || content.includes('success') || content.includes('pass')) {
                                                extractedStatus = 'success';
                                            } else if (content.includes('fail') || content.includes('error')) {
                                                extractedStatus = 'failure';
                                            } else if (content.includes('warn')) {
                                                extractedStatus = 'warning';
                                            } else if (content.includes('running') || content.includes('building')) {
                                                extractedStatus = 'running';
                                            } else if (content.length < 20) {
                                                extractedStatus = content;
                                            }
                                        }
                                    }

                                    if (extractedStatus !== "unknown") {
                                        status = extractedStatus;
                                        break;
                                    }
                                }
                            }

                            // If we found a specific animal or this is the first valid entry
                            if (animalName || status !== "unknown") {
                                // Normalize buildfarm status - inline implementation
                                if (!status) {
                                    status = 'unknown';
                                } else {
                                    const normalizedStatus = status.toString().toLowerCase().trim();

                                    // Map various status formats to standard ones - ALL KEYS ARE NOW LOWERCASE
                                    const statusMap = {
                                        'ok': 'success',        // Fixed: was 'OK', now 'ok' to match normalization
                                        'success': 'success',
                                        'passed': 'success',
                                        'pass': 'success',
                                        'green': 'success',
                                        'good': 'success',

                                        'failed': 'failure',
                                        'fail': 'failure',
                                        'error': 'failure',
                                        'red': 'failure',
                                        'bad': 'failure',

                                        'warning': 'warning',
                                        'warn': 'warning',
                                        'yellow': 'warning',

                                        'running': 'running',
                                        'building': 'running',
                                        'in progress': 'running',
                                        'blue': 'running',

                                        'unknown': 'unknown',
                                        'pending': 'unknown',
                                        'queued': 'unknown'
                                    };

                                    // Check for direct matches
                                    if (statusMap[normalizedStatus]) {
                                        status = statusMap[normalizedStatus];
                                    } else {
                                        // Check for partial matches
                                        for (const [key, value] of Object.entries(statusMap)) {
                                            if (normalizedStatus.includes(key)) {
                                                status = value;
                                                break;
                                            }
                                        }
                                        if (!statusMap[normalizedStatus]) {
                                            status = 'unknown';
                                        }
                                    }
                                }

                                return status;
                            }
                        }

                    } catch (parseErr) {
                        console.log("HTML parsing error:", parseErr.message);
                        continue;
                    }

                } catch (apiError) {
                    console.log("API failed:", apiError.message);
                    continue;
                }
            }

            return "No working buildfarm endpoint found";

        } catch (err) {
            return "Buildfarm Error: " + err.message;
        }
    },

    //"https://buildbot.mariadb.org/#/builders/309"
    async buildbot(baseUrl) {
        try {
            // Handle different URL patterns
            let builderId = null;
            let builderName = null;

            // Try to extract builder ID (numeric)
            const idMatch = baseUrl.match(/builders?\/(\d+)/);
            if (idMatch) {
                builderId = idMatch[1];
            }

            // Try to extract builder name (URL encoded)
            const nameMatch = baseUrl.match(/builders?\/([^\/\?#]+)/);
            if (nameMatch) {
                builderName = decodeURIComponent(nameMatch[1]);
            }

            const origin = new URL(baseUrl).origin;
            console.log("Origin:", origin);
            console.log("Builder ID:", builderId);
            console.log("Builder Name:", builderName);

            // Try different API approaches
            const apiUrls = [];

            if (builderId) {
                apiUrls.push(`${origin}/api/v2/builders/${builderId}/builds?order=-number&limit=1`);
                apiUrls.push(`${origin}/json/builders/${builderId}/builds?select=-1`);
            }

            if (builderName) {
                apiUrls.push(`${origin}/api/v2/builders/${encodeURIComponent(builderName)}/builds?order=-number&limit=1`);
                apiUrls.push(`${origin}/json/builders/${encodeURIComponent(builderName)}/builds?select=-1`);
            }

            // Fallback: try to get all builders and find the right one
            apiUrls.push(`${origin}/api/v2/builders`);
            apiUrls.push(`${origin}/json/builders`);

            for (const apiUrl of apiUrls) {
                console.log("Trying:", apiUrl);

                try {
                    const res = await fetch(apiUrl, {
                        headers: {
                            'Accept': 'application/json',
                            'User-Agent': 'CI-Status-Checker'
                        }
                    });

                    if (!res.ok) continue;

                    const json = await res.json();

                    // Process response based on endpoint type
                    let latestBuild = null;

                    if (json.builds) {
                        // Direct builds response
                        latestBuild = json.builds[0];
                    } else if (json.builders) {
                        // Builders list response - need to find our builder
                        // This is more complex, skip for now
                        continue;
                    } else if (Array.isArray(json)) {
                        // Array of builds
                        latestBuild = json[0];
                    } else {
                        // Single build object
                        latestBuild = json;
                    }

                    // Process the build result inline
                    if (!latestBuild) {
                        continue;
                    }

                    const statusMap = {
                        0: "success",
                        1: "warnings",
                        2: "failure",
                        3: "skipped",
                        4: "exception",
                        5: "retry",
                        6: "cancelled",
                        null: "running",
                        undefined: "running"
                    };

                    if (latestBuild.results === null || latestBuild.results === undefined) {
                        return "running";
                    }

                    return statusMap[latestBuild.results] || "unknown";

                } catch (apiError) {
                    console.log("API failed:", apiError.message);
                    continue;
                }
            }

            return "No working API endpoint found";

        } catch (err) {
            return "Buildbot Error: " + err.message;
        }
    },

    //testgrid done
    async testgrid(url) {
        try {
            const urlParts = url.split("testgrid.k8s.io/");
            if (urlParts.length < 2) return "Invalid TestGrid URL format";

            const dashboardAndTab = urlParts[1];
            const [dashboard, tab] = dashboardAndTab.split("#");

            if (!dashboard || !tab) return "Invalid TestGrid URL: missing dashboard or tab";

            const decodedTab = decodeURIComponent(tab);
            const apiUrl = `https://testgrid.k8s.io/${dashboard}/table?tab=${encodeURIComponent(decodedTab)}`;
            // console.log(apiUrl);

            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

            const data = await response.json();

            // ✅ First: Try to read status from 'tests' field using short_texts or messages
            if (data.tests && data.tests.length > 0) {
                const overallTest = data.tests.find(test => test.name?.toLowerCase().includes("overall"));
                const testEntry = overallTest || data.tests[0];

                if (testEntry?.short_texts?.length > 0) {
                    const latestShortText = testEntry.short_texts[0];
                    if (latestShortText === "F") return "failure";
                    if (latestShortText === "R") return "running";
                    if (latestShortText && latestShortText.includes("/")) return "success";
                }

                if (testEntry?.messages?.length > 0) {
                    const latestMessage = testEntry.messages[0]?.toLowerCase();
                    if (latestMessage.includes("fail")) return "failure";
                    if (latestMessage.includes("running")) return "running";
                    if (latestMessage.includes("pass") || latestMessage.includes("succeeded")) return "success";
                }
            }

            // ✅ Second: Check the grid field
            if (data.grid && data.grid.length > 0) {
                const latestColumn = data.grid[0]; // Latest column

                let hasFailures = false;
                let hasSuccess = false;
                let hasRunning = false;

                if (latestColumn?.cells?.length > 0) {
                    for (const cell of latestColumn.cells) {
                        const result = cell.result;
                        const displayResult = cell.display_result;

                        if (result === 1 || (displayResult && displayResult.includes('/'))) {
                            hasSuccess = true;
                        } else if (result === 2 || displayResult === 'F') {
                            hasFailures = true;
                        } else if (result === 12 || displayResult === 'R') {
                            hasRunning = true;
                        }
                    }

                    if (hasRunning) return "running";
                    if (hasFailures) return "failure";
                    if (hasSuccess) return "success";
                    return "unknown";
                }

                // Fallback column-level status
                if (latestColumn.overall_status) return 'success';
                if (latestColumn.build_result) return 'success';
            }

            // ✅ Final fallback
            if (data.overall_status) return 'success';
            if (data.status) return data.status;

            return "unknown";

        } catch (err) {
            return "TestGrid Error: " + err.message;
        }
    },

    async semaphore(url) {
        try {
            const match = url.match(/^https:\/\/([^\.]+)\.semaphoreci\.com\/projects\/([^\/]+)/);
            if (!match) return { error: "Invalid semaphore URL" };

            const owner = match[1];
            const projectname = match[2];
            const branch = "master"; // or detect/allow custom branches
            const badgeUrl = `https://${owner}.semaphoreci.com/badges/${projectname}/branches/${branch}.svg`;
            console.log(badgeUrl)
            //const badgeUrl = `https://api.travis-ci.com/${owner}/${repo}.svg?branch=${branch}`;
            const res = await fetch(badgeUrl,
                {
                    method: "GET",
                }
            );
            console.log(res);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const svgText = await res.text();
            console.log("Text of tigera svg: ", svgText);
            if (svgText.includes("passed")) return "success";
            else if (svgText.includes("failed") || svgText.includes("error")) return "failed";
            else return "unknown";
        } catch (err) {
            return "Semaphore Error: " + err.message;
        }
    },

    /*async prow(url) {
        if (!storageInstance) {
            console.error("Prow Error: GCS client is not initialized in handler.");
            return "Prow Error: GCS client not initialized. Check server setup.";
        }

        let gcsBucket;
        let jobName;
        let inferredGcsPrefix = ''; // The part like "pr-logs/directory/jobname/" or "pr-logs/pull/org_repo/pr_num/jobname/"
        let directBuildIdFromUrl = null; // Stores the numeric ID if found directly in URL
        let skipLatestIdDiscovery = false; // Flag to indicate if we have a direct, concrete build ID

        try {
            const urlObj = new URL(url);
            const pathnameParts = urlObj.pathname.split('/').filter(p => p); // e.g., ["view", "gs", "bucketname", "logs", "jobname"]

            // --- Determine Prow URL type and GCS base path ---
            if (pathnameParts[0] === 'job-history' && pathnameParts[1] === 'gs') {
                gcsBucket = pathnameParts[2];
                if (pathnameParts[3] === 'pr-logs' && pathnameParts[4] === 'directory') {
                    // Type: https://prow.k8s.io/job-history/gs/bucket/pr-logs/directory/jobname
                    jobName = pathnameParts.slice(5).join('/');
                    inferredGcsPrefix = `pr-logs/directory/${jobName}/`;
                    console.log(`Prow handler: Detected 'job-history/directory' link. Bucket: ${gcsBucket}, Job: ${jobName}`);
                } else if (pathnameParts[3] === 'pr-logs' && pathnameParts[4] === 'directory') {
                    // Type: https://prow.k8s.io/job-history/gs/bucket/pr-logs/directory/jobname (possibly with nested folders)
                    const remaining = pathnameParts.slice(5); // everything after 'directory'
                    if (remaining.length === 0) {
                        throw new Error("Invalid 'job-history' directory URL: Missing job name.");
                    }

                    jobName = remaining.join('/');
                    inferredGcsPrefix = `pr-logs/directory/${jobName}/`;

                    console.log(`Prow handler: Detected 'job-history/directory' link. Bucket: ${gcsBucket}, Job: ${jobName}`);
                } else {
                    throw new Error("Unsupported 'job-history' pr-logs sub-type or path.");
                }
            } else if (pathnameParts[0] === 'view' && pathnameParts[1] === 'gs') {
                gcsBucket = pathnameParts[2];
                if (pathnameParts[3] === 'logs') {
                    // Type: https://prow.k8s.io/view/gs/bucket/logs/jobname/ (for generic jobs)
                    jobName = pathnameParts.slice(4).join('/');
                    inferredGcsPrefix = `logs/${jobName}/`;
                    console.log(`Prow handler: Detected 'view/logs' link. Bucket: ${gcsBucket}, Job: ${jobName}`);
                } else if (pathnameParts[3] === 'pr-logs' && pathnameParts[4] === 'pull') {
                    // Type: https://prow.k8s.io/view/gs/bucket/pr-logs/pull/org_repo/pr_num/jobname/build_id[/filename.txt]
                    if (pathnameParts.length < 8) { // Requires at least bucket/pr-logs/pull/org_repo/pr_num/jobname
                        throw new Error("Incomplete Prow 'view/gs/pr-logs/pull' URL format.");
                    }
                    const orgRepo = pathnameParts[5];
                    const prNumber = pathnameParts[6];
                    jobName = pathnameParts[7]; // Specific job name

                    // Determine the build ID part and if it's a direct ID or placeholder
                    let buildIdSegment = null;
                    if (pathnameParts.length > 8) { // If there's a segment after jobname
                        buildIdSegment = pathnameParts[8];
                        // If the URL ends with a filename (e.g., /build-log.txt), the build ID is the segment *before* it.
                        if (buildIdSegment.includes('.')) { // Simple check for file extension
                            // This case: /jobname/build_id/filename.txt -> jobname is part[7], build_id is part[8], filename is part[9]
                            if (pathnameParts.length > 9 && !isNaN(parseInt(pathnameParts[8], 10))) {
                                buildIdSegment = pathnameParts[8];
                                console.log(`Prow handler: Detected view/pull link ending with file. BuildId: ${buildIdSegment}`);
                            } else {
                                // This scenario (e.g. /jobname/build-log.txt directly) is less common for pull jobs
                                // and needs special handling if buildId is not a subfolder.
                                // For now, assume buildId is always a subfolder.
                                throw new Error("Prow handler: Unsupported /view/pull/jobname/filename.txt format (missing build_id segment).");
                            }
                        }
                    }

                    if (buildIdSegment && !isNaN(parseInt(buildIdSegment, 10))) {
                        // It's a concrete build ID, like "123456789"
                        inferredGcsPrefix = `pr-logs/pull/${orgRepo}/${prNumber}/${jobName}/${buildIdSegment}/`;
                        skipLatestIdDiscovery = true; // Set flag to use this direct path
                        console.log(`Prow handler: Detected 'view/pull' direct build link. Bucket: ${gcsBucket}, Job: ${jobName}, PR: ${prNumber}, BuildId: ${buildIdSegment}`);
                    } else {
                        // It's a placeholder like 'latestjobid' or 'latest', or URL ends at jobname.
                        // We need to find the actual latest build ID.
                        inferredGcsPrefix = `pr-logs/pull/${orgRepo}/${prNumber}/${jobName}/`;
                        console.log(`Prow handler: Detected 'view/pull' link needing latest build discovery. Bucket: ${gcsBucket}, Job: ${jobName}, PR: ${prNumber}.`);
                    }
                } else {
                    throw new Error("Unsupported 'view' pr-logs sub-type.");
                }
            } else {
                throw new Error("Unrecognized Prow URL format. Expected /job-history/gs/ or /view/gs/");
            }

        } catch (e) {
            console.error(`Error parsing Prow URL "${url}":`, e.message);
            return `Prow Error: Failed to parse Prow URL: ${e.message}`;
        }

        const bucket = storageInstance.bucket(gcsBucket);
        let latestBuildId = null;

        // Function to check status for a known build ID path (extracted to avoid repetition)
        async function checkStatusForSpecificBuildId(targetBucket, gcsBuildPathPrefix) {
            const finishedFilePath = `${gcsBuildPathPrefix}finished.json`;
            const finishedFile = targetBucket.file(finishedFilePath);

            try {
                console.log(`Prow handler: Checking for finished.json at: ${finishedFilePath}`);
                const [finishedExists] = await finishedFile.exists();
                if (finishedExists) {
                    console.log(`Prow handler: finished.json found.`);
                    const [contents] = await finishedFile.download();
                    const finishedData = JSON.parse(contents.toString());
                    console.log("Prow handler: Content of finished.json:", finishedData);
                    return (finishedData.result || 'UNKNOWN').toLowerCase();
                } else {
                    console.log(`Prow handler: finished.json NOT found, checking for started.json.`);
                    const startedFilePath = `${gcsBuildPathPrefix}started.json`;
                    const startedFile = targetBucket.file(startedFilePath);
                    const [startedExists] = await startedFile.exists();

                    if (startedExists) {
                        console.log(`Prow handler: started.json found. Job is running.`);
                        return "running";
                    } else {
                        console.log(`Prow handler: Neither finished.json nor started.json found.`);
                        return "unknown";
                    }
                }
            } catch (error) {
                console.error(`Prow handler: ERROR fetching finished/started.json for ${finishedFilePath}:`, error.message);
                console.error('Prow handler: Full GCS Error (details from file access):', error);
                if (error.code === 401 || error.code === 403) {
                    return "AUTH_ERROR";
                }
                return "failed";
            }
        }

        // If skipLatestIdDiscovery is true, it means we already have the direct build ID
        // from a /view/gs/pr-logs/pull/.../build_id type URL, so proceed directly.
        if (skipLatestIdDiscovery) {
            return await checkStatusForSpecificBuildId(bucket, inferredGcsPrefix);
        }

        // --- Logic for finding latest build ID for generic job history/view links ---
        // This applies when the URL doesn't contain a direct build_id or if it was a placeholder.
        try {
            // --- ATTEMPT 1: Read latest-build.txt (if applicable for this inferredGcsPrefix) ---
            const latestBuildTxtPath = `${inferredGcsPrefix}latest-build.txt`;
            const latestBuildTxtFile = bucket.file(latestBuildTxtPath);

            console.log(`Prow handler: Attempting to read ${latestBuildTxtPath}`);
            const [latestBuildTxtExists] = await latestBuildTxtFile.exists();

            if (latestBuildTxtExists) {
                console.log(`Prow handler: ${latestBuildTxtPath} found.`);
                const [contents] = await latestBuildTxtFile.download();
                const buildIdFromTxt = contents.toString().trim();

                if (buildIdFromTxt && !isNaN(parseInt(buildIdFromTxt, 10))) {
                    latestBuildId = buildIdFromTxt;
                    console.log(`Prow handler: Latest Build ID from latest-build.txt: ${latestBuildId}`);
                    return await checkStatusForSpecificBuildId(bucket, `${inferredGcsPrefix}${latestBuildId}/`);
                } else {
                    console.log(`Prow handler: latest-build.txt content invalid: "${buildIdFromTxt}". Falling back to listing.`);
                }
            } else {
                console.log(`Prow handler: ${latestBuildTxtPath} NOT found. Falling back to listing.`);
            }

            // --- ATTEMPT 2: Fallback to listing objects (for jobs that use build ID subdirectories) ---
            console.log(`Prow handler: Falling back to listing ALL files under prefix: ${inferredGcsPrefix}`);
            const [allFilesAndSubFiles] = await bucket.getFiles({
                prefix: inferredGcsPrefix,
            });

            console.log(`Prow handler: Successfully listed ALL objects (fallback). Total: ${allFilesAndSubFiles.length}`);

            const uniqueBuildIds = new Set();
            for (const file of allFilesAndSubFiles) {
                if (file.name.startsWith(inferredGcsPrefix)) {
                    const remainingPath = file.name.substring(inferredGcsPrefix.length);
                    const firstSlashIndex = remainingPath.indexOf('/');
                    if (firstSlashIndex !== -1) {
                        const buildId = remainingPath.substring(0, firstSlashIndex);
                        if (buildId && !isNaN(parseInt(buildId, 10))) {
                            uniqueBuildIds.add(buildId);
                        }
                    } else {
                        // This log is fine, it means it's a file directly under jobname, not a build ID subdirectory
                        // console.log(`Prow handler: Found direct file under job prefix: ${file.name}`);
                    }
                }
            }

            const buildIds = Array.from(uniqueBuildIds).map(id => parseInt(id, 10)).filter(id => !isNaN(id));

            if (buildIds.length === 0) {
                console.log(`Prow handler: No job run IDs found for job: ${jobName} after processing all objects (fallback).`);
                return "NOT_FOUND";
            }

            buildIds.sort((a, b) => b - a);
            latestBuildId = String(buildIds[0]);
            console.log(`Prow handler: Latest BUILD_ID found (fallback listing and sorting): ${latestBuildId}`);

            // Once latestBuildId is found via fallback, check its status
            return await checkStatusForSpecificBuildId(bucket, `${inferredGcsPrefix}${latestBuildId}/`);

        } catch (error) {
            console.error('Prow handler: ERROR during GCS operation (main try-catch):', error.message);
            console.error('Prow handler: Full GCS Error (details from main try-catch):', error);
            if (error.code === 401 || error.code === 403) {
                return "AUTH_ERROR";
            }
            return "failed";
        }
    },*/


    async unknown() {
        return "unknown";
    }
};

// Helper to detect platform
function getCITypeFromURL(url) {
    try {
        const domain = new URL(url).hostname;
        console.log(url)
        console.log("DOmain", domain)
        return ciDomainMap[domain] || "unknown";
    } catch {
        return "unknown";
    }
}/*
function getCITypeFromURL(url) {
    try {
        const parsedUrl = new URL(url);
        const domain = parsedUrl.hostname;
        console.log(url)
        console.log("DOmain", domain)
        // If it's a known domain
        if (ciDomainMap[domain]) {
            return ciDomainMap[domain];
        }
        // Check if it's an IP address and looks like a Jenkins URL
        if (/^\d{1,3}(\.\d{1,3}){3}$/.test(domain) && url.includes("/job/")) {
            console.log("Returning jenkins");
            return "jenkins";
        }

        return "unknown";
    } catch {
        return "unknown";
    }
}*/

// Main controller for one CI job
const ci_check = async (req, res) => {
    try {
        const jobUrl = req.body.ciJob;
        // console.log("Job url in ci_check.js: ", jobUrl)
        if (jobUrl === "" || jobUrl == "null") {
            const platform = null;
            const handler = null;
            const status = "empty";

            return res.status(200).json({ url: jobUrl, platform, status });
        }
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
};
export default ci_check;
