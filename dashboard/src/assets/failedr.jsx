import React from 'react';
import failed from '../assets/failedrs.svg';
export default function Failedr() {
    return (
        <div style={{width: '100%', height: '100%', position: 'relative'}}>
    <div style={{width: "6vw", height: "3.5vh", left: "1vw", top: 0, position: 'absolute', background: 'rgba(251.32, 0, 0, 0.39)', borderRadius: 20}} />
    <div style={{width: "6vw", height: "2vh", left: "1.5vw", top: "0vh", position: 'absolute', color: '#870000', fontSize: 'clamp(6px, 1vw, 18px)', fontFamily: 'JejuGothic', fontWeight: '400', wordWrap: 'break-word'}}>Failed</div>
    <div style={{width: '100%', height: '100%',top:"0.9vh",left:"1.5vw", position: 'relative'}}>
    <img src={failed} style={{height:"2vh"}}></img>
    
    </div>
   
</div>
    );
}