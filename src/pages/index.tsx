import { type NextPage } from "next";
import Head from "next/head";
import { HeroTitle } from "~/components/hero/HeroTitle";
import { NavHeader } from "~/components/layout/NavHeader";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>RealtyWatch</title>
        <meta name="description" content="Real Estate aggregator" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavHeader isHero />
      <HeroTitle />
    </>
  );
};

export default Home;
