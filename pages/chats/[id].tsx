import type { GetServerSideProps, NextPage } from "next";
import dynamic from "next/dynamic";

const AblyChat = dynamic(() => import("@components/AblyChat"), { ssr: false });

const ChatDetail: NextPage<{ roomId: number }> = ({ roomId }) => {
  return <AblyChat roomId={roomId} />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  if (!parseInt(id as string)) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      roomId: id,
    },
  };
};

export default ChatDetail;
