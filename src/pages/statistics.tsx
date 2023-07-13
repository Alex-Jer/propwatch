import { Text, Title } from "@mantine/core";
import { IconAdjustmentsAlt, IconBooks, IconClipboardList, IconTags } from "@tabler/icons-react";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useMemo } from "react";
import CardBackground from "~/components/CardBackground";
import { ControlPanelCard } from "~/components/ControlPanelCard";
import RWPieChart, { PieChartPayload } from "~/components/statistics/PieChart";
import { useStatistics } from "~/hooks/useQueries";
import { ucfirst } from "~/lib/propertyHelper";

const colors = [
  "#f03e3e",
  "#0ca678",
  "#1c7ed6",
  "#ae3ec9",
  "#f59f00",
  "#d6336c",
  "#f76707",
  "#74b816",
  "#7048e8",
  "#1098ad",
  "#4263eb",
  "#37b24d",
];

const getColor = (index: number) => {
  return colors[index % colors.length] as string;
};

const Statistics: NextPage = () => {
  const { data: session, status } = useSession();
  const { data: statistics, isLoading, isError } = useStatistics({ session, status });

  const listings = useMemo<PieChartPayload[] | undefined>(() => {
    if (statistics && statistics.listings) {
      const listings: PieChartPayload[] = [];
      let i = 0;
      Object.entries(statistics.listings).forEach(([listing_type, value]) => {
        listings.push({
          name: ucfirst(listing_type),
          value,
          color: getColor(i),
        });
        i++;
      });
      return listings;
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statistics?.listings]);

  return (
    <>
      <Head>
        <title>Statistics</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="mb-2 flex flex-row items-center">
        <IconAdjustmentsAlt className="-mt-1 mr-2" strokeWidth={1.5} />
        <h1 className="pb-1 text-base font-semibold">Statistics</h1>
      </div>
      <div className="-mx-4 mb-4 border-b border-shark-700" />

      <div className="container grid grid-cols-1 md:grid-cols-2">
        {listings && (
          <CardBackground className="mx-6">
            <Text size="xl" className="mt-2 text-center text-xl font-semibold">
              Listings by type
            </Text>
            <RWPieChart data={listings} />
          </CardBackground>
        )}
      </div>
    </>
  );
};

export default Statistics;
