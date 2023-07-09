import { JSX, useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getRandomHexColor } from "~/lib/propertyHelper";
import type { Offer } from "~/types";

const data = [
  { name: "Page A", uv: 4000 },
  { name: "Page B", uv: 3000 },
  { name: "Page C", uv: 2000 },
  { name: "Page D" },
  { name: "Page E", uv: 1890 },
  { name: "Page F", uv: 2390 },
  { name: "Page G", uv: 3490 },
];

export function PropertyOfferHistoryChart({ offers }: { offers: Offer[] }) {
  const [data, setData] = useState([]);
  const [lines, setLines] = useState<string[]>([]);

  const discretizeDate = (date: string) => {
    const options = { month: "long", year: "numeric" };
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString("en-US", options);
    return formattedDate;
  };

  useEffect(() => {
    if (!offers) return;
    const offerMap = new Map();
    const linesArr: string[] = [];
    offers.forEach((offer) => {
      offer?.price_history?.reverse().forEach((price) => {
        const dDate = discretizeDate(price.datetime);
        if (offer.id) {
          const priceTag = `price_${offer.id}`;
          if (!linesArr.includes(priceTag)) linesArr.push(priceTag);
          offerMap.set(dDate, { ...offerMap.get(dDate), [priceTag]: price.price });
        }
      });
    });

    const offerData: any[] = [];
    offerMap.forEach((value, key) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      offerData.push({ date: key, ...value });
    });

    offerData.sort((a, b) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      const dateA = new Date(a.date);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });

    setData(offerData);
    setLines(linesArr);
  }, [offers]);

  const renderLines = () => {
    const linesArr: JSX.Element[] = [];
    lines.forEach((line) => {
      const rndColor = getRandomHexColor(line);
      linesArr.push(
        <Line connectNulls type="monotone" stroke={rndColor} fill={rndColor} dataKey={line} strokeWidth={3} />
      );
    });
    return linesArr;
  };

  return (
    <div style={{ width: "100%" }}>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart
          width={500}
          height={200}
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          {renderLines()}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
