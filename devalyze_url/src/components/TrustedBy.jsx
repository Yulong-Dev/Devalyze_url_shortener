import React from "react";

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
  // Duplicate the logos to create a seamless scrolling effect
  const repeatedLogos = [...logos, ...logos];

  return (
    <div className="relative overflow-hidden bg-transparent py-6">
      <div className="whitespace-nowrap animate-marquee px-4">
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
