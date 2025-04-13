import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { uploadFileAPI } from "../../redux/actions/auditActions";

// import { useDispatch } from "react-redux";

export default function FileUploadDialog({ onFilesUploaded, trigger }) {
  const fileInputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

//   const dispatch = useDispatch();

  const handleFileDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const limitedFiles = files.slice(0, 5 - uploadedFiles.length);
    const newFiles = limitedFiles.map((file) => ({
      file,
      status: "pending", // 'pending' | 'uploading' | 'success' | 'error'
    }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleRemove = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    const results = [];
    const updatedFiles = [...uploadedFiles];
  
    console.log("Checking files for upload...");
    for (let i = 0; i < uploadedFiles.length; i++) {
      const item = uploadedFiles[i];
  
      // Skip already uploaded files
      if (item.status === "success") {
        continue;
      }
  
      // Set status to 'uploading'
      updatedFiles[i] = { ...item, status: "uploading" };
      setUploadedFiles([...updatedFiles]);
  
      try {
        console.log("Uploading file:", item.file.name);
        const fileData =  await uploadFileAPI(item.file);
        // console.log('response: ',fileData.file_path);
        updatedFiles[i] = { ...item, status: "success", filePath: fileData.file_path };
        // results.push(item.file);

        const prevFiles = JSON.parse(localStorage.getItem("uploadedFiles") || "[]");
        localStorage.setItem(
          "uploadedFiles",
          JSON.stringify([
            ...prevFiles,
            { fileName: item.file.name, filePath: fileData.file_path },
          ])
        );
      } catch (error) {
        updatedFiles[i] = { ...item, status: "error" };
        console.error("Upload failed for", item.file.name, error);
      }
  
      setUploadedFiles([...updatedFiles]);
    }
  
    const successfulFiles = results.map((f) => f.name);
    const prev = JSON.parse(localStorage.getItem("uploadedFiles") || "[]");
    localStorage.setItem("uploadedFiles", JSON.stringify([...prev, ...successfulFiles]));
  
    if (results.length > 0) {
      onFilesUploaded(results);
    }
  };
  
  
  const getStatusText = (status) => {
    switch (status) {
      case "uploading":
        return "Uploading...";
      case "success":
        return "Uploaded ✅";
      case "error":
        return "Failed ❌";
      default:
        return "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent
        className="sm:max-w-md"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleFileDrop}
      >
        <DialogHeader>
          <DialogTitle>Add content to chat</DialogTitle>
        </DialogHeader>

        <div
          className="border-dashed border-2 border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer"
          onClick={() => fileInputRef.current.click()}
        >
          <p>Drag and drop a file here, or click to select</p>
          <p className="text-sm text-gray-500">({uploadedFiles.length}/5 files)</p>
          <input
            ref={fileInputRef}
            type="file"
            hidden
            multiple
            accept=".pdf,.doc,.docx,.xlsx,.csv,.png,.jpg,.jpeg,.mp3"
            onChange={handleFileInput}
          />
        </div>

        {uploadedFiles?.length > 0 && (
          <div className="mt-4 space-y-1 text-sm max-h-32 overflow-y-auto">
            {uploadedFiles?.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center border rounded px-2 py-1"
              >
                <span className="truncate flex-1">{item.file.name}</span>
                <span className="ml-2 text-xs text-gray-500">{getStatusText(item.status)}</span>
                {item.status !== "uploading" && (
                  <button
                    onClick={() => handleRemove(idx)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        <DialogFooter className="mt-4">
          <Button onClick={handleUpload} disabled={uploadedFiles.length === 0}>
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
