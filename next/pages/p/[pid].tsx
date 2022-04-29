import { GetStaticProps } from "next";
import { firestore } from "../../firebase/clientApp";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { useRouter } from "next/router";
import DefaultErrorPage from "next/error";
import Head from "next/head";
import { BasePortfolioAsset } from "../../types";
import { defaultPortfolio } from "../../utils/examplePortfolios";
import Dash from "../../components/Dash";
import { useState } from "react";

type Props = {
  updatedAt: Date;
  portfolio: BasePortfolioAsset[];
  pid: string;
};

export default function AnonPortfolio({ updatedAt, portfolio, pid }: Props) {

  const [assets, setAssets] = useState(portfolio);

  if (!portfolio) {
    return (
      <>
        <Head>
          <meta name="robots" content="noindex" />
        </Head>
        <DefaultErrorPage statusCode={404} />
      </>
    );
  }

  const timeString = new Date(updatedAt).toLocaleTimeString();

  return (
    <>
      <h2>Custom Portfolio "{pid}"</h2>
      <Dash assets={assets} setAssets={setAssets} />
      Updated: {timeString}
    </>
  );
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export const getStaticProps: GetStaticProps = async (context) => {
  const pid = context.params?.pid;
  if (process.env.NODE_ENV == "development")
    return {
      props: {
        updatedAt: Date.now(),
        portfolio: defaultPortfolio,
        pid,
      },
      revalidate: 24 * 60 * 60, //24 hrs
    };

  const anonPortfoliosCollection = collection(firestore, "anon-portfolios");

  const anonPortfoliosQuery = query(
    anonPortfoliosCollection,
    where("pid", "==", pid),
    limit(10)
  );
  // get the todos
  const querySnapshot = await getDocs(anonPortfoliosQuery);
  const res = querySnapshot.docs[0]?.data();

  return {
    props: {
      updatedAt: Date.now(),
      pid,
      portfolio: res ? res.portfolio : null,
    },
    revalidate: 10,
  };
};
