"use client";
import { useEffect, useState } from "react";

export default function Chat() {
  const [content, setContent] = useState("");
  const [metadata, setMetadata] = useState({});

  useEffect(() => {
    const getPdfResults = async () => {
      try {
        const response = await fetch("/api/upload");
        if (!response.ok) throw new Error("Failed to fetch PDF results");

        const data = await response.json();
        setContent(data.content);
        setMetadata(data.metadata);
      } catch (error) {
        console.error("Error fetching PDF results:", error);
      }
    };

    getPdfResults();
  }, []);

  return (
    <div>
      <h1>PDF Content</h1>
      <p>{content}</p>
    </div>
  );
}
