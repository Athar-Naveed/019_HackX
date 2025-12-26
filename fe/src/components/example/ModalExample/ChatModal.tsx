"use client";

import Messages from "@/components/chatbot/Messages";
import ChatbotInput from "@/components/chatbot/ChatbotInput";
import { Modal } from "@/components/ui/modal";
import adminStore from "@/store/adminStore";

export default function ChatModal() {
  const { isChat, setIsChat } = adminStore();

  return (
    <>
      <Modal
        isOpen={isChat}
        onClose={() => setIsChat(!isChat)}
        className="w-full h-full sm:m-2 p-5 bg-white/90 dark:bg-gray-900"
      >
        <div className="grid justify-center">
          <div className="chat text-gray-dark dark:text-white mb-10 text-2xl font-semibold">
            <h1>Chat here</h1>
          </div>
          <div className="messages scroll-container h-[65vh] mb-2 overflow-y-auto text-gray-dark dark:text-white">
            <Messages />
          </div>

          <ChatbotInput />
        </div>
      </Modal>
    </>
  );
}
