'use client';

import { useState } from 'react';

export default function FileUploader({ onUpload }) {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return;
    const text = await file.text(); // .txt only
    onUpload(text);
  };

  return (
    <div className="mt-48">
      <label className="block mb-2 text-sm font-medium text-gray-700">
        Upload a File
      </label>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="block w-full text-sm text-gray-600 border border-gray-300 rounded-md cursor-pointer bg-gray-50 focus:outline-none"
      />
      <button
        onClick={handleUpload}
        className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        Upload
      </button>
    </div>
  );
}
