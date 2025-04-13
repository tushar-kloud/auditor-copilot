import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send, Paperclip, Loader2 } from "lucide-react";
import FileUploadDialog from "./FileUploadDialog";
import { cn } from "../../lib/utils";
import { AI_PLAYGROUND_WORKFLOWS } from "../../redux/actions/auditActions";

const UserInputs = ({ promptInputValue, setMessages }) => {
  const [inputValue, setInputValue] = useState("");
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const model = localStorage.getItem("model") || "gpt-4.o-mini";
  const provider = localStorage.getItem("provider") || "azure openai";
  const flowId = AI_PLAYGROUND_WORKFLOWS.AGENT.flowId;

  // Effect to sync with promptInputValue changes
  useEffect(() => {
    setInputValue(promptInputValue);
  }, [promptInputValue]);

  // Effect to sync with localStorage loading state changes
  useEffect(() => {
    // Initial load of localStorage value
    const loading = localStorage.getItem("responseloading");
    setUploading(loading === "true");

    // Set up event listener for localStorage changes
    const handleStorageChange = (e) => {
      if (e.key === "responseloading") {
        setUploading(e.newValue === "true");
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Poll for localStorage changes (backup for same-tab changes)
    const intervalId = setInterval(() => {
      const currentLoading = localStorage.getItem("responseloading");
      setUploading(currentLoading === "true");
    }, 500);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(intervalId);
    };
  }, []);

  const handleSubmit = async () => {
    if (inputValue.trim() || files.length) {
      // Update local state immediately
      setUploading(true);
      // Update localStorage
      localStorage.setItem("responseloading", "true");
      
      const newMessages = [];

      if (inputValue.trim()) {
        newMessages.push({ role: "user", content: inputValue, model, provider });
      }

      files.forEach((file) => {
        newMessages.push({
          role: "user",
          content: `Attached file: ${file.name}`,
          isFile: true,
          fileName: file.name,
          model,
          provider,
        });
      });

      setMessages((prev) => [...prev, ...newMessages]);

      try {
        const payload = {
          input_value: `Use ${provider} resource to answer the following question: '${inputValue}'`,
          output_type: "chat",
          input_type: "chat",
          tweaks:{
            "Chroma-ZPruW": {
              "allow_duplicates": false,
              "chroma_server_cors_allow_origins": "",
              "chroma_server_grpc_port": null,
              "chroma_server_host": "",
              "chroma_server_http_port": null,
              "chroma_server_ssl_enabled": false,
              "collection_name": "auditor-rag-session",
              "limit": null,
              "number_of_results": 10,
              "persist_directory": "auditor-copilot",
              "search_query": "",
              "search_type": "Similarity",
              "should_cache_vector_store": true
            }
          }
        };

        const response = await fetch(
          `${import.meta.env.VITE_AI_PLAYGROUND_BASE_URL}/api/v1/run/${flowId}?stream=false`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": `${import.meta.env.VITE_AI_PLAYGROUND_API_KEY}`,
            },
            body: JSON.stringify(payload),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const aiResponse = data?.outputs?.[0]?.outputs?.[0]?.results?.message?.data?.text;
          if (aiResponse) {
            setMessages((prev) => [
              ...prev,
              {
                role: "assistant",
                content: aiResponse,
                model,
                provider,
              },
            ]);
          }
        } else {
          console.error("Failed to fetch AI response");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        // Always ensure loading state is properly reset
        setUploading(false);
        localStorage.setItem("responseloading", "false");
      }

      setInputValue("");
      setFiles([]);
    }
  };

  const handleModalUpload = (newFiles) => {
    setFiles((prev) => [...prev, ...newFiles]);
  };

  return (
    <div>
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm max-w-xs truncate"
            >
              <span className="truncate">{file.name}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center space-x-3 border p-2 rounded-lg shadow-md">
        <FileUploadDialog
          trigger={<Paperclip className="h-5 w-5 text-gray-500 hover:text-gray-700 cursor-pointer" />}
          onFilesUploaded={handleModalUpload}
        />

        <textarea
          placeholder="Type your message here..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSubmit()}
          className={cn(
            "flex-1 h-20 resize-none rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-400",
            uploading ? "cursor-not-allowed bg-gray-100 text-gray-400" : ""
          )}
          disabled={uploading}
        />

        <Button
          onClick={handleSubmit}
          disabled={uploading}
          className="bg-black hover:bg-gray-800"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default UserInputs;