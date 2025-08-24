import { useState } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa6";

const faqs = [
  {
    question: "What Is Devalyze?",
    answer:
      "Devalyze is a simple tool that helps you shorten long URLs and create QR codes, So you can share links more easily and track how people interact with them.",
  },
  {
    question: "How Do I Shorten A Link?",
    answer:
      "Just paste your long URL into the input box on Devalyze, click the “Shorten” button, and your clean, short link will be ready to use.",
  },
  {
    question: "Can I Create QR Codes Too??",
    answer:
      "Yes! Devalyze lets you instantly turn any link into a scannable QR code that you can download and use anywhere — online or offline.",
  },
  {
    question: "Do I Need An Account To Use Devalyze?",
    answer:
      "Yes! Devalyse gives you real-time insights like number of clicks, scans, location, and more all in your dashboard.",
  },
  {
    question: "Can I Customize My Short Links?",
    answer:
      "Yes!, you can change the end of your links (e.g., devalyze.me/yourname) to match your brand or campaign.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="max-w-full min-h-screen p-6 md:p-20 flex flex-col gap-7 bg-blue-900">
      <div>
        <p className="text-blue-400 font-medium">FAQ</p>
        <h1 className="text-3xl text-white font-bold mb-8 leading-tight">
          Frequently Asked <br />
          Questions
        </h1>
      </div>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border-b-8 border-blue-500 p-6 bg-white rounded-md shadow"
          >
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleFAQ(index)}
            >
              <h3 className="text-lg font-semibold">{faq.question}</h3>
              <span className="text-xl text-blue-600">
                {openIndex === index ? <FaArrowUp className="text-black"/> : <FaArrowDown className="text-black"/>}
              </span>
            </div>
            {openIndex === index && (
              <p className="mt-3 text-gray-600">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
