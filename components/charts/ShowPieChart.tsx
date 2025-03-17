"use client";

import * as React from "react";
import { Download, FileType, TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface DynamicChartData {
  browser: string;
  visitors: number;
  fill: string;
}

interface ShowDynamicPieChartProps {
  defaultData?: DynamicChartData[];
  defaultConfig?: ChartConfig;
}

/**
 * Generates an array of fill colors (as HSL strings) based on the selected palette.
 * For the "default" palette, it will generate random colors for each row.
 */
const generatePaletteFills = (palette: string, count: number): string[] => {
  const colors: string[] = [];

  if (count === 1) {
    // Single data point – pick a single color
    switch (palette) {
      case "default":
        // Random color for the single data point
        {
          const randomHue = Math.floor(Math.random() * 360);
          const randomSaturation = 50 + Math.floor(Math.random() * 50);
          const randomLightness = 40 + Math.floor(Math.random() * 30);
          colors.push(
            `hsl(${randomHue}, ${randomSaturation}%, ${randomLightness}%)`
          );
        }
        break;
      case "yellow":
        colors.push(`hsl(60, 100%, 50%)`);
        break;
      case "gray":
        colors.push(`hsl(0, 0%, 50%)`);
        break;
      case "black":
        colors.push(`hsl(0, 0%, 20%)`);
        break;
      case "white":
        colors.push(`hsl(0, 0%, 95%)`);
        break;
      case "blue":
        colors.push(`hsl(240, 100%, 50%)`);
        break;
      case "green":
        colors.push(`hsl(120, 100%, 50%)`);
        break;
      default:
        // Default fallback – random as well
        {
          const randomHue = Math.floor(Math.random() * 360);
          const randomSaturation = 50 + Math.floor(Math.random() * 50);
          const randomLightness = 40 + Math.floor(Math.random() * 30);
          colors.push(
            `hsl(${randomHue}, ${randomSaturation}%, ${randomLightness}%)`
          );
        }
        break;
    }
  } else {
    // Multiple data points
    for (let i = 0; i < count; i++) {
      switch (palette) {
        case "default":
          // Generate random colors for each column
          {
            const randomHue = Math.floor(Math.random() * 360);
            const randomSaturation = 50 + Math.floor(Math.random() * 50);
            const randomLightness = 40 + Math.floor(Math.random() * 30);
            colors.push(
              `hsl(${randomHue}, ${randomSaturation}%, ${randomLightness}%)`
            );
          }
          break;
        case "yellow":
          // Shades of yellow
          const yellowLightness = 60 - (20 * i) / (count - 1);
          colors.push(`hsl(60, 100%, ${yellowLightness}%)`);
          break;
        case "gray":
          // Gray: saturation = 0
          const grayLightness = 70 - (30 * i) / (count - 1);
          colors.push(`hsl(0, 0%, ${grayLightness}%)`);
          break;
        case "black":
          // Very dark to slightly less dark
          const blackLightness = 10 + (20 * i) / (count - 1);
          colors.push(`hsl(0, 0%, ${blackLightness}%)`);
          break;
        case "white":
          // Very light shades
          const whiteLightness = 90 + (5 * i) / (count - 1);
          colors.push(`hsl(0, 0%, ${whiteLightness}%)`);
          break;
        case "blue":
          // Shades of blue
          const blueLightness = 60 - (20 * i) / (count - 1);
          colors.push(`hsl(240, 100%, ${blueLightness}%)`);
          break;
        case "green":
          // Shades of green
          const greenLightness = 60 - (20 * i) / (count - 1);
          colors.push(`hsl(120, 100%, ${greenLightness}%)`);
          break;
        default:
          // Fallback – also generate random colors
          {
            const randomHue = Math.floor(Math.random() * 360);
            const randomSaturation = 50 + Math.floor(Math.random() * 50);
            const randomLightness = 40 + Math.floor(Math.random() * 30);
            colors.push(
              `hsl(${randomHue}, ${randomSaturation}%, ${randomLightness}%)`
            );
          }
          break;
      }
    }
  }
  return colors;
};

const defaultData: DynamicChartData[] = [
  { browser: "chrome", visitors: 275, fill: "" },
  { browser: "safari", visitors: 200, fill: "" },
  { browser: "firefox", visitors: 287, fill: "" },
  { browser: "edge", visitors: 173, fill: "" },
  { browser: "other", visitors: 190, fill: "" },
];

// Default chart configuration
const defaultConfig: ChartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(30, 100%, 50%)",
  },
  safari: {
    label: "Safari",
    color: "hsl(30, 100%, 50%)",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(30, 100%, 50%)",
  },
  edge: {
    label: "Edge",
    color: "hsl(30, 100%, 50%)",
  },
  other: {
    label: "Other",
    color: "hsl(30, 100%, 50%)",
  },
} satisfies ChartConfig;

const ShowDynamicPieChart: React.FC<ShowDynamicPieChartProps> = ({
  defaultData: propData = defaultData,
  defaultConfig: propConfig = defaultConfig,
}) => {
  const chartRef = React.useRef<HTMLDivElement>(null);

  // Palette selection for the entire chart – default is now "default" (random).
  const [selectedPalette, setSelectedPalette] =
    React.useState<string>("default");

  // Initialize formData and chartData with computed fill colors.
  const initialData = (propData ?? defaultData).map((row, index, arr) => ({
    ...row,
    fill: generatePaletteFills(selectedPalette, arr.length)[index],
  }));

  const [formData, setFormData] =
    React.useState<DynamicChartData[]>(initialData);
  const [chartData, setChartData] =
    React.useState<DynamicChartData[]>(initialData);

  // Handle changes for browser and visitor inputs.
  const handleInputChange = (
    index: number,
    field: keyof Omit<DynamicChartData, "fill">,
    value: string
  ) => {
    const updatedData = [...formData];
    if (field === "visitors") {
      updatedData[index][field] = Number(value);
    } else {
      updatedData[index][field] = value;
    }
    setFormData(updatedData);
  };

  // Append a new row for additional data.
  const addRow = () => {
    setFormData([...formData, { browser: "", visitors: 0, fill: "" }]);
  };

  // Update chartData by regenerating fill colors for all rows based on the selected palette.
  const generateChart = () => {
    const fills = generatePaletteFills(selectedPalette, formData.length);
    const newChartData = formData.map((row, index) => ({
      ...row,
      fill: fills[index],
    }));
    setChartData(newChartData);
  };

  const downloadAsPNG = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = "pie-chart.png";
      link.click();
    }
  };

  const downloadAsPDF = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const imageData = canvas.toDataURL("image/png");

      const pdfWidth = 595.28;
      const pdfHeight = 841.89;
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      const imageWidth = canvas.width;
      const imageHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imageWidth, pdfHeight / imageHeight);
      const centerX = (pdfWidth - imageWidth * ratio) / 2;
      const centerY = (pdfHeight - imageHeight * ratio) / 2;

      pdf.addImage(
        imageData,
        "PNG",
        centerX,
        centerY,
        imageWidth * ratio,
        imageHeight * ratio
      );
      pdf.save("pie-chart.pdf");
    }
  };

  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
  }, [chartData]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-orange-500 dark:text-orange-400">
          Pie Chart - Donut with Text
        </CardTitle>
        <CardDescription className="text-orange-500 dark:text-orange-400">
          January - June 2024
        </CardDescription>
        <div className="flex gap-2 mt-2">
          <button
            onClick={downloadAsPNG}
            className="inline-flex items-center gap-2 px-3 py-1 text-sm bg-orange-500 dark:bg-orange-700 text-white border border-orange-500 dark:border-orange-700 rounded-none hover:bg-orange-600 dark:hover:bg-orange-800"
          >
            <Download className="h-4 w-4" /> PNG
          </button>
          <button
            onClick={downloadAsPDF}
            className="inline-flex items-center gap-2 px-3 py-1 text-sm bg-orange-500 dark:bg-orange-700 text-white border border-orange-500 dark:border-orange-700 rounded-none hover:bg-orange-600 dark:hover:bg-orange-800"
          >
            <FileType className="h-4 w-4" /> PDF
          </button>
        </div>
      </CardHeader>

      {/* Palette selector for the entire chart */}
      <CardContent className="pt-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-orange-500 dark:text-orange-400">
            Select Palette:
          </label>
          <select
            className="rounded-none border border-gray-300 bg-transparent px-2 py-1 text-sm"
            value={selectedPalette}
            onChange={(e) => setSelectedPalette(e.target.value)}
          >
            <option value="default">Default (Random)</option>
            <option value="yellow">Yellow</option>
            <option value="gray">Gray</option>
            <option value="black">Black</option>
            <option value="white">White</option>
            <option value="blue">Blue</option>
            <option value="green">Green</option>
          </select>
        </div>
      </CardContent>

      {/* Form for dynamic data input */}
      <CardContent className="pt-4">
        <div className="space-y-4">
          {formData.map((row, index) => (
            <div key={index} className="grid grid-cols-2 gap-2">
              <Input
                className="rounded-none"
                type="text"
                placeholder="Browser"
                value={row.browser}
                onChange={(e) =>
                  handleInputChange(index, "browser", e.target.value)
                }
              />
              <Input
                className="rounded-none"
                type="number"
                placeholder="Visitors"
                value={row.visitors}
                onChange={(e) =>
                  handleInputChange(index, "visitors", e.target.value)
                }
              />
            </div>
          ))}
          <div className="flex gap-2">
            <button
              onClick={addRow}
              className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-400 rounded-none hover:bg-gray-300 dark:hover:bg-gray-700"
            >
              Add Row
            </button>
            <button
              onClick={generateChart}
              className="px-3 py-1 text-sm bg-orange-500 dark:bg-orange-700 text-white border border-orange-500 dark:border-orange-700 rounded-none hover:bg-orange-600 dark:hover:bg-orange-800"
            >
              Generate Chart
            </button>
          </div>
        </div>
      </CardContent>

      {/* Chart section */}
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          ref={chartRef}
          config={propConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-orange-500 dark:fill-orange-400 text-3xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-orange-500 dark:fill-orange-400"
                        >
                          Visitors
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
        {chartData.map((row, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: row.fill }}
            ></div>
            <span className="text-sm text-orange-500 dark:text-orange-400">
              {row.browser} ({row.visitors.toLocaleString()} visitors)
            </span>
          </div>
        ))}
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none text-orange-500 dark:text-orange-400">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-orange-500 dark:text-orange-400">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
};

export default ShowDynamicPieChart;
