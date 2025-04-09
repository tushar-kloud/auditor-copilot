// import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
// import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
// import { ChevronDown, Paperclip } from "lucide-react";
import { useEffect, useState } from "react";
import UserInputs from "./userInputs";
import { starterSuggestionsArray } from "../../globalConstants/useCaseConstants";

const StarterSuggestions = ({ suggestionObjectId, messages, setMessages }) => {
    const [inputValue, setInputValue] = useState("")
    const [suggestionsObject, setSuggestionsObject] = useState([])

    const [selectedSuggestion, setSelectedSuggestion] = useState(null);

    const handlePromptClick = (prompt) => {
        setInputValue(prompt)
    };

    useEffect(() => {
       suggestionObjectId && setSuggestionsObject(starterSuggestionsArray.find(item => item.id === suggestionObjectId))
       

    }, [inputValue, suggestionObjectId])

    return (
        <div className="flex flex-col items-center justify-center px-4 space-y-6 text-center bg-gray-50 py-10">
            <div className="flex flex-col items-center justify-center text-center">
                <h2 className="text-3xl font-extrabold text-gray-800">
                    {suggestionsObject?.heroMessage ? suggestionsObject?.heroMessage : "How can I assist with your audit needs today?"}
                </h2>
                <div style={{ minWidth: '600px', marginTop: 30, marginBottom: 40 }}>
                    <UserInputs promptInputValue={inputValue} setMessages={setMessages} />
                </div>
                <div>
                    <p style={{ fontSize: '20px', marginBottom: '20px' }}>Or choose from the options below...</p>
                </div>

                {/* <div className="justify-center"> */}

                <div className="flex flex-wrap justify-center gap-3">
                    {suggestionsObject?.topics?.map((suggestion) => (
                        <Badge
                            key={suggestion.label}
                            className={`${suggestion.color} px-4 py-2 rounded-full shadow-sm font-medium cursor-pointer`}
                            onClick={() => setSelectedSuggestion(suggestion.label === selectedSuggestion ? null : suggestion.label)}
                        >
                            {suggestion.label}
                        </Badge>
                    ))}
                </div>
                {selectedSuggestion && (
                    <div className="mt-4 w-2/3 bg-white shadow-lg rounded-lg p-6 border border-gray-200">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Select a prompt for <span className="text-indigo-400">{selectedSuggestion}</span></h3>
                        <div className="mt-4 space-y-4">
                            {suggestionsObject?.topics?.find(s => s.label === selectedSuggestion).prompts.map((prompt, index) => (
                                <Button
                                    key={index}
                                    variant="outline"
                                    className="w-full text-left p-3 rounded-md text-gray-700 hover:bg-indigo-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-300 ease-in-out"
                                    onClick={() => handlePromptClick(prompt)}
                                >
                                    <span className="font-medium">{prompt}</span>
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
                {/* </div> */}
            </div>
            <p className="absolute bottom-10 text-sm text-gray-500 mt-6">
                <span className="italic font-semibold text-gray-700">AMY</span> could make mistakes. Please verify important information.
            </p>
        </div>
    );
};

export default StarterSuggestions;
