import { useCallback, useState } from "react";
import clipboardIcon from "./assets/clipboardIcon.svg";
import clipboardCheckIcon from "./assets/clipboardCheckIcon.svg";

interface Props {
  code: string;
}

function CopyButton(props: Props) {
  const { code } = props;
  const [isCopying, setIsCopying] = useState<boolean>(false);
  const copyToClipboard = useCallback(async () => {
    setIsCopying(true);
    await navigator.clipboard.writeText(code);
    setTimeout(() => setIsCopying(false), 800);
  }, [code]);

  return (
    <>
      <input
        id="#code"
        type="text"
        className="hidden"
        value={code}
        readOnly
        aria-hidden
      />
      <button className="full-width" onClick={copyToClipboard}>
        Copy CSS&nbsp;
        <img
          src={isCopying ? clipboardCheckIcon : clipboardIcon}
          className="icon"
          role="presentation"
        />
      </button>
    </>
  );
}

export default CopyButton;
