import { SegmentedControl, Text, Title } from "@mantine/core";
import {
  IconAdjustmentsAlt,
  IconBooks,
  IconClipboardList,
  IconDeviceAnalytics,
  IconGraph,
  IconTags,
} from "@tabler/icons-react";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useMemo, useState } from "react";
import CardBackground from "~/components/CardBackground";
import { ControlPanelCard } from "~/components/ControlPanelCard";
import RWLineChart, { LineChartPayload } from "~/components/statistics/RWLineChart";
import RWPieChart, { PieChartPayload } from "~/components/statistics/RWPieChart";
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

const listingTypes = [
  { label: "Sale", value: "sale" },
  { label: "Rent", value: "rent" },
];

const Statistics: NextPage = () => {
  const { data: session, status } = useSession();
  const { data: statistics, isLoading, isError } = useStatistics({ session, status });
  const [listingType, setListingType] = useState("sale");
  const listings = useMemo<PieChartPayload[] | undefined>(() => {
    if (statistics && statistics.listings) {
      const listings: PieChartPayload[] = [];
      let i = 0;
      Object.entries(statistics.listings).forEach(([listing_type, value]) => {
        listings.push({
          name: listing_type,
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

  const properties = useMemo<([PieChartPayload[], LineChartPayload[]] | undefined)[]>(() => {
    if (statistics && statistics.properties) {
      const pcounts: PieChartPayload[] = [];
      const properties: LineChartPayload[] = [];
      let i = 0;
      Object.entries(statistics.properties)
        .sort((a, b) => {
          return b[1].count - a[1].count;
        })
        .forEach(([property_type, stats]) => {
          pcounts.push({
            name: property_type == "no_type" ? "no type" : property_type,
            value: stats.count,
            color: getColor(i),
          });
          properties.push({
            name: property_type == "no_type" ? "no type" : property_type,
            "Average Sale Price": stats.price.sale == null ? null : Number(stats.price.sale),
            "Average Rent Price": stats.price.rent == null ? null : Number(stats.price.rent),
            "Average Rating": stats.avg == null ? null : Number(stats.avg),
          });
          i++;
        });
      return [pcounts, properties];
    }
    return [undefined, undefined];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statistics?.properties]);

  return (
    <>
      <Head>
        <title>Statistics</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="mb-2 flex flex-row items-center">
        <IconDeviceAnalytics className="-mt-1 mr-2" strokeWidth={1.5} />
        <h1 className="pb-1 text-base font-semibold">Statistics</h1>
      </div>
      <div className="-mx-4 mb-4 border-b border-shark-700" />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:mx-2">
        {properties && properties[0] && (
          <CardBackground>
            <Text size="xl" className="-mb-2 mt-1 text-center text-xl font-semibold">
              Properties by type
            </Text>
            <RWPieChart data={properties[0] as unknown as PieChartPayload[]} />
          </CardBackground>
        )}
        {listings && (
          <CardBackground>
            <Text size="xl" className="-mb-2 mt-1 text-center text-xl font-semibold">
              Properties by listing type
            </Text>
            <RWPieChart data={listings} />
          </CardBackground>
        )}
        <div className="col-span-1 md:col-span-2">
          {properties && properties[1] && (
            <CardBackground>
              <Text size="xl" className="mt-1 text-center text-xl font-semibold">
                Average prices and ratings by property type
              </Text>
              <SegmentedControl
                styles={() => ({ root: { width: "100%" } })}
                data={listingTypes}
                value={listingType}
                onChange={setListingType}
              />
              <RWLineChart
                data={properties[1] as unknown as LineChartPayload[]}
                firstPriceKey="Average Sale Price"
                firstPriceColor="#f03e3e"
                secondPriceKey="Average Rent Price"
                secondPriceColor="#0ca678"
                isFirstActive={listingType == "sale"}
              />
            </CardBackground>
          )}
        </div>
      </div>
    </>
  );
};

export default Statistics;
