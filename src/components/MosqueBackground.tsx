
import React from "react";

const MosqueBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      {/* Subtle Islamic pattern background */}
      <div className="absolute inset-0 opacity-10 islamic-pattern" />
      
      {/* Mosque silhouette SVG - more subtle and elegant */}
      <svg 
        className="absolute bottom-0 left-0 w-full"
        height="180"
        viewBox="0 0 800 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path 
          d="M0,180 L0,120 L40,120 L40,180 L60,180 L60,100 L80,80 L100,100 L100,180 L120,180 L120,140 L130,140 L130,180 L150,180 L150,140 L160,120 L170,140 L170,180 L190,180 L190,120 L200,100 L210,120 L210,180 L230,180 L230,140 L240,140 L240,180 L260,180 L260,120 L280,120 L280,180 L300,180 L300,100 L320,80 L340,100 L340,180 L360,180 L360,120 L380,120 L380,180 L400,180 L400,90 L420,70 L440,90 L440,180 L460,180 L460,120 L480,120 L480,180 L500,180 L500,100 L520,80 L540,100 L540,180 L560,180 L560,120 L580,120 L580,180 L600,180 L600,140 L620,140 L620,180 L640,180 L640,120 L660,120 L660,180 L680,180 L680,100 L700,80 L720,100 L720,180 L740,180 L740,120 L760,120 L760,180 L800,180 L800,0 L0,0 Z" 
          fill="#1D8A4A"
          opacity="0.4"
        />
      </svg>
    </div>
  );
};

export default MosqueBackground;
