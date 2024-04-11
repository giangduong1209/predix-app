import { useState } from "react";
import { Icons } from "../Icons";

const ClipboardCopy = ({ copyText }: { copyText: string }) => {
  const [isCopied, setIsCopied] = useState(false);

  // This is the function we wrote earlier
  const copyTextToClipboard = async (text: string) => {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  };

  // onClick handler function for the copy button
  const handleCopyClick = () => {
    // Asynchronously call copyTextToClipboard
    copyTextToClipboard(copyText)
      .then(() => {
        // If successful, update the isCopied state value
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      {/* Bind our handler function to the onClick button property */}
      <button onClick={handleCopyClick} className="relative">
        <Icons.FileIcon className="text-[--colors-text]" />
        {isCopied ? (
          <div className="absolute bg-[--colors-tooltipBackground] text-[-colors-tooltipText] bottom-full p-[2px] rounded-xl">
            Copied!
          </div>
        ) : null}
      </button>
    </div>
  );
};

export default ClipboardCopy;
