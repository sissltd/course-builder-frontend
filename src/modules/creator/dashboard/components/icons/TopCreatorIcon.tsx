import React from "react";

export const TopCreatorIcon = ({ size = 24, className }: { size?: number; className?: string }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none"
      className={className}
    >
      <path 
        d="M21.2105 13.24L14.3604 20.78C13.0604 22.21 10.9404 22.21 9.64044 20.78L2.79044 13.24C2.02044 12.39 1.77044 10.85 2.23044 9.8L3.03044 8H20.9704L21.7705 9.8C22.2304 10.85 21.9805 12.39 21.2105 13.24Z" 
        fill="url(#paint0_linear_302_30275)"
      />
      <foreignObject x="-11.2707" y="-12.1496" width="46.5399" height="34.4501">
        <div style={{ backdropFilter: "blur(7.15px)", clipPath: "url(#bgblur_0_302_30275_clip_path)", height: "100%", width: "100%" }} />
      </foreignObject>
      <path 
        d="M20.9693 8.00039H3.0293L4.78929 4.04039C5.25929 3.00039 5.99929 2.15039 7.6993 2.15039H16.2993C17.9993 2.15039 18.7393 3.00039 19.2093 4.04039L20.9693 8.00039Z" 
        fill="url(#paint1_linear_302_30275)" 
        fillOpacity={0.92}
      />
      <defs>
        <clipPath id="bgblur_0_302_30275_clip_path" transform="translate(11.2707 12.1496)">
          <path d="M20.9693 8.00039H3.0293L4.78929 4.04039C5.25929 3.00039 5.99929 2.15039 7.6993 2.15039H16.2993C17.9993 2.15039 18.7393 3.00039 19.2093 4.04039L20.9693 8.00039Z"/>
        </clipPath>
        <linearGradient id="paint0_linear_302_30275" x1="20.5" y1="9" x2="5.5" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDA40A" stopOpacity={0.4} style={{ stopColor: "#FDA40A", stopOpacity: 0.4 }}/>
          <stop offset="1" stopColor="#E55EE3" style={{ stopColor: "#E55EE3", stopOpacity: 1 }}/>
        </linearGradient>
        <linearGradient id="paint1_linear_302_30275" x1="15.5" y1="1" x2="21" y2="9" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0A60E1" style={{ stopColor: "#0A60E1", stopOpacity: 1 }}/>
          <stop offset="1" stopColor="#F05A25" stopOpacity={0.2} style={{ stopColor: "#F05A25", stopOpacity: 0.2 }}/>
        </linearGradient>
      </defs>
    </svg>
  );
};
