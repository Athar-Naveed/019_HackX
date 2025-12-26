"use client";
import {useState} from "react";
import {Copy, Check, Trash2, MoreVertical, ThumbsUpIcon, ThumbsDownIcon} from "lucide-react";
import {Tooltip} from "@mui/material";
export const CopyButton = ({selection, color = undefined}: {selection: string; color?: string}) => {
  const [copied, setCopied] = useState<boolean>(false);
  // -----------------------
  // Copy Message
  // -----------------------
  const handleCopyMessage = async (text: string) => {
    setCopied(true);
    navigator.clipboard.writeText(text);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <>
      {/* 
            // ---------------------------
            // Copy to clipboard
            // ---------------------------
            */}
      {!copied ? (
        <Tooltip arrow={true} title={"Copy"} placement="bottom">
          <button onClick={() => handleCopyMessage(selection)}>
            <Copy
              className={`size-4 ${color == undefined ? "text-dark-custom-dark-blue dark:text-white" : "text-white"}`}
            />
          </button>
        </Tooltip>
      ) : (
        <Check
          className={`size-4 ${color == undefined ? "text-dark-custom-dark-blue dark:text-white" : "text-white"}`}
        />
      )}
    </>
  );
};

export const ShareButton = () => {
  return (
    <>
      <Tooltip arrow={true} title={"Share Chat"} placement="bottom">
        <button
          onClick={() => {
            console.log("Share");
          }}
        >
          {/* <?xml version="1.0" encoding="UTF-8"?>
    <!-- The Best Svg Icon site in the world: iconSvg.co, Visit us! https://iconsvg.co --> */}
          <svg
            width="22px"
            height="22px"
            version="1.1"
            viewBox="144 144 512 512"
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-black dark:stroke-white" // Stroke color changes with theme
          >
            <g id="IconSvg_bgCarrier" className="stroke-0" /> {/* No stroke */}
            <g
              id="IconSvg_tracerCarrier"
              className="stroke-0"
              strokeLinecap="round"
              strokeLinejoin="round"
            />{" "}
            {/* No stroke */}
            <g id="IconSvg_iconCarrier">
              <path
                className="fill-black dark:fill-white" // Fill color changes with theme
                d="m421.47 258.3 183.2 141.7-183.2 141.7v-88.738h-60.039c-55.867 0-109.37 22.582-148.34 62.613-6.4805 6.6562-17.77 2.0703-17.77-7.2188v-11.414c0-82.785 67.113-149.89 149.89-149.89h76.25z"
              />
            </g>
          </svg>
        </button>
      </Tooltip>
    </>
  );
};
export const DeleteButton = () => {
  return (
    <>
      <Tooltip arrow={true} title={"Delete Chat"} placement="bottom">
        <button
          onClick={() => {
            console.log("Delete");
          }}
        >
          <Trash2 className={`size-4 text-dark-custom-dark-blue dark:text-white`} />
        </button>
      </Tooltip>
    </>
  );
};
export const MoreButton = () => {
  return (
    <>
      <Tooltip arrow={true} title={"More Options"} placement="bottom">
        <button
          onClick={() => {
            console.log("More Options");
          }}
        >
          <MoreVertical className={`size-4 text-dark-custom-dark-blue dark:text-white`} />
        </button>
      </Tooltip>
    </>
  );
};

export const ThumbsUp = () => {
  return (
    <>
      <Tooltip arrow={true} title={"Thank You!"} placement="bottom">
        <button
          onClick={() => {
            console.log("Thank You!");
          }}
        >
          <ThumbsUpIcon className={`size-4 text-dark-custom-dark-blue dark:text-white`} />
        </button>
      </Tooltip>
    </>
  );
};
export const ThumbsDown = () => {
  return (
    <>
      <Tooltip arrow={true} title={"No Thank You!"} placement="bottom">
        <button
          onClick={() => {
            console.log("No Thank You!");
          }}
        >
          <ThumbsDownIcon className={`size-4 text-dark-custom-dark-blue dark:text-white`} />
        </button>
      </Tooltip>
    </>
  );
};

