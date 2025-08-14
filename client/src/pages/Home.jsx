import React from "react";

function Home() {
  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/github`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">
        Test Case Generator
      </h1>
      <button
        onClick={handleLogin}
        className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors duration-300 shadow-md"
      >
        Login with GitHub
      </button>
    </div>
  );
}

export default Home;
