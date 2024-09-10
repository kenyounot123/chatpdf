"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Homepage() {
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0].type === "application/pdf") {
      console.log(acceptedFiles[0]);
      setFile(acceptedFiles[0]);
    } else {
      alert("Please upload a PDF file");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
  });

  const removeFile = () => setFile(null);

  const handleUpload = async () => {
    // send the file to the server
    const formData = new FormData();
    formData.append("file", file as Blob);
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.redirected) {
        // Handle the redirection in the client
        window.location.href = response.url; // Follow the redirect manually
      } else {
        console.log("Upload failed or no redirect");
      }
    } catch (error) {
      console.log("Error while sending file to server", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center text-primary">
        PDF Uploader
      </h1>
      <div
        {...getRootProps()}
        className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-primary bg-primary/10"
            : "border-gray-300 hover:border-primary"
        }`}
      >
        <input {...getInputProps()} />
        {file ? (
          <div className="flex items-center justify-center space-x-2">
            <File className="w-6 h-6 text-primary" />
            <span className="font-medium text-primary">{file.name}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                removeFile();
              }}
              className="ml-2"
            >
              <X className="w-4 h-4 text-primary" />
              <span className="sr-only">Remove file</span>
            </Button>
          </div>
        ) : (
          <div>
            <Upload className="w-12 h-12 mx-auto text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Drag and drop your PDF here, or click to select
            </p>
          </div>
        )}
      </div>
      {file ? (
        <Button onClick={handleUpload} className="mt-2 w-full">
          Upload
        </Button>
      ) : (
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-500">Or</span>
          <Button
            onClick={() => document.querySelector("input")?.click()}
            className="mt-2 w-full"
          >
            Select PDF
          </Button>
        </div>
      )}
    </div>
  );
}
