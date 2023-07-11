import { IconBooks, IconClipboardList, IconTags } from "@tabler/icons-react";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import CardBackground from "~/components/CardBackground";
import { ControlPanelCard } from "~/components/ControlPanelCard";

const ControlPanel: NextPage = () => {
  const options = [
    {
      href: `/manage/collections`,
      icon: IconBooks,
      title: "Manage Collections",
      description: "Manage the collections that your properties are organized into.",
      badges: ["view", "edit", "delete"],
    },
    {
      href: `/manage/tags`,
      icon: IconTags,
      title: "Manage Tags",
      description: "Manage the tags that your properties are organized with.",
      badges: ["delete"],
    },
    {
      href: `/manage/characteristics`,
      icon: IconClipboardList,
      title: "Manage Characteristics",
      description: "Manage the characteristics that are used to describe your properties.",
      badges: ["delete"],
    },
  ];
  return (
    <>
      <Head>
        <title>Manage Characteristics</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CardBackground className="mx-20 pt-4">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {options.map((option) => (
            <Link
              href={option.href}
              key={option.href}
              style={{
                transition: "transform 0.2s", // Add transition property for smooth scaling effect
                willChange: "transform", // Optimize performance by hinting browser about transform changes
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.025)"; // Scale up on hover
              }}
              onClick={(e) => {
                e.currentTarget.style.transform = "scale(1.05)"; // Scale up on hover
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)"; // Reset scaling on mouse leave
              }}
            >
              <ControlPanelCard
                title={option.title}
                description={option.description}
                icon={option.icon}
                badges={option.badges}
              />
            </Link>
          ))}
        </div>
      </CardBackground>
    </>
  );
};

export default ControlPanel;
