import React, { useEffect, useState, useRef } from 'react'
import { cn } from "../../lib/utils"
import { Card, CardContent } from "@/components/ui/card"

// Utility function to parse markdown-like syntax
const parseSyntax = (text) => {
  // Handling headers
  let parsedText = text.replace(/###\s(.+)/g, '<h3 class="text-xl font-semibold">$1</h3>');
  parsedText = parsedText.replace(/##\s(.+)/g, '<h2 class="text-lg font-semibold">$1</h2>');
  parsedText = parsedText.replace(/#\s(.+)/g, '<h1 class="text-2xl font-bold">$1</h1>');

  // Handling bold text
  parsedText = parsedText.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Handling unordered lists
  parsedText = parsedText.replace(/- (.+)/g, '<ul><li>$1</li></ul>');

  // Handling line breaks (newlines to <br />)
  parsedText = parsedText.replace(/\n/g, "<br />");

  return parsedText;
};

const ConversationWindow = ({ messages, setMessages }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMessages(messages);
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div>
      {messages?.map((message, index) => (
        <div style={{ marginY: '10px' }} key={index} className={cn("flex my-3", message.role === "user" ? "justify-end" : "justify-start")}>
          <Card
            className={cn("max-w-[80%]", message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted")}
          >
            <CardContent className="px-4 !py-0.5">
              <p dangerouslySetInnerHTML={{ __html: parseSyntax(message.content) }} />
            </CardContent>
          </Card>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}

export default ConversationWindow;
