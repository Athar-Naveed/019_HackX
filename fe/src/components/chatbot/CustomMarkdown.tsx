"use client";
// ----------------------------
// Imports
// ----------------------------
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import CodeBlock from "./Codeblock";
import Image from "next/image";
// ----------------------------
// Custom markdown code starts here
// ----------------------------
const CustomMarkdown = ({ content }: { content: string | undefined }) => {
  return (
    <div className="max-w-full overflow-hidden">
      <div className="overflow-hidden">
        <ReactMarkdown
          remarkPlugins={[remarkMath, remarkGfm]} // Enable LaTeX syntax in Markdown
          rehypePlugins={[rehypeKatex, rehypeSanitize]}
          components={{
            // ----------------------------
            // Code starts here
            // ----------------------------
            code: ({ inline, className, children, ...props }: any) => {
              const match = /language-(\w+)/.exec(className || "");
              const language = match ? match[1] : "bash";

              return !inline && match ? (
                <CodeBlock language={language} value={String(children)} />
              ) : (
                <span className="inline-flex items-center group relative">
                  <code
                    className="
                      font-mono text-xs sm:text-sm px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md
                      bg-gray-100 text-gray-800 border border-gray-200
                      dark:bg-gray-800/80 dark:text-blue-300 dark:border-gray-700
                      shadow-xs
                      transition-all duration-200
                      group-hover:shadow-md group-hover:border-gray-300 dark:group-hover:border-gray-600
                      break-words
                    "
                    {...props}
                  >
                    <span className="opacity-90">{children}</span>
                  </code>

                  <span
                    className="
                      absolute left-0 top-0 h-full w-1 bg-blue-500 dark:bg-blue-600 rounded-l-md opacity-0
                      group-hover:opacity-100 transition-opacity duration-200
                    "
                  ></span>
                </span>
              );
            },
            // ----------------------------
            // Code ends here
            // ----------------------------
            strong: ({ children }) => (
              <strong className="font-semibold text-base sm:text-lg">
                {children}
              </strong>
            ),
            h1: ({ children }) => (
              <h1 className="text-2xl sm:text-3xl font-bold my-3 sm:my-5">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-xl sm:text-2xl font-bold my-3 sm:my-5">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-lg sm:text-xl font-semibold my-3 sm:my-5">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <>
                <p className="text-base sm:text-lg leading-relaxed my-3 sm:my-5 break-words max-w-xs sm:max-w-lg lg:max-w-2xl text-dark-custom-dark-blue dark:text-light-light-white">
                  {children}
                </p>
                <hr className="my-4 sm:my-8 last:hidden h-[0.2px] border-light-light-white dark:border-slate-700" />
              </>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-3 sm:pl-4 italic my-2">
                {children}
              </blockquote>
            ),
            ul: ({ children }) => (
              <ul className="list-disc sm:pl-5 my-2 sm:my-3">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal px-4 sm:pl-5 my-2 sm:my-3">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="mb-1 sm:mb-2 text-dark-custom-dark-blue dark:text-light-light-white">
                {children}
              </li>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                className="text-dark-logo-primary hover:text-blue-700 break-words"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            ),
            img: ({ src }: { src?: string | Blob }) => {
              const imgSrc =
                typeof src === "string"
                  ? src
                  : src instanceof Blob
                  ? URL.createObjectURL(src)
                  : "/placeholder.svg";

              return (
                <div className="my-3 sm:my-4">
                  <Image
                    src={imgSrc}
                    alt="Image"
                    width={100}
                    height={100}
                    className="max-w-full h-auto rounded-md mx-auto"
                    loading="lazy"
                  />
                </div>
              );
            },
            table: ({ children }) => (
              <div className="overflow-auto">
                <table className="w-full border-collapse my-4 text-left">
                  {children}
                </table>
              </div>
            ),
            th: ({ children }) => (
              <th className="border px-4 py-2 bg-slate-100 dark:bg-dark-button-blue font-bold">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border px-4 py-2">{children}</td>
            ),
            em: ({ children }) => <em className="font-bold">{children}</em>,
            sup: ({ children }) => <sup className="font-bold">{children}</sup>,
            span: ({ children, ...props }) => {
              return (
                <span className="text-base sm:text-lg my-1 sm:my-2" {...props}>
                  {children}
                </span>
              );
            },
          }}
        >
          {content?.toString()}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default CustomMarkdown;
