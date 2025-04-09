import { cn } from "../../lib/utils";
import React, { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Send, Paperclip, XCircle, Loader2, FileText } from "lucide-react";
import { AI_PLAYGROUND_WORKFLOWS } from "../../redux/actions/invoiceActions";
// import { Avatar } from "../../../components/ui/avatar";
import { Card, CardContent } from "../../../components/ui/card";

const UserInputs = ({ promptInputValue, setMessages }) => {
  const [inputValue, setInputValue] = useState("");
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const flowId = AI_PLAYGROUND_WORKFLOWS.AGENT.flowId;

  useEffect(() => {
    setInputValue(promptInputValue);
  }, [promptInputValue]);

  const handleSubmit = async () => {
    if (inputValue.trim() || files.length) {
      setUploading(true);
      const newMessages = [];

      if (inputValue.trim()) {
        newMessages.push({ role: "user", content: inputValue });
      }

      files.forEach((file) => {
        newMessages.push({ role: "user", content: `Attached file: ${file.name}`, isFile: true, fileName: file.name });
      });

      setMessages((prev) => [...prev, ...newMessages]);

      try {
        const payload = {
          input_value: inputValue,
          output_type: "chat",
          input_type: "chat",
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
            setMessages((prev) => [...prev, { role: "assistant", content: aiResponse }]);
          }
        } else {
          console.error("Failed to fetch AI response");
        }
      } catch (error) {
        console.error("Error:", error);
      }

      setInputValue("");
      setFiles([]);
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (files.length + selectedFiles.length <= 10) {
      setFiles((prev) => [...prev, ...selectedFiles]);
    } else {
      alert("You can upload a maximum of 10 files.");
    }
  };

  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      {files.length > 0 && (
        <div className="flex space-x-2 mb-1 overflow-x-auto">
          {files.map((file, index) => (
            <Card key={index} className="flex items-center space-x-2 p-2 rounded-lg text-sm">
              {/* <Avatar className="bg-gray-200 p-1">
                <FileText className="h-4 w-4 text-gray-600" />
              </Avatar> */}
              <CardContent className="p-0 truncate">{file.name}</CardContent>
              <button onClick={() => handleRemoveFile(index)}>
                <XCircle className="h-4 w-4 text-red-500 hover:text-red-700" />
              </button>
            </Card>
          ))}
        </div>
      )}

      <div className="flex items-center space-x-3 border p-2 rounded-lg shadow-md">
        <label htmlFor="file-upload" className="cursor-pointer flex items-center">
          <Paperclip className="h-5 w-5 text-gray-500 hover:text-gray-700 transition-colors" />
          <input
            id="file-upload"
            type="file"
            className="hidden"
            multiple
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.xlsx,.csv,.png,.jpg,.jpeg,.mp3"
          />
        </label>

        <textarea
          placeholder="Type your message here..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSubmit()}
          className={cn(
            "flex-1 h-20 resize-none rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-400 transition-all",
            uploading ? "cursor-not-allowed bg-gray-100 text-gray-400" : ""
          )}
          disabled={uploading}
        />

        <Button
          style={{ cursor: "pointer" }}
          onClick={handleSubmit}
          type="submit"
          disabled={uploading}
          className="bg-black hover:bg-gray-800 transition-all"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default UserInputs;