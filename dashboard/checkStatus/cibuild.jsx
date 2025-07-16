import React from 'react';
import Passeds from '../assets/passed.jsx';
import Failedr from '../assets/failedr.jsx';

export const Ci_check = (props)=>{
    const ci_jobs=props.ciJob;
    if(!ci_jobs|| ci_jobs.trim()==="" ){
        // console.log(ci_jobs)
        return <Failedr/>
    }
    else{
        
        try{
            console.log(ci_jobs)
         fetch('http://localhost:3000/api/ci',{
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({"ciJob":ci_jobs})
        }).then(response=>{response.json()}).then(data=>{
            console.log(data)
            if(!data){
                return <Failedr/>
            }
            else{
                if (data.status==="failed"){
                    return <Failedr/>
            }
            }
            return <Passeds/>
        })
         }
         catch(err){
            return <Failedr/> 
         }
    
}
}