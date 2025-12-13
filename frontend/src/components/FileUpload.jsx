import React, { useState, useRef } from 'react';
import { FiUpload, FiX } from 'react-icons/fi';

const FileUpload = ({ onFileSelect, accept = 'image/*', label = 'Upload Image' }) => {
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Pass file to parent
      onFileSelect(file);
    }
  };

  const handleClear = () => {
    setPreview(null);
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onFileSelect(null);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      
      {!preview ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-primary-300 rounded-xl p-8 text-center cursor-pointer hover:border-primary-500 hover:bg-primary-50/50 transition-all duration-200"
        >
          <FiUpload className="w-12 h-12 mx-auto text-primary-500 mb-3" />
          <p className="text-gray-600 font-medium">Click to upload or drag and drop</p>
          <p className="text-sm text-gray-400 mt-1">PNG, JPG, GIF up to 5MB</p>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover rounded-xl shadow-lg"
          />
          <button
            onClick={handleClear}
            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
          >
            <FiX className="w-5 h-5" />
          </button>
          <p className="mt-2 text-sm text-gray-600 truncate">{fileName}</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
