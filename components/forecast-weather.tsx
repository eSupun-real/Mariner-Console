"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface ForecastWeatherProps {
  data: any
}

export function ForecastWeather({ data }: ForecastWeatherProps) {
  if (!data) return null

  // Helper function to get weather icon URL
  const getWeatherIconUrl = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}.png`
  }

  // Group forecast data by day
  const groupByDay = (list: any[]) => {
    const grouped = {}

    list.forEach((item) => {
      const date = new Date(item.dt * 1000).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })

      if (!grouped[date]) {
        grouped[date] = []
      }

      grouped[date].push(item)
    })

    return grouped
  }

  // Get daily min and max temperatures
  const getDailyMinMax = (items: any[]) => {
    let min = Number.POSITIVE_INFINITY
    let max = Number.NEGATIVE_INFINITY

    items.forEach((item) => {
      if (item.main.temp_min < min) min = item.main.temp_min
      if (item.main.temp_max > max) max = item.main.temp_max
    })

    return { min: Math.round(min), max: Math.round(max) }
  }

  // Get most common weather condition for the day
  const getDailyWeather = (items: any[]) => {
    const conditions = {}

    items.forEach((item) => {
      const condition = item.weather[0].main
      conditions[condition] = (conditions[condition] || 0) + 1
    })

    let mostCommon = ""
    let highestCount = 0

    Object.entries(conditions).forEach(([condition, count]) => {
      if (count > highestCount) {
        mostCommon = condition
        highestCount = count as number
      }
    })

    // Get the icon from the first occurrence of the most common condition
    const iconItem = items.find((item) => item.weather[0].main === mostCommon)
    return {
      condition: mostCommon,
      icon: iconItem.weather[0].icon,
      description: iconItem.weather[0].description,
    }
  }

  const groupedForecast = groupByDay(data.list)

  // Get next 5 days (excluding today)
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })

  const forecastDays = Object.keys(groupedForecast)
    .filter((day) => day !== today)
    .slice(0, 5)

  return (
    <div className="col-span-2">
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle>5-Day Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {forecastDays.map((day, index) => {
              const dayData = groupedForecast[day]
              const { min, max } = getDailyMinMax(dayData)
              const { condition, icon, description } = getDailyWeather(dayData)

              return (
                <div key={day} className="flex flex-col items-center">
                  <div className="font-medium">{day}</div>
                  <img src={getWeatherIconUrl(icon) || "/placeholder.svg"} alt={description} width={50} height={50} />
                  <div className="text-sm capitalize">{condition}</div>
                  <div className="flex gap-2 text-sm">
                    <span className="font-medium">{max}°</span>
                    <span className="text-muted-foreground">{min}°</span>
                  </div>

                  {index < forecastDays.length - 1 && (
                    <Separator className="hidden md:block md:absolute md:h-full md:right-0 md:top-0 md:w-px" />
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

