import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { MessageCircle, FileText, FileCheck } from "lucide-react"
// import InvoiceGeneration from "@/components/invoiceGeneration.jsx"
// import ReconcilePO from "@/components/reconcilePo.jsx"
// import ChatInterface from "@/components/chatInterface.jsx"
// import InvoiceGeneration from "../components/invoiceGeneration"
// import ReconcilePO from "../components/reconcilePo"
import ChatInterface from "../components/chatInterface"
import Sidebar from "../globalComponents/SideBar"
import ModelConfigsidebar from "../globalComponents/ModelConfigsidebar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip"
import { Trash } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("chat")
  const [message, setMessage] = useState("")

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
      setMessage("");
      localStorage.removeItem("digital-audit-chatMessages")
      setCleared(true)
    } else if (tab === "execute-analysis-scenario") {
      // Clear execute analysis scenario conversation logic
      setMessage("");
      localStorage.removeItem("execute-analysis-scenario-chatMessages")
      setCleared(true)
    } else if (tab === "document-intelligence") {
      // Clear document intelligence conversation logic
      setMessage("");
      localStorage.removeItem("document-intelligence-chatMessages")
      setCleared(true)
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
            {activeTab === "chat" && "Digital Audit"}
            {activeTab === "execute-analysis-scenario" && "Execute Analysis Scenario"}
            {activeTab === "document-intelligence" && "Document Intelligence"}
          </h1>

          {/* Model & Provider Info */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="mb-2 hover:text-destructive transition-colors"
                  aria-label="Clear this conversation"
                  onClick={() => {
                    // your clear conversation logic here
                    clearConversation(activeTab)
                  }}
                >
                  <Trash className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Clear this conversation</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

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
              <ChatInterface key={`chat-${cleared}`} action={'digital-audit'} />
            </TabsContent>
            <TabsContent value="execute-analysis-scenario" className="mt-0">
              <ChatInterface key={`execute-${cleared}`} action={'execute-analysis-scenario'} />
            </TabsContent>
            <TabsContent value="document-intelligence" className="mt-0">
              <ChatInterface key={`doc-${cleared}`} action={'document-intelligence'} />
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