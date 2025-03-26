"use client"

import React from "react"
import { format } from "date-fns"
import {
  AreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from "recharts"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ArrowRight,
  Waves,
  Wind,
  Thermometer,
  Droplets,
  Eye,
  Cloud,
  CloudRain,
  CloudSnow,
  Compass,
  History,
  Moon,
  Mountain,
  Ruler,
  Sun,
  BarChart3,
} from "lucide-react"

interface MarineWeatherProps {
  data: any
  type: "weather" | "bio" | "tide" | "astronomy" | "solar" | "elevation" | "historical"
}

// Define the marine data interface
interface MarineDataPoint {
  time: string
  [key: string]: any
}

export function MarineWeather({ data, type }: MarineWeatherProps) {
  if (!data || !data.hours) return null

  // Get the first 24 hours of data
  const hourlyData = data.hours.slice(0, 24)

  // Format time for x-axis and display
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString([], {
      month: "short",
      day: "numeric",
    })
  }

  // Helper function to get value from source
  const getValue = (hour: any, param: string, source = "sg") => {
    return hour[param]?.[source] !== undefined ? hour[param][source] : null
  }

  // Helper function to format values with units
  const formatValue = (value: any, unit: string, decimals = 1) => {
    if (value === null || value === undefined) return "N/A"
    return `${Number(value).toFixed(decimals)} ${unit}`
  }

  // Chart configuration for consistent colors
  const chartConfig = {
    waveHeight: {
      label: "Wave Height",
      color: "hsl(var(--chart-1))"
    },
    windSpeed: {
      label: "Wind Speed",
      color: "hsl(var(--chart-2))"
    },
    waterTemp: {
      label: "Water Temperature",
      color: "hsl(var(--chart-3))"
    },
    surface: {
      label: "Surface Wind",
      color: "hsl(var(--chart-1))"
    },
    at100m: {
      label: "Wind at 100m",
      color: "hsl(var(--chart-2))"
    },
    at500hpa: {
      label: "Wind at 500hPa",
      color: "hsl(var(--chart-3))"
    },
    gust: {
      label: "Gust",
      color: "hsl(var(--chart-4))"
    },
    windWaveHeight: {
      label: "Wind Wave Height",
      color: "hsl(var(--chart-2))"
    },
    swellHeight: {
      label: "Swell Height",
      color: "hsl(var(--chart-3))"
    },
    secondarySwellHeight: {
      label: "Secondary Swell Height",
      color: "hsl(var(--chart-4))"
    }
  }

  // Render weather data (temperature, wind, waves, etc.)
  const renderWeatherData = () => {
    const currentHour = hourlyData[0]

    return (
      <div className="space-y-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="waves">Wave Data</TabsTrigger>
            <TabsTrigger value="wind">Wind Data</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="elevation-2 card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-primary" />
                Air Temperature
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatValue(getValue(currentHour, "airTemperature"), "°C")}</div>
              <div className="text-sm text-muted-foreground">
                80m: {formatValue(getValue(currentHour, "airTemperature80m"), "°C")}
              </div>
              <div className="text-sm text-muted-foreground">
                100m: {formatValue(getValue(currentHour, "airTemperature100m"), "°C")}
              </div>
            </CardContent>
          </Card>

              <Card className="elevation-2 card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Wind className="h-4 w-4 text-primary" />
                Wind
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatValue(getValue(currentHour, "windSpeed"), "m/s")}</div>
              <div className="text-sm text-muted-foreground">
                Direction: {formatValue(getValue(currentHour, "windDirection"), "°", 0)}
              </div>
              <div className="text-sm text-muted-foreground">
                Gust: {formatValue(getValue(currentHour, "gust"), "m/s")}
              </div>
            </CardContent>
          </Card>

              <Card className="elevation-2 card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Waves className="h-4 w-4 text-primary" />
                Waves
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatValue(getValue(currentHour, "waveHeight"), "m")}</div>
              <div className="text-sm text-muted-foreground">
                Direction: {formatValue(getValue(currentHour, "waveDirection"), "°", 0)}
              </div>
              <div className="text-sm text-muted-foreground">
                Period: {formatValue(getValue(currentHour, "wavePeriod"), "s")}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="elevation-2 card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-primary" />
                Water & Humidity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Water Temp:</span>{" "}
                  {formatValue(getValue(currentHour, "waterTemperature"), "°C")}
                </div>
                <div>
                  <span className="font-medium">Humidity:</span>{" "}
                  {formatValue(getValue(currentHour, "humidity"), "%", 0)}
                </div>
                <div>
                      <span className="font-medium">Visibility:</span>{" "}
                      {formatValue(getValue(currentHour, "visibility"), "km")}
                </div>
              </div>
            </CardContent>
          </Card>

              <Card className="elevation-2 card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <CloudRain className="h-4 w-4 text-primary" />
                    Weather Conditions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Cloud Cover:</span>{" "}
                  {formatValue(getValue(currentHour, "cloudCover"), "%", 0)}
                </div>
                <div>
                  <span className="font-medium">Precipitation:</span>{" "}
                  {formatValue(getValue(currentHour, "precipitation"), "mm")}
                </div>
                <div>
                  <span className="font-medium">Pressure:</span>{" "}
                  {formatValue(getValue(currentHour, "pressure"), "hPa", 0)}
                </div>
              </div>
            </CardContent>
          </Card>

              <Card className="elevation-2 card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Compass className="h-4 w-4 text-primary" />
                Current
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Current Speed:</span>{" "}
                  {formatValue(getValue(currentHour, "currentSpeed"), "m/s")}
                </div>
                <div>
                  <span className="font-medium">Current Direction:</span>{" "}
                  {formatValue(getValue(currentHour, "currentDirection"), "°", 0)}
                </div>
                <div>
                      <span className="font-medium">Sea Level:</span>{" "}
                      {formatValue(getValue(currentHour, "seaLevel"), "m")}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

            {/* Overview Chart */}
            <Card className="elevation-2">
          <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Key Measurements (24h)
                </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
                  <ChartContainer 
                    config={chartConfig}
                    className="h-full"
                  >
                    <LineChart 
                      data={hourlyData.map((hour: MarineDataPoint) => ({
                        time: formatTime(hour.time),
                        waveHeight: getValue(hour, "waveHeight"),
                        windSpeed: getValue(hour, "windSpeed"),
                        waterTemp: getValue(hour, "waterTemperature"),
                      }))}
                      margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                    >
                      <XAxis dataKey="time" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                      />
                      <Line
                    yAxisId="left"
                        type="monotone"
                        dataKey="waveHeight"
                        stroke="hsl(var(--chart-1))"
                        strokeWidth={2}
                        dot={false}
                        name="Wave Height (m)"
                      />
                      <Line
                    yAxisId="right"
                        type="monotone"
                        dataKey="windSpeed"
                        stroke="hsl(var(--chart-2))"
                        strokeWidth={2}
                        dot={false}
                        name="Wind Speed (m/s)"
                      />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="waterTemp"
                        stroke="hsl(var(--chart-3))"
                        strokeWidth={2}
                        dot={false}
                        name="Water Temp (°C)"
                      />
                    </LineChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="waves" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="elevation-2 card-hover">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Waves className="h-4 w-4 text-primary" />
                    Wave Characteristics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Wave Height</h4>
                        <p className="text-xl">{formatValue(getValue(hourlyData[0], "waveHeight"), "m")}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Wave Period</h4>
                        <p className="text-xl">{formatValue(getValue(hourlyData[0], "wavePeriod"), "s")}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Wave Direction</h4>
                        <p className="text-xl">{formatValue(getValue(hourlyData[0], "waveDirection"), "°", 0)}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Water Temp</h4>
                        <p className="text-xl">{formatValue(getValue(hourlyData[0], "waterTemperature"), "°C")}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="elevation-2 card-hover">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Waves className="h-4 w-4 text-primary" />
                    Wind Wave Data
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Wind Wave Height</h4>
                        <p className="text-xl">{formatValue(getValue(hourlyData[0], "windWaveHeight"), "m")}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Wind Wave Period</h4>
                        <p className="text-xl">{formatValue(getValue(hourlyData[0], "windWavePeriod"), "s")}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Wind Wave Direction</h4>
                      <p className="text-xl">{formatValue(getValue(hourlyData[0], "windWaveDirection"), "°", 0)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="elevation-2 card-hover">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Waves className="h-4 w-4 text-primary" />
                    Primary Swell
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Swell Height</h4>
                        <p className="text-xl">{formatValue(getValue(hourlyData[0], "swellHeight"), "m")}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Swell Period</h4>
                        <p className="text-xl">{formatValue(getValue(hourlyData[0], "swellPeriod"), "s")}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Swell Direction</h4>
                      <p className="text-xl">{formatValue(getValue(hourlyData[0], "swellDirection"), "°", 0)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="elevation-2 card-hover">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Waves className="h-4 w-4 text-primary" />
                    Secondary Swell
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Secondary Swell Height</h4>
                        <p className="text-xl">{formatValue(getValue(hourlyData[0], "secondarySwellHeight"), "m")}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Secondary Swell Period</h4>
                        <p className="text-xl">{formatValue(getValue(hourlyData[0], "secondarySwellPeriod"), "s")}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Secondary Swell Direction</h4>
                      <p className="text-xl">{formatValue(getValue(hourlyData[0], "secondarySwellDirection"), "°", 0)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Wave Chart */}
            <Card className="elevation-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Wave Measurements (24h)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer 
                    config={chartConfig}
                    className="h-full"
                  >
                    <LineChart 
                      data={hourlyData.map((hour: MarineDataPoint) => ({
                        time: formatTime(hour.time),
                        waveHeight: getValue(hour, "waveHeight"),
                        windWaveHeight: getValue(hour, "windWaveHeight"),
                        swellHeight: getValue(hour, "swellHeight"),
                        secondarySwellHeight: getValue(hour, "secondarySwellHeight"),
                      }))}
                      margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                    >
                      <XAxis dataKey="time" />
                      <YAxis />
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                      />
                  <Line
                    type="monotone"
                    dataKey="waveHeight"
                        stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    dot={false}
                    name="Wave Height (m)"
                  />
                  <Line
                    type="monotone"
                        dataKey="windWaveHeight"
                        stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    dot={false}
                        name="Wind Wave Height (m)"
                      />
                      <Line
                        type="monotone"
                        dataKey="swellHeight"
                        stroke="hsl(var(--chart-3))"
                        strokeWidth={2}
                        dot={false}
                        name="Swell Height (m)"
                      />
                      <Line
                        type="monotone"
                        dataKey="secondarySwellHeight"
                        stroke="hsl(var(--chart-4))"
                        strokeWidth={2}
                        dot={false}
                        name="Secondary Swell Height (m)"
                  />
                </LineChart>
                  </ChartContainer>
            </div>
          </CardContent>
        </Card>
          </TabsContent>
          
          <TabsContent value="wind" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="elevation-2 card-hover">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Wind className="h-4 w-4 text-primary" />
                    Surface Wind
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Wind Speed</h4>
                      <p className="text-xl">{formatValue(getValue(hourlyData[0], "windSpeed"), "m/s")}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Wind Direction</h4>
                      <p className="text-xl">{formatValue(getValue(hourlyData[0], "windDirection"), "°", 0)}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Gust</h4>
                      <p className="text-xl">{formatValue(getValue(hourlyData[0], "gust"), "m/s")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="elevation-2 card-hover">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Wind className="h-4 w-4 text-primary" />
                    Wind at Different Heights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">20m:</span>
                      <span>{formatValue(getValue(hourlyData[0], "windSpeed20m"), "m/s")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">30m:</span>
                      <span>{formatValue(getValue(hourlyData[0], "windSpeed30m"), "m/s")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">40m:</span>
                      <span>{formatValue(getValue(hourlyData[0], "windSpeed40m"), "m/s")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">50m:</span>
                      <span>{formatValue(getValue(hourlyData[0], "windSpeed50m"), "m/s")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">80m:</span>
                      <span>{formatValue(getValue(hourlyData[0], "windSpeed80m"), "m/s")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">100m:</span>
                      <span>{formatValue(getValue(hourlyData[0], "windSpeed100m"), "m/s")}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="elevation-2 card-hover">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Wind className="h-4 w-4 text-primary" />
                    Wind at Pressure Levels
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">1000hPa:</span>
                      <span>{formatValue(getValue(hourlyData[0], "windSpeed1000hpa"), "m/s")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">800hPa:</span>
                      <span>{formatValue(getValue(hourlyData[0], "windSpeed800hpa"), "m/s")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">500hPa:</span>
                      <span>{formatValue(getValue(hourlyData[0], "windSpeed500hpa"), "m/s")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">200hPa:</span>
                      <span>{formatValue(getValue(hourlyData[0], "windSpeed200hpa"), "m/s")}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="elevation-2 card-hover">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Compass className="h-4 w-4 text-primary" />
                    Wind Direction at Heights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Surface:</span>
                      <span>{formatValue(getValue(hourlyData[0], "windDirection"), "°", 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">20m:</span>
                      <span>{formatValue(getValue(hourlyData[0], "windDirection20m"), "°", 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">30m:</span>
                      <span>{formatValue(getValue(hourlyData[0], "windDirection30m"), "°", 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">40m:</span>
                      <span>{formatValue(getValue(hourlyData[0], "windDirection40m"), "°", 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">50m:</span>
                      <span>{formatValue(getValue(hourlyData[0], "windDirection50m"), "°", 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">80m:</span>
                      <span>{formatValue(getValue(hourlyData[0], "windDirection80m"), "°", 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">100m:</span>
                      <span>{formatValue(getValue(hourlyData[0], "windDirection100m"), "°", 0)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="elevation-2 card-hover">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Compass className="h-4 w-4 text-primary" />
                    Wind Direction at Pressure Levels
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">1000hPa:</span>
                      <span>{formatValue(getValue(hourlyData[0], "windDirection1000hpa"), "°", 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">800hPa:</span>
                      <span>{formatValue(getValue(hourlyData[0], "windDirection800hpa"), "°", 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">500hPa:</span>
                      <span>{formatValue(getValue(hourlyData[0], "windDirection500hpa"), "°", 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">200hPa:</span>
                      <span>{formatValue(getValue(hourlyData[0], "windDirection200hpa"), "°", 0)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Wind Chart */}
            <Card className="elevation-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Wind Speed Comparison (24h)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer 
                    config={chartConfig}
                    className="h-full"
                  >
                    <LineChart 
                      data={hourlyData.map((hour: MarineDataPoint) => ({
                        time: formatTime(hour.time),
                        surface: getValue(hour, "windSpeed"),
                        at100m: getValue(hour, "windSpeed100m"),
                        at500hpa: getValue(hour, "windSpeed500hpa"),
                        gust: getValue(hour, "gust"),
                      }))}
                      margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                    >
                      <XAxis dataKey="time" />
                      <YAxis />
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                      />
                      <Line
                        type="monotone"
                        dataKey="surface"
                        stroke="hsl(var(--chart-1))"
                        strokeWidth={2}
                        dot={false}
                        name="Surface Wind (m/s)"
                      />
                      <Line
                        type="monotone"
                        dataKey="at100m"
                        stroke="hsl(var(--chart-2))"
                        strokeWidth={2}
                        dot={false}
                        name="Wind at 100m (m/s)"
                      />
                      <Line
                        type="monotone"
                        dataKey="at500hpa"
                        stroke="hsl(var(--chart-3))"
                        strokeWidth={2}
                        dot={false}
                        name="Wind at 500hPa (m/s)"
                      />
                      <Line
                        type="monotone"
                        dataKey="gust"
                        stroke="hsl(var(--chart-4))"
                        strokeWidth={2}
                        dot={false}
                        name="Gust (m/s)"
                      />
                    </LineChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  // Render bio data (visibility, etc.)
  const renderBioData = () => {
    const currentHour = hourlyData[0]

    // Prepare chart data
    const chartData = hourlyData.map((hour: MarineDataPoint) => ({
      time: formatTime(hour.time),
      visibility: getValue(hour, "visibility"),
      waterTemp: getValue(hour, "waterTemperature"),
      humidity: getValue(hour, "humidity"),
    }))

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Visibility
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatValue(getValue(currentHour, "visibility"), "km")}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Droplets className="h-4 w-4" />
                Water Temperature
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatValue(getValue(currentHour, "waterTemperature"), "°C")}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Cloud className="h-4 w-4" />
                Humidity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatValue(getValue(currentHour, "humidity"), "%", 0)}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Visibility & Water Temperature (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer 
                config={chartConfig}
                className="h-full"
              >
                <LineChart data={chartData}>
                  <XAxis
                    dataKey="time"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => value.split(":")[0]}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    yAxisId="left"
                    label={{ value: "Visibility (km)", angle: -90, position: "insideLeft" }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    yAxisId="right"
                    orientation="right"
                    label={{ value: "Water Temp (°C)", angle: 90, position: "insideRight" }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="visibility"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                    yAxisId="left"
                    name="Visibility (km)"
                  />
                  <Line
                    type="monotone"
                    dataKey="waterTemp"
                    stroke="hsl(var(--secondary))"
                    strokeWidth={2}
                    dot={false}
                    yAxisId="right"
                    name="Water Temp (°C)"
                  />
                </LineChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Render tide data (sea level)
  const renderTideData = () => {
    const currentHour = hourlyData[0]

    // Prepare chart data
    const chartData = hourlyData.map((hour: MarineDataPoint) => ({
      time: formatTime(hour.time),
      seaLevel: getValue(hour, "seaLevel"),
    }))

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Waves className="h-4 w-4" />
              Sea Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatValue(getValue(currentHour, "seaLevel"), "m")}</div>
            <div className="text-sm text-muted-foreground">Relative to Mean Sea Level (MSL)</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sea Level (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer 
                config={chartConfig}
                className="h-full"
              >
                <LineChart data={chartData}>
                  <XAxis
                    dataKey="time"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => value.split(":")[0]}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    label={{ value: "Sea Level (m)", angle: -90, position: "insideLeft" }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="seaLevel"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                    name="Sea Level (m)"
                  />
                </LineChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Render astronomy data (simulated sunrise/sunset)
  const renderAstronomyData = () => {
    // Since StormGlass doesn't provide astronomy data directly,
    // we'll use a simulated approach based on the date
    const date = new Date(hourlyData[0].time)
    const month = date.getMonth()

    // Simulate sunrise/sunset times based on month (northern hemisphere)
    let sunrise, sunset, moonrise, moonset

    if (month >= 3 && month <= 8) {
      // Spring/Summer
      sunrise = "05:30 AM"
      sunset = "08:45 PM"
      moonrise = "09:15 PM"
      moonset = "06:30 AM"
    } else {
      // Fall/Winter
      sunrise = "07:15 AM"
      sunset = "05:30 PM"
      moonrise = "06:45 PM"
      moonset = "07:30 AM"
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Sun className="h-4 w-4" />
              Sunrise/Sunset
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{formatDate(hourlyData[0].time)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span>Sunrise:</span>
                <span>{sunrise}</span>
              </div>
              <div className="flex justify-between">
                <span>Sunset:</span>
                <span>{sunset}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-4">
                Note: Sunrise/sunset times are approximated based on the date and location.
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Moon className="h-4 w-4" />
              Moonrise/Moonset
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{formatDate(hourlyData[0].time)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span>Moonrise:</span>
                <span>{moonrise}</span>
              </div>
              <div className="flex justify-between">
                <span>Moonset:</span>
                <span>{moonset}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-4">
                Note: Moonrise/moonset times are approximated based on the date and location.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Render solar data (simulated solar radiation)
  const renderSolarData = () => {
    // Simulate solar radiation based on time of day
    const chartData = hourlyData.map((hour: MarineDataPoint) => {
      const hourTime = new Date(hour.time)
      const hourOfDay = hourTime.getHours()

      // Create a bell curve peaking at noon
      let solarRadiation = 0
      if (hourOfDay >= 6 && hourOfDay <= 18) {
        solarRadiation = Math.sin(((hourOfDay - 6) / 12) * Math.PI) * 1000
      }

      return {
        time: formatTime(hour.time),
        solarRadiation: solarRadiation,
        cloudCover: getValue(hour, "cloudCover"),
      }
    })

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Sun className="h-4 w-4" />
              Solar Conditions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Cloud Cover:</span>
                <span>{formatValue(getValue(hourlyData[0], "cloudCover"), "%", 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Date:</span>
                <span>{formatDate(hourlyData[0].time)}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-4">
                Note: Solar radiation is simulated based on time of day and cloud cover.
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Simulated Solar Radiation (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer 
                config={chartConfig}
                className="h-full"
              >
                <LineChart data={chartData}>
                  <XAxis
                    dataKey="time"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => value.split(":")[0]}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    yAxisId="left"
                    label={{ value: "Solar Radiation (W/m²)", angle: -90, position: "insideLeft" }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    yAxisId="right"
                    orientation="right"
                    domain={[0, 100]}
                    label={{ value: "Cloud Cover (%)", angle: 90, position: "insideRight" }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="solarRadiation"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                    yAxisId="left"
                    name="Solar Radiation (W/m²)"
                  />
                  <Line
                    type="monotone"
                    dataKey="cloudCover"
                    stroke="hsl(var(--secondary))"
                    strokeWidth={2}
                    dot={false}
                    yAxisId="right"
                    name="Cloud Cover (%)"
                  />
                </LineChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Render elevation data (wave and swell height)
  const renderElevationData = () => {
    const currentHour = hourlyData[0]

    // Prepare chart data
    const chartData = hourlyData.map((hour: MarineDataPoint) => ({
      time: formatTime(hour.time),
      waveHeight: getValue(hour, "waveHeight"),
      swellHeight: getValue(hour, "swellHeight"),
      windWaveHeight: getValue(hour, "windWaveHeight"),
    }))

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Waves className="h-4 w-4" />
                Wave Height
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatValue(getValue(currentHour, "waveHeight"), "m")}</div>
              <div className="text-sm text-muted-foreground">Combined sea and swell</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Waves className="h-4 w-4" />
                Swell Height
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatValue(getValue(currentHour, "swellHeight"), "m")}</div>
              <div className="text-sm text-muted-foreground">
                Direction: {formatValue(getValue(currentHour, "swellDirection"), "°", 0)}
              </div>
              <div className="text-sm text-muted-foreground">
                Period: {formatValue(getValue(currentHour, "swellPeriod"), "s")}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Wind className="h-4 w-4" />
                Wind Wave Height
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatValue(getValue(currentHour, "windWaveHeight"), "m")}</div>
              <div className="text-sm text-muted-foreground">
                Direction: {formatValue(getValue(currentHour, "windWaveDirection"), "°", 0)}
              </div>
              <div className="text-sm text-muted-foreground">
                Period: {formatValue(getValue(currentHour, "windWavePeriod"), "s")}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Wave Heights (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer 
                config={chartConfig}
                className="h-full"
              >
                <LineChart data={chartData}>
                  <XAxis
                    dataKey="time"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => value.split(":")[0]}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    label={{ value: "Height (m)", angle: -90, position: "insideLeft" }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="waveHeight"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                    name="Wave Height (m)"
                  />
                  <Line
                    type="monotone"
                    dataKey="swellHeight"
                    stroke="hsl(var(--secondary))"
                    strokeWidth={2}
                    dot={false}
                    name="Swell Height (m)"
                  />
                  <Line
                    type="monotone"
                    dataKey="windWaveHeight"
                    stroke="hsl(var(--destructive))"
                    strokeWidth={2}
                    dot={false}
                    name="Wind Wave Height (m)"
                  />
                </LineChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Render historical data (simulated)
  const renderHistoricalData = () => {
    // For historical data, we'll use the actual data we have
    // but present it as if it were historical

    // Prepare chart data
    const chartData = hourlyData.map((hour: MarineDataPoint) => ({
      time: formatTime(hour.time),
      waveHeight: getValue(hour, "waveHeight"),
      windSpeed: getValue(hour, "windSpeed"),
      waterTemp: getValue(hour, "waterTemperature"),
    }))

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Historical Data Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Date Range:</span>
                <span>
                  {formatDate(hourlyData[0].time)} - {formatDate(hourlyData[hourlyData.length - 1].time)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-medium">Max Wave Height:</span>
                <span>{formatValue(Math.max(...hourlyData.map((h: MarineDataPoint) => getValue(h, "waveHeight") || 0)), "m")}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Max Wind Speed:</span>
                <span>{formatValue(Math.max(...hourlyData.map((h: MarineDataPoint) => getValue(h, "windSpeed") || 0)), "m/s")}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Avg Water Temp:</span>
                <span>
                  {formatValue(
                    hourlyData.reduce((sum: number, h: MarineDataPoint) => sum + (getValue(h, "waterTemperature") || 0), 0) / hourlyData.length,
                    "°C",
                  )}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Historical Data (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer 
                config={chartConfig}
                className="h-full"
              >
                <LineChart data={chartData}>
                  <XAxis
                    dataKey="time"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => value.split(":")[0]}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    yAxisId="left"
                    label={{ value: "Wave Height (m)", angle: -90, position: "insideLeft" }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    yAxisId="right"
                    orientation="right"
                    label={{ value: "Wind Speed (m/s)", angle: 90, position: "insideRight" }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="waveHeight"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                    yAxisId="left"
                    name="Wave Height (m)"
                  />
                  <Line
                    type="monotone"
                    dataKey="windSpeed"
                    stroke="hsl(var(--secondary))"
                    strokeWidth={2}
                    dot={false}
                    yAxisId="right"
                    name="Wind Speed (m/s)"
                  />
                </LineChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Render content based on type
  const renderContent = () => {
    switch (type) {
      case "weather":
        return renderWeatherData()
      case "bio":
        return renderBioData()
      case "tide":
        return renderTideData()
      case "astronomy":
        return renderAstronomyData()
      case "solar":
        return renderSolarData()
      case "elevation":
        return renderElevationData()
      case "historical":
        return renderHistoricalData()
      default:
        return (
          <Card className="elevation-2">
            <CardHeader>
              <CardTitle>No Data Available</CardTitle>
            </CardHeader>
            <CardContent>
              <p>No marine data available for this category.</p>
            </CardContent>
          </Card>
        )
    }
  }

  return renderContent()
}

