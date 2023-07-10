import { type JSX, useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getRandomHexColor, priceToString, priceToStringShort } from "~/lib/propertyHelper";
import type { Offer } from "~/types";

export function PropertyOfferHistoryChart({ offers, extra }: { offers: Offer[]; extra: number }) {
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
          const priceTag = `Offer ${offer.id}`;
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

  const formatValue = (value: number) => {
    return priceToStringShort(value);
  };

  const formatValueTooltip = (value: number) => {
    return priceToString(value);
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
          <CartesianGrid stroke={"#909296"} strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fill: "#909296", style: { fontSize: "0.8rem" } }} />
          <YAxis
            domain={["dataMin-" + extra.toString(), "dataMax+" + extra.toString()]}
            tick={{ fill: "#909296", style: { fontSize: "0.8rem" } }}
            tickFormatter={formatValue}
            label={{
              value: "Price (€)",
              position: "insideLeft",
              angle: -90,
              dy: -10,
              style: { textAnchor: "middle", fill: "#909296" },
            }}
            width={90}
          />
          <Tooltip formatter={formatValueTooltip} />
          {renderLines()}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
