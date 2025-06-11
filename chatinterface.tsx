"use client";

import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/trpc/react";
import { Button, Form, ListGroup, Spinner, Image, ToggleButtonGroup, ToggleButton } from "react-bootstrap";
import { generateText, generateImage } from "@/lib/gemini";

export default function ChatInterface() {
  const [message, setMessage] = useState("");
  const [modelType, setModelType] = useState<"text" | "image">("text");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: chats, isLoading } = api.chat.list.useQuery();
  const createChat = api.chat.create.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = await createChat.mutateAsync({ content: message });
    
    let aiResponse;
    if (modelType === "text") {
      aiResponse = await generateText(message);
    } else {
      aiResponse = await generateImage(message);
    }

    await createChat.mutateAsync({ content: aiResponse });
    setMessage("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  return (
    <div className="d-flex flex-column h-100">
      <ToggleButtonGroup
        type="radio"
        name="modelType"
        value={modelType}
        onChange={(val) => setModelType(val)}
        className="mb-3"
      >
        <ToggleButton id="tbg-btn-1" value="text" variant="outline-primary">
          Text Model
        </ToggleButton>
        <ToggleButton id="tbg-btn-2" value="image" variant="outline-primary">
          Image Model
        </ToggleButton>
      </ToggleButtonGroup>

      <div className="flex-grow-1 overflow-auto p-3">
        {isLoading ? (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" />
          </div>
        ) : (
          <ListGroup>
            {chats?.map((chat, index) => (
              <ListGroup.Item
                key={index}
                className={`mb-2 ${index % 2 === 0 ? "text-end" : "text-start"}`}
              >
                {chat.content.startsWith("http") ? (
                  <Image src={chat.content} fluid thumbnail />
                ) : (
                  chat.content
                )}
              </ListGroup.Item>
            ))}
            <div ref={messagesEndRef} />
          </ListGroup>
        )}
      </div>

      <Form onSubmit={handleSubmit} className="p-3 border-top">
        <div className="d-flex">
          <Form.Control
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow-1 me-2"
          />
          <Button type="submit" disabled={!message.trim() || createChat.isPending}>
            {createChat.isPending ? <Spinner size="sm" /> : "Send"}
          </Button>
        </div>
      </Form>
    </div>
  );
}
