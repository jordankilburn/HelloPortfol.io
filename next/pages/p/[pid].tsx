import { GetStaticProps } from "next";
import { firestore } from "../../firebase/clientApp";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  limit,
} from "firebase/firestore";
import { useRouter } from "next/router";
import DefaultErrorPage from "next/error";
import Head from "next/head";
import { BasePortfolioAsset } from "../../types";

type Props = {
  updatedAt: Date;
  portfolio: BasePortfolioAsset[];
};

export default function anonPortfolio({ updatedAt, portfolio }: Props) {

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
      <p>
        {portfolio.map((asset) => (
          <>
            type: {asset.type}
            <br />
            ticker: {asset.ticker}
            <br />
            shares: {asset.shares}
            <br />
          </>
        ))}
      </p>
      <p>{timeString}</p>
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
    props: { updatedAt: Date.now(), portfolio: res ? res.portfolio : null },
    revalidate: 10,
  };
};
