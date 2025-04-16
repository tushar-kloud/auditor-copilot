import { useState } from "react";
import { ChevronLeft, ChevronRight, MessageCircle, FileText, FileCheck, Settings, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "../lib/utils"

const Sidebar = ({ activeTab, setActiveTab }) => {
  const [collapsed, setCollapsed] = useState(false);
  //   const [activeTab, setActiveTab] = useState("chat");

  return (
    <div
      className={cn(
        // h-full
        "h-full transition-all border-r bg-white dark:bg-slate-800 p-4 flex flex-col",
        collapsed ? "w-16" : "w-140"
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <span>
          {/* {!collapsed && (
          <h2 className="text-2xl font-bold text-primary">Invoice AI</h2>
        )} */}
          {!collapsed && (
            <p className="text-sm text-muted-foreground my-2">
              As your personal assistant, I can help you with the following tasks...
            </p>
          )}
        </span>
        <span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="shrink-0"
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </Button>
        </span>
      </div>

      {/* {!collapsed && (
        // <p className="text-sm text-muted-foreground mb-8">
        //   Your personal invoice assistant
        // </p>
      )} */}

      <nav className="space-y-2 flex-1">
        <Button
          variant={activeTab === "chat" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("chat")}
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          {!collapsed && "Digital Audit"}
        </Button>
        {/* <Button
          variant={activeTab === "generate" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("digital-audit")}
        >
          <FileText className="mr-2 h-4 w-4" />
          {!collapsed && "Digital Audit"}
        </Button> */}
        <Button
          variant={activeTab === "execute-analysis-scenario" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("execute-analysis-scenario")}
        >
          <FileCheck className="mr-2 h-4 w-4" />
          {!collapsed && "Execute Analysis Scenario"}
        </Button>
        <Button
          variant={activeTab === "document-intelligence" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("document-intelligence")}
        >
          <FileText className="mr-2 h-4 w-4" />
          {!collapsed && "Document Intelligence"}
        </Button>
        <Button
          disabled
          variant={"ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("document-intelligence")}
        >
          {/* <FileText  /> */}
          <Rocket className="mr-2 h-4 w-4" />
          {!collapsed && "Use-Case Labs"}
        </Button>
      </nav>

      <div className="mt-auto pt-4 border-t">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
            U
          </div>
          {!collapsed && (
            <div className="ml-2">
              <p className="text-sm font-medium">User Account</p>
            </div>
          )}
        </div>
        <Button variant="outline" size="sm" className="w-full">
          <Settings className="w-4 h-4 mr-2" />
          {!collapsed && "Settings"}
        </Button>
      </div>
    </div>
  );
}

export default Sidebar