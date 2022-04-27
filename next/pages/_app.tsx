import "../styles/global.scss";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import { RecoilRoot } from "recoil";
import dynamic from "next/dynamic";

function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </RecoilRoot>
  );
}
//disables SSR
export default dynamic(() => Promise.resolve(App), {
  ssr: false,
});
