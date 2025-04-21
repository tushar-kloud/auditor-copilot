import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../../srccomponents/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "../lib/utils";

const MODEL_PROVIDERS = {
  'azure openai': [
    { name: "GPT-4o", available: false },
    { name: "GPT-3.5-turbo", available: false },
    { name: "GPT-4o-mini", available: true },
    { name: "o3-mini", available: true },
  ],
  'awsbedrock': [
    { name: "Claude 3.7 Sonnet v2", available: false },
    { name: "Claude 3.5 Sonnet", available: true },
    { name: "Claude 3.5 Haiku", available: false },
    { name: "Claude 3 Haiku", available: false },
  ],
};

const DEFAULT_PROVIDER = "azure openai";
const DEFAULT_MODEL = "o3-mini";

const ModelConfigSidebar = ({ setModel, setProvider }) => {
  const [collapsed, setCollapsed] = useState(true);
  const [provider, setLocalProvider] = useState(DEFAULT_PROVIDER);
  const [model, setLocalModel] = useState(DEFAULT_MODEL);

  useEffect(() => {
    // Load from localStorage if available, otherwise use defaults
    const savedProvider = localStorage.getItem("provider") || DEFAULT_PROVIDER;
    const savedModel = localStorage.getItem("model") || DEFAULT_MODEL;

    setLocalProvider(savedProvider);
    setProvider(savedProvider);

    setLocalModel(savedModel);
    setModel(savedModel);
  }, [setProvider, setModel]);

  const handleProviderChange = (value) => {
    setLocalProvider(value);
    setProvider(value);

    // Set default model based on provider - pick first available model
    // const availableModels = MODEL_PROVIDERS[value].filter(model => model.available);
    // const defaultModel = availableModels.length > 0 ? availableModels[0].name : "";

    const models = MODEL_PROVIDERS[value] || [];
    const availableModels = models.filter(model => model.available);
    const defaultModel = availableModels.length > 0 ? availableModels[0].name : "";

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

  useEffect(() => {
    if (!localStorage.getItem("model")) {
      localStorage.setItem("model", DEFAULT_MODEL)
    }
    if (!localStorage.getItem("provider")) {
      localStorage.setItem("provider", DEFAULT_PROVIDER)
    }
  })

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
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
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
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose Provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="azure openai">Azure OpenAI</SelectItem>
                  <SelectItem value="awsbedrock">AWS Bedrock</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {provider && (
              <div>
                <Label className="text-sm font-semibold">Select Model</Label>
                <Select value={model} onValueChange={handleModelChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose Model" />
                  </SelectTrigger>
                  <SelectContent>
                    {MODEL_PROVIDERS[provider].map((modelOption) => (
                      <SelectItem
                        key={modelOption.name}
                        value={modelOption.name}
                        disabled={!modelOption.available}
                      >
                        {modelOption.name}
                        {!modelOption.available && " (unavailable)"}
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