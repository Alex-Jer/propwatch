import { IconBooks, IconClipboardList, IconTags } from "@tabler/icons-react";
import { type NextPage } from "next";
import Head from "next/head";
import CardBackground from "~/components/CardBackground";
import { ControlPanelCard } from "~/components/ControlPanelCard";

const ControlPanel: NextPage = () => {
  const options = [
    {
      href: `/manage/collections`,
      icon: IconBooks,
      title: "Manage Collections",
      description: "Manage the collections that your properties are organized into.",
    },
    {
      href: `/manage/tags`,
      icon: IconTags,
      title: "Manage Tags",
      description: "Manage the tags that your properties are organized with.",
    },
    {
      href: `/manage/characteristics`,
      icon: IconClipboardList,
      title: "Manage Characteristics",
      description: "Manage the characteristics that are used to describe your properties.",
    },
  ];
  return (
    <>
      <Head>
        <title>Manage Characteristics</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CardBackground className="mx-20 pt-4">
        <div className=" grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 ">
          {options.map((option) => (
            <ControlPanelCard
              key={option.href}
              href={option.href}
              title={option.title}
              description={option.description}
              icon={option.icon}
            />
          ))}
        </div>
      </CardBackground>
    </>
  );
};

export default ControlPanel;
