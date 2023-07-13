import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { priceToString, priceToStringShort } from "~/lib/propertyHelper";

export type LineChartPayload = {
  name: string;
  "Average Sale Price": number | null;
  "Average Rent Price": number | null;
  "Average Rating": number | null;
};

const RWLineChart = ({ data }: { data: LineChartPayload[] }) => {
  const formatValue = (value: number) => {
    return priceToStringShort(value);
  };

  console.log(data);

  const formatValueTooltip = (value: number) => {
    return priceToString(value);
  };

  return (
    <ResponsiveContainer width="100%" height={285}>
      <LineChart
        width={500}
        height={285}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fill: "#C1C2C5", style: { fontSize: "0.8rem" } }} />
        <YAxis
          yAxisId="left"
          domain={["dataMax", "dataMin"]}
          tick={{ fill: "#C1C2C5", style: { fontSize: "0.8rem" } }}
          tickFormatter={formatValue}
          label={{
            value: "Price (€)",
            position: "outsideLeft",
            angle: 90,
            dy: -10,
            dx: 45,
            style: { textAnchor: "middle", fill: "#C1C2C5", fontSize: "1.05rem" },
          }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fill: "#C1C2C5", style: { fontSize: "0.8rem" } }}
          tickFormatter={(val) => Number(val).toFixed(2).replaceAll(".", ",").replaceAll(",00", "")}
          domain={[1, 10]}
          label={{
            value: "Rating",
            position: "outsideRight",
            angle: -90,
            dy: -10,
            dx: -45,
            style: { textAnchor: "middle", fill: "#C1C2C5", fontSize: "1.05rem" },
          }}
        />

        <Tooltip />
        <Legend />
        <Line
          yAxisId="right"
          orientation="right"
          connectNulls
          type="monotone"
          dataKey="Average Rating"
          stroke="#0ca678"
          fill="#0ca678"
          strokeWidth={3}
          dot={{ r: 3 }}
          activeDot={{ r: 6 }}
        />
        <Line
          yAxisId="left"
          orientation="left"
          connectNulls
          type="monotone"
          dataKey="Average Sale Price"
          stroke="#f03e3e"
          fill="#f03e3e"
          strokeWidth={3}
          dot={{ r: 3 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RWLineChart;
