import { AppProps } from "next/app";
import "../styles/globals.css";
import { SWRConfig } from "swr";
import { Cleanup } from "@libs/client/utils";

function MyApp({ Component, pageProps }: AppProps) {
  Cleanup();
  return (
    <SWRConfig
      value={{ fetcher: (url: string) => fetch(url).then((res) => res.json()) }}
    >
      <Component {...pageProps} />
    </SWRConfig>
  );
}

export default MyApp;
