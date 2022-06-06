import { cls } from "@libs/client/utils";
import { useEffect, useState } from "react";
import tw from "tailwind-styled-components";

export type ModalBaseProps = {
  active: boolean;
  closeEvent?: (e?: React.MouseEvent<HTMLDivElement>) => void;
  children: React.ReactNode;
  isProductList?: boolean;
};

const ModalBaseContainer = tw.div`
    flex
    fixed
    top-0
    right-0
    bottom-0
    left-0
    z-[99]
    items-center
    justify-center
    p-4
    box-border
`;

export default function ModalBase({
  active,
  closeEvent,
  children,
  isProductList,
}: ModalBaseProps) {
  const [closed, setClosed] = useState(true);
  useEffect(() => {
    document.body.style.overflowY = active ? "hidden" : "initial";

    let timeoutId: any;
    if (active) {
      setClosed(false);
    } else {
      timeoutId = setTimeout(() => {
        setClosed(true);
      }, 200);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [active]);

  useEffect(() => {
    return () => {
      document.body.style.overflowY = "initial";
    };
  }, []);

  if (!active && closed) return null;

  return (
    <ModalBaseContainer>
      <div
        className="absolute left-0 top-0 right-0 bottom-0 z-[1] bg-[rgba(249,249,249,0.85)]"
        onClick={closeEvent}
      />
      <div
        className={cls(
          "relative z-10 w-full max-w-[400px] overflow-y-scroll rounded-2xl bg-white p-8 shadow-[rgba(149,157,165,0.2)_0px_8px_24px] scrollbar-hide",
          active ? "animate-popin" : "animate-popout",
          isProductList ? "h-96" : ""
        )}
      >
        {children}
      </div>
    </ModalBaseContainer>
  );
}
