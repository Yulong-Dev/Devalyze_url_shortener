import React from "react";

const logos = [
  "/logos/apple.png",
  "/logos/microsoft.png",
  "/logos/doordash.png",
  "/logos/netflix.png",
  "/logos/google.png",
  "/logos/slack.png",
];

const TrustedBy = () => {
  // Duplicate the logos to create a seamless scrolling effect
  const repeatedLogos = [...logos, ...logos];

  return (
    <div className="relative overflow-hidden bg-white py-6">
      <div className="whitespace-nowrap animate-marquee">
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
