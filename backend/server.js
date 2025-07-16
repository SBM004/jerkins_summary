express=require('express')
cors=require('cors')
fs=require('fs')
const path=require('path')
router=express.Router()
const dotenv=require('dotenv')
dotenv.config()
const port=process.env.PORT || 2000
const app=express()
const filepath=path.join(__dirname,'data','summary.json')
const ci_route=require('./routes/CI_route')
app.use(express.json())
app.use(cors())

app.get('/data',(req,res)=>{
    try{
        fs.readFile(filepath,'utf8',(err,data)=>{
        if(err){
            console.log(err)
        }
        else{
            try{
                
                const jsonData=JSON.parse(data)
                // const dataa=jsonData.filter((items)=>{
                //   if( items.ciJob==="" || items.ciJob===null)
                //     return false
                //   return true
                // }).map(items=>{return items.ciJob})
                console.log("data loaded successfully")
                //  console.log(jsonData)
                res.status(200).json(jsonData)

            }
            catch(err){
                console.log(err)
            }
            
           
        
        }     
        console.log("data read successfully")
    })}
    catch(err){
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

app.use('/api/ci',ci_route)
app.listen(port,()=>{
    // console.log(__dirname)
    console.log(`serever is ruuning in port ${port}`)
})
