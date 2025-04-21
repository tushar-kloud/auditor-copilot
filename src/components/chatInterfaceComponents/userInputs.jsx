import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send, Paperclip, Loader2, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Badge } from "../../../components/ui/badge";
import FileUploadDialog from "./FileUploadDialog";
import { cn } from "../../lib/utils";
import { starterSuggestionsArray } from "../../globalConstants/useCaseConstants";
import { AI_PLAYGROUND_WORKFLOWS } from "../../redux/actions/auditActions";

const UserInputs = ({ showSuggestions, promptInputValue, setMessages }) => {
  const [inputValue, setInputValue] = useState("");
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);

  // const [suggestionVisible, setSuggestionVisible] = useState(showSuggestions || false);

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
          input_value: `Use ${provider} ${model.toLocaleLowerCase()} resource to answer the following question: '${inputValue}'`,
          output_type: "chat",
          input_type: "chat",
          // tweaks: {
          //   "Chroma-ZPruW": {
          //     "allow_duplicates": false,
          //     "chroma_server_cors_allow_origins": "",
          //     "chroma_server_grpc_port": null,
          //     "chroma_server_host": "",
          //     "chroma_server_http_port": null,
          //     "chroma_server_ssl_enabled": false,
          //     "collection_name": "auditor-rag-session",
          //     "limit": null,
          //     "number_of_results": 10,
          //     "persist_directory": "auditor-copilot",
          //     "search_query": "",
          //     "search_type": "Similarity",
          //     "should_cache_vector_store": true
          //   }
          // }
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


  const handlePromptClick = (prompt) => {
    setInputValue(prompt);
    setDialogOpen(false);
    setSelectedCategory(null);
    setSelectedTopic(null);
  };

  const resetSelections = () => {
    setSelectedTopic(null);
  };

  const getCurrentCategory = () => {
    return starterSuggestionsArray.find(category => category.id === selectedCategory);
  };

  const getCurrentTopic = () => {
    const category = getCurrentCategory();
    if (!category || !selectedTopic) return null;
    return category.topics.find(topic => topic.label === selectedTopic);
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
        {showSuggestions && (
          <Button
          variant="ghost"
          size="icon"
          onClick={() => setDialogOpen(true)}
          className="h-9 w-9 rounded-full p-0"
          title="Conversation starters"
        >
          <Sparkles className="h-5 w-5 text-indigo-500 hover:text-indigo-700" />
        </Button>
        )}

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
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">
              Conversation Starters
            </DialogTitle>
          </DialogHeader>
          
          <div className="mt-4">
            {/* Category Selection */}
            {!selectedCategory && (
              <div className="space-y-6">
                <div className="text-center text-gray-600">
                  Choose a category to get started
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                  {starterSuggestionsArray.map((category) => (
                    <Badge
                      key={category.id}
                      className={`${category.color} px-4 py-2 rounded-full shadow-sm font-medium cursor-pointer`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {category.label}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Selected Category View */}
            {selectedCategory && !selectedTopic && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-800">
                    {getCurrentCategory()?.label}
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedCategory(null)}
                    className="text-sm text-gray-500"
                  >
                    Back to categories
                  </Button>
                </div>

                <div className="text-center text-gray-600 p-2">
                  {getCurrentCategory()?.heroMessage}
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                  {getCurrentCategory()?.topics.map((topic) => (
                    <Badge
                      key={topic.label}
                      className={`${topic.color} px-4 py-2 rounded-full shadow-sm font-medium cursor-pointer`}
                      onClick={() => setSelectedTopic(topic.label)}
                    >
                      {topic.label}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Topic Prompts View */}
            {selectedCategory && selectedTopic && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${getCurrentTopic()?.color}`}></span>
                      {selectedTopic}
                    </h3>
                    <p className="text-sm text-gray-500">{getCurrentCategory()?.label}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={resetSelections}
                    className="text-sm text-gray-500"
                  >
                    Back to topics
                  </Button>
                </div>

                <div className="mt-4 space-y-2">
                  {getCurrentTopic()?.prompts.map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full text-left p-3 justify-start rounded-md text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-300"
                      onClick={() => handlePromptClick(prompt)}
                    >
                      <span className="font-medium">{prompt}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserInputs;