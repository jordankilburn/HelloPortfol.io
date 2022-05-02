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
      <h2>Shared Portfolio "{pid}"</h2>
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
  const id = context.params?.id;

  const anonPortfoliosCollection = collection(firestore, "anon-portfolios");

  const anonPortfoliosQuery = query(
    anonPortfoliosCollection,
    where("__name__", "==", id),
    limit(1)
  );

  const querySnapshot = await getDocs(anonPortfoliosQuery);

  const res = querySnapshot.docs[0]?.data();

  if (!res) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      updatedAt: Date.now(),
      pid: res ? res.pid : "",
      portfolio: res
        ? res.portfolio.map((asset: BasePortfolioAsset) => ({
            show: true,
            ...asset,
          }))
        : null,
    },
    revalidate: 24 * 60 * 60, //24 hrs
  };
};
