import "../styles/App.scss";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import { RecoilRoot } from "recoil";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
    <Layout>
      <Component {...pageProps} />
    </Layout>
    </RecoilRoot>
  );
}

export default MyApp;
