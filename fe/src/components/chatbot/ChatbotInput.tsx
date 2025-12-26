"use client";
import { socket } from "@/socket/socketClient";
import { chatbotStore } from "@/store/chatStore";
import { Paperclip, Send } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface Attachment {
  filename: string;
  file_type: string;
  base64_data: string;
}

const ChatbotInput = () => {
  const { setMessages } = chatbotStore();
  const [inputMessage, setInputMessage] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleInputMessage = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) =>
      setInputMessage(e.target.value),
    []
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        setFiles(Array.from(e.target.files)); // handle multiple files
      }
    },
    []
  );

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Convert File -> base64
  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(",")[1]); // remove prefix
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && files.length === 0) return;

    // Prepare attachments
    const attachments: Attachment[] = await Promise.all(
      files.map(async (file) => ({
        filename: file.name,
        file_type: file.type,
        base64_data: await fileToBase64(file),
      }))
    );

    const messagePayload = {
      content: inputMessage.trim(),
      conversation_id: "12345",
      attachments,
    };

    // Send message via socket
    if (!socket.connected) socket.connect();
    socket.emit("join_room", {
      chat_id: "12345",
    });
    socket.emit("user_message", messagePayload);

    // Show message in chat UI
    setMessages((prev) => [
      ...prev,
      { role: "user", prompt: inputMessage.trim(), attachments },
    ]);

    // Clear inputs
    setInputMessage("");
    setFiles([]);
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto md:px-4 pb-2 md:pb-6">
        <div className="flex flex-col relative border dark:border-gray-700 rounded-xl bg-gray-200 dark:bg-gray-900 p-1 lg:p-2">
          {files.length > 0 && (
            <div className="flex flex-wrap gap-2 p-2 border-b border-gray-300 dark:border-gray-600 mb-2">
              {files.map((file, index) => {
                const isImage = file.type.startsWith("image/");
                const fileUrl = URL.createObjectURL(file);
                return (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-gray-300 dark:bg-gray-700 rounded px-2 py-1 text-sm cursor-pointer hover:bg-gray-400 dark:hover:bg-gray-600"
                    onClick={() => {
                      if (isImage) {
                        setSelectedFile(file);
                        setShowModal(true);
                      } else {
                        window.open(fileUrl, "_blank");
                      }
                    }}
                  >
                    {isImage ? (
                      <img
                        src={fileUrl}
                        alt={file.name}
                        className="w-6 h-6 object-cover rounded"
                      />
                    ) : (
                      <span className="text-xs font-mono">
                        {file.type || "file"}
                      </span>
                    )}
                    <span className="truncate max-w-24">{file.name}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFiles(files.filter((_, i) => i !== index));
                      }}
                      className="text-red-500 hover:text-red-700 ml-1"
                      aria-label="Remove file"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          )}
          <textarea
            ref={textareaRef}
            value={inputMessage}
            onChange={handleInputMessage}
            onKeyDown={handleKeyPress}
            className="text-black dark:text-white border-none bg-transparent min-h-4 scroll-container w-full p-3 outline-hidden resize-none overflow-y-scroll focus:outline-hidden focus:ring-0"
            placeholder="Message Hissab Kitaab AI"
            rows={1}
          />
          <div className="flex justify-between">
            {/* Hidden file input */}
            <input
              id="fileInput"
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Custom file button */}
            <label
              htmlFor="fileInput"
              className="flex items-center justify-center p-2 rounded-lg text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-400 dark:hover:bg-gray-600 transition"
              title="Attach files"
            >
              <Paperclip className="w-5 h-5" />
            </label>
            <div className="flex justify-between items-center pt-2">
              <div />
              <div className="right">
                <button
                  onClick={handleSendMessage}
                  className="chatIconButton group text-white dark:text-blue-500 mr-3"
                  aria-label="Send message"
                >
                  <Send className="chatIcon text-gray-dark dark:text-white/90" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showModal && selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white dark:bg-gray-800 p-4 rounded-lg max-w-3xl max-h-3xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-2xl"
              aria-label="Close modal"
            >
              ×
            </button>
            <img
              src={URL.createObjectURL(selectedFile)}
              alt={selectedFile.name}
              className="max-w-full max-h-full rounded"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotInput;
