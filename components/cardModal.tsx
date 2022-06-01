export type CardModalProps = {
  closeEvent: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  title: string;
  children: React.ReactNode;
  actionMsg: string;
  actionEvent?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
};

export const CardModal = ({
  closeEvent,
  title,
  children,
  actionMsg,
  actionEvent,
}: CardModalProps) => {
  return (
    <div>
      <h3 className="text-[1.5rem] font-bold">{title}</h3>
      <div className="mt-4 mb-4 whitespace-pre-wrap text-base text-[rgb(73,80,87)]">
        {children}
      </div>
      <div className="flex items-center justify-end">
        <button
          className="ml-2 rounded bg-gray-400 py-2 px-4 text-white hover:bg-gray-500"
          onClick={closeEvent}
        >
          닫기
        </button>
        <button
          className="ml-2 rounded bg-red-500 py-2 px-4 text-white hover:bg-red-600"
          onClick={actionEvent}
        >
          {actionMsg}
        </button>
      </div>
    </div>
  );
};
