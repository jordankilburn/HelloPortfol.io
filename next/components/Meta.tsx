import Head from "next/head";

type Props = {
  title?: string;
  keywords?: string;
  description?: string;
  ogTitle?: string;
  ogType?: string;
  ogUrl?: string;
  ogImage?: string;
};

const Meta = ({
  title,
  keywords,
  description,
  ogTitle,
  ogType,
  ogUrl,
  ogImage,
}: Props) => {
  return (
    <Head>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1"
      ></meta>
      <meta name="keywords" content={keywords}></meta>
      <meta name="description" content={description}></meta>
      <meta property="og:title" content={ogTitle} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:image" content={ogImage} />
      <meta charSet="utf-8"></meta>
      <link rel="icon" href="/favicon.ico"></link>
      <title>{title}</title>
      <link rel="shortcut icon" href="/favicon.png" />
    </Head>
  );
};
Meta.defaultProps = {
  title: "HelloPortfol.io | Backtest, View, & Manage Your Portfolio",
  keywords: "portfolio backtester, net worth analyzer",
  description: "View, manage, and analyze your portfolio across any time span.",
  ogTitle: "HelloPortfol.io",
};
export default Meta;
