import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../../srccomponents/ui/select.jsx"
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "../lib/utils";
import { handler } from "tailwindcss-animate";

const MODEL_PROVIDERS = {
  azureopenai: ["o3-mini","GPT-4o", "GPT-3.5-turbo", "GPT-4o-mini", "GPT-o3-mini"],
  awsbedrock: ["Cladue 3.7 Sonnet v2", "Claude 3.5 Sonnet v2", "Claude 3.5 Haiku", "Calude 3 Haiku"],
};

const DEFAULT_PROVIDER = "azureopenai";
const DEFAULT_MODEL = "GPT-4o-mini";

const ModelConfigSidebar = ({ setModel, setProvider }) => {
  const [collapsed, setCollapsed] = useState(true);
  const [provider, setLocalProvider] = useState(DEFAULT_PROVIDER);
  const [model, setLocalModel] = useState(DEFAULT_MODEL);


  useEffect(() => {
    setProvider("azureopenai");
    setModel("GPT-4o-mini");
    localStorage.setItem("provider", "azureopenai");
    localStorage.setItem("model", "GPT-4o-mini");
  }, []);

  const handleProviderChange = (value) => {
    setLocalProvider(value);
    setProvider(value);

    // Set default model based on provider
    const defaultModel = value === "awsbedrock" ? "Claude 3.5 Sonnet v2" : "GPT-4o-mini";

    setLocalModel(defaultModel);
    setModel(defaultModel);

    localStorage.setItem("provider", value);
    localStorage.setItem("model", defaultModel);
  };


  const handleModelChange = (value) => {
    setLocalModel(value);
    setModel(value);
    localStorage.setItem("model", value);
  };

  return (
    <div
      className={cn(
        "h-full transition-all border-r bg-white dark:bg-slate-800 p-4 flex flex-col",
        collapsed ? "w-16" : "w-80"
      )}
    >
      <div className="mb-4 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="shrink-0"
        >
          {collapsed ? (
            <ChevronLeft className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </Button>
        {!collapsed && (
          <p className="text-sm text-muted-foreground my-2 ml-2 font-bold">
            Model Configuration
          </p>
        )}
      </div>

      {!collapsed && (
        <Card>
          <CardContent className="p-4 space-y-4">
            <div>
              <Label className="text-sm font-semibold">Select Model Provider</Label>
              <Select value={provider} onValueChange={handleProviderChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose Provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="azureopenai">Azure OpenAI</SelectItem>
                  <SelectItem value="awsbedrock">AWS Bedrock</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Model Selection */}
            {/* Model Selection */}
            {provider && (
              <div>
                <Label className="text-sm font-semibold">Select Model</Label>
                <Select value={model} onValueChange={() => { }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose Model" />
                  </SelectTrigger>
                  <SelectContent>
                    {MODEL_PROVIDERS[provider].map((m) => (
                      <SelectItem key={m} value={m} disabled>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ModelConfigSidebar;