import { type NextPage } from "next";
import Head from "next/head";
import { HeroTitle } from "~/components/hero/HeroTitle";
import { NavHeader } from "~/components/layout/Header";

const links = [
  { link: "/lists", label: "My Lists", links: [] },
  { link: "/learn", label: "Learn", links: [] },
  { link: "/about", label: "About", links: [] },
  { link: "/pricing", label: "Pricing", links: [] },
  { link: "/support", label: "Support", links: [] },
];

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>RealtyWatch</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavHeader links={links} />
      <HeroTitle />
    </>
  );
};

export default Home;
