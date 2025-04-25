import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { MessageCircle, FileText, FileCheck, Download } from "lucide-react"
import ChatInterface from "../components/chatInterface"
import Sidebar from "../globalComponents/SideBar"
import ModelConfigsidebar from "../globalComponents/ModelConfigsidebar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip"
import { Trash } from "lucide-react";
import downloadConversation from "../hooks/downloadConversation"

export default function Home() {
  const [activeTab, setActiveTab] = useState("chat")
  const [conversation, setConversation] = useState("")

  const [model, setModel] = useState(localStorage.getItem("model") || "GPT-4o-mini");
  const [provider, setProvider] = useState(localStorage.getItem("provider") || "azureopenai");

  const [cleared, setCleared] = useState(false);

  // useEffect(() => {
  //   const storedModel = localStorage.getItem("model");
  //   const storedProvider = localStorage.getItem("provider");
  //   setModel(storedModel);
  //   setProvider(storedProvider);
  // }, []);

  const clearConversation = (tab) => {
    // Clear the conversation based on the active tab
    if (tab === "chat") {
      // Clear chat conversation logic
      setConversation("");
      localStorage.removeItem("chat-chatMessages")
      setCleared(true)
    }
      else if (tab === "digital-audit") {
        // Clear chat conversation logic
        setConversation("");
        localStorage.removeItem("digital-audit-chatMessages")
        setCleared(true)
    } else if (tab === "execute-analysis-scenario") {
      // Clear execute analysis scenario conversation logic
      setConversation("");
      localStorage.removeItem("execute-analysis-scenario-chatMessages")
      setCleared(true)
    } else if (tab === "document-intelligence") {
      // Clear document intelligence conversation logic
      setConversation("");
      localStorage.removeItem("document-intelligence-chatMessages")
      setCleared(true)
    }
  }

  const triggerConversationDownload = (tab) => {
    if (tab === "chat") {
      console.log('chat: ', conversation);
      downloadConversation(conversation)
    } else if (tab === "execute-analysis-scenario") {
      // Clear execute analysis scenario conversation logic
      console.log('execute: ', conversation);
      downloadConversation(conversation)

    } else if (tab === "document-intelligence") {
      // Clear document intelligence conversation logic
      console.log('document: ', conversation);
      downloadConversation(conversation)
    }
  }

  useEffect(() => {
    if (cleared) {
      const timeout = setTimeout(() => {
        setCleared(false)
      }, 100)
      return () => clearTimeout(timeout)
    }
  }, [cleared])


  return (
    <div className="flex h-[calc(100vh-3.9rem)] bg-slate-50 dark:bg-slate-900">
      <div className="mix-w-200 border-r bg-white dark:bg-slate-800 flex flex-col">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="border-b bg-white dark:bg-slate-800 px-6 py-3 flex items-center justify-between">
          <h1 className="text-xl font-semibold">
            {activeTab === "chat" && "New Chat"}
            {activeTab === "digital-audit" && "Digital Audit"}
            {activeTab === "execute-analysis-scenario" && "Execute Analysis Scenario"}
            {activeTab === "document-intelligence" && "Document Intelligence"}
          </h1>


          <div className="flex items-center space-x-10">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="hover:text-destructive transition-colors"
                    aria-label="Clear this conversation"
                    onClick={() => clearConversation(activeTab)}
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Clear this conversation</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    disabled={conversation.length>0 ? false : true}
                    className="hover:text-destructive transition-colors"
                    aria-label="Download this conversation"
                    onClick={() => triggerConversationDownload(activeTab)}
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download this conversation</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="text-sm text-muted-foreground flex flex-col items-end">
            {/* <div> */}

            {/* </div> */}
            <span className="font-medium">
              Provider: <span className="text-primary">{provider || "None"}</span>
            </span>
            <span className="font-medium">
              Model: <span className="text-primary">{model || "None"}</span>
            </span>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsContent value="chat" className="mt-0">
              <ChatInterface setConversation={setConversation} key={`chat-${cleared}`} action={'chat'} />
            </TabsContent>
            <TabsContent value="digital-audit" className="mt-0">
              <ChatInterface setConversation={setConversation} key={`digital-${cleared}`} action={'digital-audit'} />
            </TabsContent>
            <TabsContent value="execute-analysis-scenario" className="mt-0">
              <ChatInterface setConversation={setConversation} key={`execute-${cleared}`} action={'execute-analysis-scenario'} />
            </TabsContent>
            <TabsContent value="document-intelligence" className="mt-0">
              <ChatInterface setConversation={setConversation} key={`doc-${cleared}`} action={'document-intelligence'} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
      <div>
        <ModelConfigsidebar setModel={setModel} setProvider={setProvider} />
      </div>
    </div>
  )
}