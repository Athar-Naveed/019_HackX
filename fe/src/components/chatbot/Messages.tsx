"use client";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CopyButton, ShareButton, ThumbsDown, ThumbsUp } from "./Icons";
import CustomMarkdown from "./CustomMarkdown";
import { chatbotStore } from "@/store/chatStore";
import { socket } from "@/socket/socketClient";

const Messages = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const { messages, setMessages } = chatbotStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        scrollContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 200;
      setIsButtonVisible(!isNearBottom);
    }
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      handleScroll();
      return () => {
        scrollContainer.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);
  useEffect(() => {
    // Check if the last message is from the user
    if (messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role === "user") {
      scrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    const handleAIChunk = (data: { chunk?: string }) => {
      if (!data?.chunk) return;

      console.log("📩 ai_chunk from socket:", data);

      // Use the setMessages updater for safe state update
      setMessages((prev: any[]) => {
        const lastMessage = prev[prev.length - 1];

        // Append chunk to the last AI message if it exists
        if (lastMessage?.role === "ai") {
          return [
            ...prev.slice(0, prev.length - 1),
            {
              ...lastMessage,
              content: (lastMessage.content || "") + data.chunk,
            },
          ];
        }

        // Otherwise, create a new AI message
        return [
          ...prev,
          {
            role: "ai",
            content: data.chunk,
          },
        ];
      });
    };

    socket.on("ai_chunk", handleAIChunk);

    return () => {
      socket.off("ai_chunk", handleAIChunk);
    };
  }, [setMessages]);

  return (
    <>
      <div
        className="flex-1 py-8 lg:px-8 xl:pl-0 space-y-6 mx-auto mb-20 md:mb-32 lg:mb-0 sm:w-140 md:w-156 lg:w-200 scroll-container"
        ref={scrollContainerRef}
      >
        {messages.map((message: any, index: number) => (
          <div
            key={index}
            className={`flex ${
              message.role !== "ai" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`inline-block rounded-xl break-words overflow-x-scroll scroll-container p-1 ${
                message.role !== "ai"
                  ? "text-black max-w-2xl lg:max-w-xl"
                  : "text-black dark:text-white max-w-xs sm:max-w-xl lg:max-w-3xl"
              }`}
            >
              {message.role !== "ai" ? (
                <div className="grid items-center gap-2 justify-end">
                  {/* User Message */}
                  <div className="whitespace-pre-wrap py-2 px-4 lg:p-4 rounded-xl bg-[#E6EFFF] font-poppins">
                    <bdi>{message.prompt}</bdi>
                  </div>

                  {/* Copy Button outside the chat bubble */}
                  <div className="flex justify-end">
                    <CopyButton selection={message.prompt} />
                  </div>
                </div>
              ) : (
                <>
                  {/* // : message.content === "Erasing" && thinking ? (
                //   // Thinking Spinner
                //   <div className="flex items-center space-x-2">
                //     <Image 
                //       src={"/assets/images/widget/trash/trash.gif"}
                //       width={150}
                //       height={150}
                //       alt={"Clearing Chat"}
                //       unoptimized={true}
                //     />
                //   </div>
                // ) : message.content === "Visualizing" && thinking ? (
                //   // Visualization Spinner
                //   <div className="flex items-center space-x-2">
                //     <div className="loader animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                //     <span className="text-gray-500 dark:text-gray-300">
                //       Generating Visualization... {timer}s
                //     </span>
                //   </div>
                // )*/}
                  <div className="flex items-center gap-1">
                    <Image
                      src="/Logo/hisaab.png"
                      width={20}
                      height={20}
                      alt="Hissab Kitaab AI"
                      className=""
                      priority={false}
                    />
                    <p className="text-lg font-poppins">Hissabi AI</p>
                  </div>
                  <div className={`grid gap-3 px-1 max-w-full group`}>
                    {/* Display both text content and visualization if available */}
                    {message.content && (
                      <div className="chatbot">
                        <bdi className="leading-10 font-sans">
                          <CustomMarkdown content={message.content} />
                        </bdi>

                        <div className="flex items-center gap-2">
                          <div className="icon">
                            <CopyButton selection={message.content} />
                          </div>
                          <div className="icon">
                            <ShareButton />
                          </div>
                          <div className="icon">
                            <ThumbsUp />
                          </div>
                          <div className="icon">
                            <ThumbsDown />
                          </div>
                        </div>
                      </div>
                    )}
                    {message.visualization && (
                      <div className="video mt-4">
                        <video
                          controls
                          className="w-full rounded-lg"
                          src={`/api/visualize/${message.visualization}`}
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {/*
      // ------------------------ 
      // Scroll to Bottom Button 
      // ------------------------
      */}
      {isButtonVisible && (
        <button
          className="fixed bottom-36 left-1/2 transform -translate-x-1/2 bg-dark-logo-primary text-white rounded-full p-1 shadow-lg hover:scale-110 transition-transform"
          onClick={scrollToBottom}
        >
          <ChevronDown />
        </button>
      )}
    </>
  );
};
export default Messages;
