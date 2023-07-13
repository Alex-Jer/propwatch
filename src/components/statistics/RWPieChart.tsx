import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Sector, Text } from "recharts";

/*const exampleData = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
];*/

export type PieChartPayload = {
  name: string;
  value: number;
  color: string;
};

interface ActiveShapeProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  fill: string;
  payload: PieChartPayload;
  percent: number;
  value: number;
}

const renderActiveShape = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  payload,
  percent,
  value,
}: ActiveShapeProps) => {
  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";
  return (
    <g>
      <Text x={cx} y={cy} dy={8} textAnchor="middle" className="capitalize" fill={"#C1C2C5"}>
        {payload.name}
      </Text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={"#C1C2C5"}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={"#C1C2C5"}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={"#C1C2C5"} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={"#C1C2C5"} stroke="none" />
      <Text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill={"#C1C2C5"}
      >{`${value} properties`}</Text>
      <Text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill={"#909296"}>
        {`${payload.name} (${(percent * 100).toFixed(0).replaceAll(".", ",")}%)`}
      </Text>
    </g>
  );
};

const RWPieChart = ({ data }: { data: PieChartPayload[] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  return (
    <ResponsiveContainer width="100%" height={285}>
      <PieChart width={450} height={285}>
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          data={data}
          dataKey="value"
          onMouseEnter={onPieEnter}
        >
          {data.map((entry) => (
            <Cell key={`pc-cell-${entry.name}`} strokeOpacity={0} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default RWPieChart;
