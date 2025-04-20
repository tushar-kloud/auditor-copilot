import React, { useEffect, useState, useRef } from 'react';
import { cn } from "../../lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const parseSyntax = (text) => {
  // Table parsing
  const tableRegex = /\|(.+?)\|(?:\r?\n)\|(?:[-| ]+)\|((?:\r?\n\|.+\|)+)/g;

  text = text.replace(tableRegex, (_, headers, rows) => {
    const headerCells = headers.split('|').map(h => `<th class="px-4 py-2 border">${h.trim()}</th>`).join('');
    const bodyRows = rows
      .trim()
      .split('\n')
      .map(row => {
        const cells = row
          .split('|')
          .slice(1, -1)
          .map(cell => `<td class="px-4 py-2 border">${cell.trim()}</td>`)
          .join('');
        return `<tr>${cells}</tr>`;
      })
      .join('');

    return `
<div class="overflow-auto">
  <table class="min-w-full border border-collapse text-left text-sm table-auto">
    <thead class="bg-gray-100"><tr>${headerCells}</tr></thead>
    <tbody>${bodyRows}</tbody>
  </table>
</div>
`.trim();
  });

  // Remove extra <br> tags around tables
  text = text.replace(/(<br\s*\/?>)+\s*(<div class="overflow-auto">)/g, '$2');
  text = text.replace(/(<\/table>\s*<\/div>)(<br\s*\/?>)+/g, '$1');

  // Headers
  text = text.replace(/###\s(.+)/g, '<h3 class="text-xl font-semibold">$1</h3>');
  text = text.replace(/##\s(.+)/g, '<h2 class="text-lg font-semibold">$1</h2>');
  text = text.replace(/#\s(.+)/g, '<h1 class="text-2xl font-bold">$1</h1>');

  // Bold text
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Unordered lists
  text = text.replace(/^- (.+)$/gm, '<ul><li>$1</li></ul>');

  // Newline to <br />, unless part of a table (handled already)
  text = text.replace(/\n/g, "<br />");

  return text;
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
        <div
          key={index}
          className={cn(
            "flex my-4",
            message.role === "user" ? "justify-end" : "justify-start"
          )}
        >
          <Card
            className={cn(
              "max-w-[80%] overflow-hidden shadow-md",
              message.role === "user"
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            )}
          >
            <CardContent className="px-4 py-3">
              <p dangerouslySetInnerHTML={{ __html: parseSyntax(message.content) }} />
            </CardContent>

            {/* Only show model and provider for assistant messages */}
            {message.role === "assistant" && (message.model || message.provider) && (
              <CardFooter className="px-4 py-1 border-t border-border/40 flex gap-1 items-center opacity-55">
                {message.model && (
                  <Badge
                    style={{ fontSize: "16px" }}
                    variant="secondary"
                    className="text-m font-medium bg-secondary/80"
                  >
                    {message.model}
                  </Badge>
                )}

                {message.provider && (
                  <Badge
                    style={{ fontSize: "16px" }}
                    variant="secondary"
                    className="text-m font-medium bg-secondary/80"
                  >
                    {message.provider}
                  </Badge>
                )}
              </CardFooter>
            )}
          </Card>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ConversationWindow;