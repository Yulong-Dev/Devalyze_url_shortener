import React from "react";
import "../index.css"; 

const logos = [
  "/logos/zapier.png",
  "/logos/survey.png",
  "/logos/netflix.png",
  "/logos/doordash.png",
  "/logos/google.png",
  "/logos/Figma.png",
  "/logos/amazon.webp",
  "/logos/apple.png",
  "/logos/spotify.png",
];

const TrustedBy = () => {
  const repeatedLogos = [...logos, ...logos];

  return (
    <div className="relative overflow-hidden bg-gray-100 py-6 w-[50%] mx-auto">
      {/* Left fade edge */}
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-gray-100 to-transparent z-10 pointer-events-none"></div>
      {/* Right fade edge */}
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-gray-100 to-transparent z-10 pointer-events-none"></div>
      
      <div className="whitespace-nowrap marquee px-4">
        {repeatedLogos.map((logo, index) => (
          <img
            key={index}
            src={logo}
            alt={`Trusted logo ${index}`}
            className="inline-block h-10 mx-8 object-contain"
          />
        ))}
      </div>
    </div>
  );
};

export default TrustedBy;