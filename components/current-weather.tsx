"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Compass, Droplets, Thermometer, Wind } from "lucide-react"

interface CurrentWeatherProps {
  data: any
}

export function CurrentWeather({ data }: CurrentWeatherProps) {
  if (!data) return null

  // Helper function to get weather icon URL
  const getWeatherIconUrl = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
  }

  // Format timestamp to readable time
  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="col-span-2 lg:col-span-1">
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="flex justify-between items-center">
            <span>Current Weather</span>
            <span className="text-sm font-normal text-muted-foreground">
              {data.name}, {data.sys.country}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center mb-4">
            <div className="flex items-center">
              <img
                src={getWeatherIconUrl(data.weather[0].icon) || "/placeholder.svg"}
                alt={data.weather[0].description}
                width={80}
                height={80}
              />
              <div className="text-4xl font-bold">{Math.round(data.main.temp)}°C</div>
            </div>
            <div className="text-lg capitalize">{data.weather[0].description}</div>
            <div className="text-sm text-muted-foreground">Feels like {Math.round(data.main.feels_like)}°C</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">High/Low</div>
                <div>
                  {Math.round(data.main.temp_max)}°/{Math.round(data.main.temp_min)}°
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Wind className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Wind</div>
                <div>{Math.round(data.wind.speed * 3.6)} km/h</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Humidity</div>
                <div>{data.main.humidity}%</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Pressure</div>
                <div>{data.main.pressure} hPa</div>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-4 text-sm text-muted-foreground">
            <div>
              <span className="block">Sunrise</span>
              <span>{formatTime(data.sys.sunrise)}</span>
            </div>
            <div className="text-right">
              <span className="block">Sunset</span>
              <span>{formatTime(data.sys.sunset)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

