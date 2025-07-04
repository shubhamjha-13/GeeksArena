import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import { Send } from "lucide-react";
import Typewriter from "typewriter-effect";

function ChatAi({ problem }) {
  const [messages, setMessages] = useState([
    {
      role: "model",
      parts: [
        {
          text: "Hi! I'm your DSA assistant. How can I help you with your coding problem today? Need hints, code review, or an optimal solution?",
          isComplete: true,
        },
      ],
    },
  ]);

  const [isGenerating, setIsGenerating] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const messagesEndRef = useRef(null);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onSubmit = async (data) => {
    const newUserMessage = {
      role: "user",
      parts: [{ text: data.message, isComplete: true }],
    };

    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    reset();
    setIsGenerating(true);

    try {
      const response = await axiosClient.post("/ai/chat", {
        messages: updatedMessages,
        title: problem.title,
        description: problem.description,
        testCases: problem.visibleTestCases,
        startCode: problem.startCode,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          parts: [
            {
              text: response.data.message,
              isComplete: false, // Mark as not completed
            },
          ],
        },
      ]);
    } catch (error) {
      console.error("API Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          parts: [
            {
              text: "⚠️ Error connecting to AI service. Please try again later.",
              isComplete: true,
            },
          ],
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-xl">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat ${
              msg.role === "user" ? "chat-end" : "chat-start"
            }`}
          >
            <div
              className={`chat-bubble ${
                msg.role === "user" ? "bg-base-300" : "bg-base-200"
              }`}
            >
              {msg.parts[0].isComplete ? (
                <ReactMarkdown>{msg.parts[0].text}</ReactMarkdown>
              ) : (
                <Typewriter
                  options={{
                    delay: 40,
                    cursor: "█",
                    cursorClassName: "text-primary-content opacity-70",
                  }}
                  onInit={(typewriter) => {
                    typewriter
                      .typeString(msg.parts[0].text)
                      .pauseFor(2000)
                      .callFunction(() => {
                        // Mark as complete when done
                        setMessages((prev) =>
                          prev.map((m, i) =>
                            i === index
                              ? {
                                  ...m,
                                  parts: [{ ...m.parts[0], isComplete: true }],
                                }
                              : m
                          )
                        );
                      })
                      .start();
                  }}
                />
              )}
            </div>
          </div>
        ))}
        {isGenerating && (
          <div className="chat chat-start">
            <div className="chat-bubble bg-base-200">
              <div className="flex items-end justify-center h-6">
                <span className="wave-bar"></span>
                <span className="wave-bar animation-delay-100"></span>
                <span className="wave-bar animation-delay-200"></span>
                <span className="wave-bar animation-delay-300"></span>
                <span className="wave-bar animation-delay-400"></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="sticky bottom-0 p-4 bg-base-100 border-t"
      >
        <div className="relative">
          <textarea
            placeholder="Ask me anything about the problem..."
            autoComplete="off"
            className="textarea textarea-bordered w-full pr-10 min-h-[3rem] max-h-40 resize-none"
            style={{
              paddingRight: "2.5rem",
              lineHeight: "1.5",
              transition: "height 0.2s ease",
            }}
            {...register("message", {
              required: true,
              minLength: 2,
              maxLength: 1000,
            })}
            onInput={(e) => {
              // Auto-resize functionality
              e.target.style.height = "auto";
              e.target.style.height = `${Math.min(
                e.target.scrollHeight,
                160
              )}px`;
            }}
            onKeyDown={(e) => {
              // Submit on Enter (without Shift)
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(onSubmit)();
              }
            }}
          />
          <button
            type="submit"
            className="absolute right-3 bottom-2 btn btn-ghost btn-circle btn-md"
            disabled={isGenerating}
          >
            <Send size={18} className="text-primary" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatAi;
