"use client";
import React from "react";
import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import { useModal } from "@/hooks/useModal";
import Image from "next/image";

export default function DefaultModal({
  data,
  icon,
  title,
}: {
  data: any;
  icon: any;
  title: string;
}) {
  const { isOpen, openModal, closeModal } = useModal();
  return (
    <div>
      <Image
        src={icon}
        width={30}
        height={30}
        alt={title}
        onClick={openModal}
        className="text-gray-900 dark:text-white cursor-pointer"
      />

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[600px] p-5 lg:p-10"
      >
        <h4 className="font-semibold text-gray-800 mb-7 text-title-sm dark:text-white/90">
          {title}
        </h4>
        <div className="details h-[400px] overflow-y-auto">
          {data.map((org: any, index: number) => (
            <div key={index} className="title my-2">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                {org.title}
              </h4>

              <pre className="leading-6 text-gray-500 dark:text-white/60 whitespace-pre-wrap">
                {org.desc}
              </pre>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end w-full gap-3 mt-8">
          <Button size="sm" variant="outline" onClick={closeModal}>
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
}
