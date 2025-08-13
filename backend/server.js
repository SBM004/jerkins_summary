import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Manually define __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();
import dotenv from 'dotenv';
dotenv.config();
const port = process.env.PORT || 2000;
const app = express();
const filepath = path.join(__dirname, 'data', 'summary.json');
import router1 from './routes/CI_route.js';
app.use(express.json());
app.use(cors());

app.get('/data', (req, res) => {
    try {
        fs.readFile(filepath, 'utf8', (err, data) => {
            if (err) {
                console.log(err)
            }
            else {
                try {

                    const jsonData = JSON.parse(data)
                    // const dataa=jsonData.filter((items)=>{
                    //   if( items.ciJob==="" || items.ciJob===null)
                    //     return false
                    //   return true
                    // }).map(items=>{return items.ciJob})
                    console.log("data loaded successfully")
                    //  console.log(jsonData)
                    res.status(200).json(jsonData)

                }
                catch (err) {
                    console.log(err)
                }



            }
            console.log("data read successfully")
        })
    }
    catch (err) {
        res.status(500).send('internal error')
    }
})
// console.log(filepath)
// const ci_route=require('./routes/CI_route')

// app.get("/data")
// app.router('/packages',(req,res)=>{
//     try{
//         console.log("server is running")
//         res.status(200).send("success")
//     }
//     catch(err){
//         console.log(err)
//         res.status(500).send('Internal server issue')
//     }
// })

// app.use('/ci_checks/packages',ci_route)

app.use('/api/ci', router1)

// In-memory status store (for demo; use DB for production)
let buildStatuses = {}; // { [packageName]: { bi: 'passed', ci: 'failed', image: 'passed', binary: 'unknown' } }

app.post('/api/build-status', (req, res) => {
    const { packageName, type, status } = req.body;
    if (!packageName || !type || !status) {
        return res.status(400).json({ error: 'Missing fields' });
    }
    if (!buildStatuses[packageName]) buildStatuses[packageName] = {};
    buildStatuses[packageName][type] = status;
    res.json({ success: true });
});

app.get('/api/build-status', (req, res) => {
    res.json(buildStatuses);
});

app.listen(port, () => {
    console.log(__dirname)
    console.log(`server is running in port ${port}`)
})
