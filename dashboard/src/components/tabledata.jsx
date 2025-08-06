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
        <div className=" absolute  border-xl backdrop-blur-[2px]  border-black min-h-full max-w-full">
            <div className="sticky flex flex-col items-center border-black border-2 bg-white mx-[20vw] rounded-2xl my-[10vh] min-h-[60vh] p-10 h-full gap-3">
            {/* <div>Package Name</div> */}
            <div className="PackageName border-2 border-black w-full text-center min-h-[20% ]">
                {packageName}
            </div>
            <div className="Comment border-2 border-black  w-full text-center min-h-[30%] overflow-y">
                {comment || "No comment"  }
            </div>
            <div className="DistroSucc  flex flex-row flex-wrap  border-2 border-black w-full text-center min-h-[50%]">

            { distrosSuc===""?"no runs in success":distrosSuc.split(",").map((content)=>{
                return <div className="border-[1px] border-black min-w-[20%]">{content}</div>
            })}
            </div>
            <div className="Distrofail flex flex-row flex-wrap border-2 border-black w-full min-h-[40%] text-center">
                { distrosSuc===""?"no runs in success":(distrosSuc || "").split(',').map((content)=>{
                 return <div className="border-[1px] border-black min-w-[20%]">{content}</div>
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