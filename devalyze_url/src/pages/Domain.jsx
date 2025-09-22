// src/pages/DomainPage.jsx
import { FaCog } from "react-icons/fa";

export default function DomainPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <FaCog className="mx-auto text-gray-500 animate-spin-slow" size={60} />
        <h2 className="mt-4 text-xl font-semibold text-gray-700">
          Domain Page – Coming Soon
        </h2>
        <p className="text-gray-500 mt-2">
          We’re working hard to bring this feature to life.
        </p>
      </div>
    </div>
  );
}
