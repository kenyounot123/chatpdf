"use client";

import { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/clerk-react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { SignInButton } from "@clerk/nextjs";

export default function FileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { isSignedIn } = useUser();
  const { toast } = useToast();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0].type === "application/pdf") {
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

  const handleUpload = async (e:React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!isSignedIn) {
      toast({
        variant: "destructive",
        title: "You are not signed in",
        description: "Please sign in before uploading a pdf",
        action: (
          <SignInButton mode="modal">
            <ToastAction altText="Sign in">Sign In</ToastAction>
          </SignInButton>
        ),
      });
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file as Blob);
    if (file) {
      // Use convex mutations to handle uploading the pdf to our s3 bucket
      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (!response.ok) {
          throw new Error("Could not upload file");
        }

        const { fileName } = await response.json();
        console.log("File uploaded successfully!");
        router.push(`/chat?file=${encodeURIComponent(fileName)}`);
      } catch (error) {
        console.log("Error while sending file to server", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const triggerFileSelect = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (inputRef.current) {
      inputRef.current.click(); 
    }
  };

  return (
    <form>
      <div
        {...getRootProps()}
        className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-primary bg-primary/10"
            : "border-gray-300 hover:border-primary"
        }`}
      >
        <input
          type="file"
          accept="application/pdf"
          ref={inputRef}
          className="hidden" 
          onChange={(e) => onDrop(Array.from(e.target.files || []))}
        />
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
        <Button
          disabled={loading}
          onClick={(e) => handleUpload(e)}
          className="mt-2 w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading
            </>
          ) : (
            "Upload"
          )}
        </Button>
      ) : (
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-500">Or</span>
          <Button
            onClick={(e) => triggerFileSelect(e)}
            className="mt-2 w-full"
          >
            Select PDF
          </Button>
        </div>
      )}
    </form>
  );
}