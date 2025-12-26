"use client";

import type React from "react";
import {useState} from "react";
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import {dracula} from "react-syntax-highlighter/dist/esm/styles/prism";
import {Check, Copy, Code, Terminal, FileCode} from "lucide-react";
// import {useMainAppStore} from "../store/mainAppStore";

interface CodeBlockProps {
  language: string;
  value: string;
  showLineNumbers?: boolean;
  fileName?: string;
}

// Map of language names to display names and icons
const languageMap: Record<string, {label: string; icon: React.ReactNode}> = {
  javascript: {
    label: "JavaScript",
    icon: <FileCode className="h-3.5 w-3.5" />,
  },
  typescript: {
    label: "TypeScript",
    icon: <FileCode className="h-3.5 w-3.5" />,
  },
  jsx: {
    label: "JSX",
    icon: <FileCode className="h-3.5 w-3.5" />,
  },
  tsx: {
    label: "TSX",
    icon: <FileCode className="h-3.5 w-3.5" />,
  },
  html: {
    label: "HTML",
    icon: <Code className="h-3.5 w-3.5" />,
  },
  css: {
    label: "CSS",
    icon: <Code className="h-3.5 w-3.5" />,
  },
  json: {
    label: "JSON",
    icon: <FileCode className="h-3.5 w-3.5" />,
  },
  bash: {
    label: "Bash",
    icon: <Terminal className="h-3.5 w-3.5" />,
  },
  shell: {
    label: "Shell",
    icon: <Terminal className="h-3.5 w-3.5" />,
  },
  python: {
    label: "Python",
    icon: <FileCode className="h-3.5 w-3.5" />,
  },
};

export const CodeBlock: React.FC<CodeBlockProps> = ({
  language,
  value,
  showLineNumbers = true,
  fileName,
}) => {
  const [copied, setCopied] = useState(false);
  // const {dark} = useMainAppStore();
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy code: ", error);
    }
  };

  // Get language display info
  const languageInfo = languageMap[language.toLowerCase()] || {
    label: language.charAt(0).toUpperCase() + language.slice(1),
    icon: <Code className="h-3.5 w-3.5" />,
  };

  return (
    <div className="group relative my-6 rounded-xl w-full max-w-xs sm:max-w-[550px] lg:max-w-3xl xl:max-w-[750px] border border-dark-button-blue shadow-md transition-all duration-300 hover:shadow-lg">
      {/* Header with filename and language */}
      <div className="flex items-center justify-between px-4 py-2 bg-dark-text-hover">
        {fileName ? (
          <div className="flex items-center space-x-2 text-sm text-white/80">
            <FileCode className="h-4 w-4" />
            <span className="font-medium">{fileName}</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-sm text-white/80">
            {languageInfo.icon}
            <span className="font-medium">{languageInfo.label}</span>
          </div>
        )}

        <button
          onClick={handleCopy}
          className={`
            flex items-center space-x-1.5 px-3 py-2 rounded-md text-xs font-medium
            transition-all duration-300 focus:outline-hidden
            ${copied ? "bg-green-100 text-green-700" : "text-white/80 border border-white/80 hover:bg-gray-200 hover:text-gray-700"}
          `}
          aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code content */}
      <div className="relative max-w-full overflow-x-auto [&>pre]:max-w-[calc(100vw-1rem)]! lg:[&>pre]:max-w-[calc(100vw-20rem)]!">
        <SyntaxHighlighter
          language={language}
          style={dracula}
          showLineNumbers={showLineNumbers}
          wrapLines={true}
          lineNumberStyle={{
            minWidth: "2.5em",
            paddingRight: "1em",
            color: "#6B7280",
            textAlign: "left",
            userSelect: "none",
          }}
          customStyle={{
            margin: 0,
            borderRadius: 0,
            padding: "1rem",
            fontSize: "0.9rem",
            maxWidth: "100%", // Add this
          }}
          codeTagProps={{
            className: "font-mono",
          }}
        >
          {value}
        </SyntaxHighlighter>
      </div>

      {/* Optional footer with additional info */}
      {value.length > 5 && (
        <div className="px-4 py-1.5 text-xs text-white/80 bg-dark-text-hover border-t border-dark-button-blue ">
          {value.split("\n").length} lines
        </div>
      )}
    </div>
  );
};

export default CodeBlock;