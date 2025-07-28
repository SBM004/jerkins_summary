import React from 'react';
import passeds from '../assets/passeds.svg';
export default function Skipped() {
    return (
        <div style={{width: '100%', height: '100%', position: 'relative'}}>
    <div style={{width: "6vw", height: "3.5vh", left: "1vw", top: 0, position: 'absolute', background: 'rgba(211, 211, 211, 0.7)', borderRadius: 20}} />
    <div style={{width: "6vw", height: "2vh", left: "1.5vw", top: "0vh", position: 'absolute', color: '#d3d3d3', fontSize: 'clamp(6px, 1vw, 18px)', fontFamily: 'JejuGothic', fontWeight: '400', wordWrap: 'break-word'}}>Skipped</div>
    <div style={{width: '100%', height: '100%',top:"0.9vh",left:"1.5vw", position: 'relative'}}>
    <img src={passeds} style={{height:"2vh"}}></img>
    
    </div>
   
</div>
    );
}