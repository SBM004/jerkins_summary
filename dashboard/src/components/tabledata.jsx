import React,{useState} from 'react'

const Tabledata=({item,setSelect})=>{
    
    // const [show,setShow]=useState(true)
    const distrosSuc=item.distrosucc;
    // const distroSuc=distros.split(',');
    const distroFail=item.distrofail;
    const comment=item.comment;
    const packageName=item.packageName;
    console.log(item.distroSuccess);
    console.log("clicked");
    return(
        <div className=" absolute  border-xl backdrop-blur-[2px]  border-black min-h-full min-w-full">
            <div className="sticky flex flex-col items-center border-black border-2 bg-white mx-[20vw] rounded-2xl my-[10vh] min-h-[60vh] p-10 h-full gap-3">
            <div className="PackageName border-2 border-black w-full text-center min-h-[20% ]">
                {packageName}
            </div>
            <div className="Comment border-2 border-black  w-full text-center min-h-[20%]">
                {comment || "No comment"  }
            </div>
            <div className="DistroSucc flex flex-row gap-2 border-2 border-black w-full text-center min-h-[50%]">

            { distrosSuc.split(",").map((content)=>{
                return <div>{content}</div>
            })}
            </div>
            <div className="Distrofail flex flex-row border-2 border-black w-full min-h-[40%] text-center">
                { (distrosSuc || "").split(',').map((content)=>{
                 return <div>{content}</div>
            })}
            </div>

            <button className="sticky bottom-0 border-2 border-black rounded-xl px-2"onClick={()=>{
                setSelect(null)
            }}>
                cancel
            </button>
            </div>
        </div>
    );
}

export default Tabledata;