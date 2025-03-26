"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AlertCircle, CloudRain, Loader2, Settings, Waves } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { APIKeyForm } from "@/components/api-key-form"
import { CurrentWeather } from "@/components/current-weather"
import { ForecastWeather } from "@/components/forecast-weather"
import { MarineWeather } from "@/components/marine-weather"
import { CitySearch } from "@/components/city-search"

export default function WeatherDashboard() {
  const [loading, setLoading] = useState(true)
  const [weatherData, setWeatherData] = useState(null)
  const [forecastData, setForecastData] = useState(null)
  const [marineData, setMarineData] = useState(null)
  const [marineLoading, setMarineLoading] = useState(false)
  const [location, setLocation] = useState({ lat: null, lon: null })
  const [city, setCity] = useState("")
  const [apiKeys, setApiKeys] = useState({
    openWeatherMap: "",
    stormGlass: "",
  })
  const [showSettings, setShowSettings] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const isMounted = useRef(true)

  // Set up cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  // Load API keys from local storage on initial render
  useEffect(() => {
    const storedOpenWeatherKey = localStorage.getItem("openWeatherMapApiKey")
    const storedStormGlassKey = localStorage.getItem("stormGlassApiKey")

    if (storedOpenWeatherKey) {
      setApiKeys((prev) => ({ ...prev, openWeatherMap: storedOpenWeatherKey }))
    }

    if (storedStormGlassKey) {
      setApiKeys((prev) => ({ ...prev, stormGlass: storedStormGlassKey }))
    }

    // Check if we need to show settings initially (if no API keys)
    if (!storedOpenWeatherKey || !storedStormGlassKey) {
      setShowSettings(true)
    }
  }, [])

  // Get user's location
  const locationInitializedRef = useRef(false)

  useEffect(() => {
    // Skip if we've already initialized location
    if (locationInitializedRef.current) return

    const lat = searchParams.get("lat")
    const lon = searchParams.get("lon")

    if (lat && lon) {
      setLocation({
        lat: Number.parseFloat(lat),
        lon: Number.parseFloat(lon),
      })
      locationInitializedRef.current = true
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (isMounted.current) {
            setLocation({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            })
            locationInitializedRef.current = true
          }
        },
        (error) => {
          console.error("Error getting location:", error)
          if (isMounted.current) {
            toast({
              title: "Location Error",
              description: "Unable to get your location. Please search for a city instead.",
              variant: "destructive",
            })
            setLoading(false)
            locationInitializedRef.current = true
          }
        },
      )
    } else {
      if (isMounted.current) {
        setLoading(false)
        locationInitializedRef.current = true
      }
    }
  }, [searchParams, toast])

  // Handle URL parameter changes after initial load
  useEffect(() => {
    // Skip the first render since it's handled by the location initialization effect
    if (!locationInitializedRef.current) return

    const lat = searchParams.get("lat")
    const lon = searchParams.get("lon")

    if (lat && lon) {
      const newLat = Number.parseFloat(lat)
      const newLon = Number.parseFloat(lon)

      // Only update if values actually changed
      if (newLat !== location.lat || newLon !== location.lon) {
        setLocation({
          lat: newLat,
          lon: newLon,
        })
      }
    }
  }, [searchParams, location.lat, location.lon])

  // Fetch weather data when location or API key changes
  useEffect(() => {
    let isCancelled = false

    async function fetchWeatherData() {
      // Skip if we don't have location or API key
      if (!location.lat || !location.lon || !apiKeys.openWeatherMap) {
        if (!isCancelled) setLoading(false)
        return
      }

      // Skip if we already have weather data for this location
      if (
        weatherData &&
        weatherData.coord &&
        Math.abs(weatherData.coord.lat - location.lat) < 0.01 &&
        Math.abs(weatherData.coord.lon - location.lon) < 0.01
      ) {
        if (!isCancelled) setLoading(false)
        return
      }

      if (!isCancelled) setLoading(true)

      try {
        // Fetch current weather
        const weatherResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${apiKeys.openWeatherMap}&units=metric`,
        )

        if (!weatherResponse.ok) throw new Error("Failed to fetch current weather")

        const weatherData = await weatherResponse.json()
        if (!isCancelled) {
          setWeatherData(weatherData)
          setCity(weatherData.name)
        }

        // Fetch 5-day forecast
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&appid=${apiKeys.openWeatherMap}&units=metric`,
        )

        if (!forecastResponse.ok) throw new Error("Failed to fetch forecast")

        const forecastData = await forecastResponse.json()
        if (!isCancelled) {
          setForecastData(forecastData)
        }
      } catch (error) {
        console.error("Error fetching weather data:", error)
        if (!isCancelled) {
          toast({
            title: "Error",
            description: "Failed to fetch weather data. Please check your API key.",
            variant: "destructive",
          })
        }
      } finally {
        if (!isCancelled) {
          setLoading(false)
        }
      }
    }

    fetchWeatherData()

    return () => {
      isCancelled = true
    }
  }, [location.lat, location.lon, apiKeys.openWeatherMap, toast, weatherData])

  // Fetch marine data when location or API key changes
  useEffect(() => {
    let isCancelled = false

    async function fetchMarineData() {
      // Skip if we don't have location or API key
      if (!location.lat || !location.lon || !apiKeys.stormGlass) return

      // Skip if we already have marine data for this location
      if (
        marineData &&
        marineData._meta &&
        marineData._meta.lat === location.lat &&
        marineData._meta.lng === location.lon
      ) {
        return
      }

      if (!isCancelled) setMarineLoading(true)

      try {
        // Use only requested parameters for StormGlass API
        const params = [
          // Wave parameters
          "waterTemperature",
          "wavePeriod", 
          "waveDirection", 
          "waveHeight",
          "windWaveDirection", 
          "windWaveHeight", 
          "windWavePeriod",
          "swellPeriod", 
          "secondarySwellPeriod", 
          "swellDirection", 
          "secondarySwellDirection", 
          "swellHeight", 
          "secondarySwellHeight",
          // Wind parameters
          "windSpeed", 
          "windSpeed20m", 
          "windSpeed30m", 
          "windSpeed40m", 
          "windSpeed50m", 
          "windSpeed80m", 
          "windSpeed100m", 
          "windSpeed1000hpa", 
          "windSpeed800hpa", 
          "windSpeed500hpa", 
          "windSpeed200hpa",
          "windDirection", 
          "windDirection20m", 
          "windDirection30m", 
          "windDirection40m", 
          "windDirection50m", 
          "windDirection80m", 
          "windDirection100m", 
          "windDirection1000hpa", 
          "windDirection800hpa", 
          "windDirection500hpa", 
          "windDirection200hpa",
          // Temperature & atmospheric parameters
          "airTemperature", 
          "airTemperature80m", 
          "airTemperature100m", 
          "airTemperature1000hpa", 
          "airTemperature800hpa", 
          "airTemperature500hpa", 
          "airTemperature200hpa",
          "precipitation", 
          "gust", 
          "cloudCover", 
          "humidity", 
          "pressure", 
          "visibility",
          // Other parameters
          "currentSpeed", 
          "currentDirection", 
          "iceCover", 
          "snowDepth", 
          "seaLevel", 
          "snowAlbedo", 
          "seaIceThickness", 
          "dewPointTemperature"
        ].join(",")

        const marineResponse = await fetch(
          `https://api.stormglass.io/v2/weather/point?lat=${location.lat}&lng=${location.lon}&params=${params}`,
          {
            headers: {
              Authorization: `${apiKeys.stormGlass}`,
            },
          },
        )

        if (!marineResponse.ok) {
          const errorData = await marineResponse.json().catch(() => ({}))
          console.error("StormGlass API error:", errorData)
          throw new Error(`Failed to fetch marine data: ${marineResponse.status} ${marineResponse.statusText}`)
        }

        const data = await marineResponse.json()
        console.log("StormGlass API response:", data)

        // Add location metadata to help prevent duplicate fetches
        data._meta = {
          lat: location.lat,
          lng: location.lon,
        }

        if (!isCancelled) {
          setMarineData(data)
        }
      } catch (error) {
        console.error("Error fetching marine data:", error)
        if (!isCancelled) {
          toast({
            title: "Error",
            description: "Failed to fetch marine data. Please check your API key.",
            variant: "destructive",
          })
        }
      } finally {
        if (!isCancelled) {
          setMarineLoading(false)
        }
      }
    }

    fetchMarineData()

    return () => {
      isCancelled = true
    }
  }, [location.lat, location.lon, apiKeys.stormGlass, toast, marineData])

  // Update the handleCitySelect function to be more robust
  const handleCitySelect = (selectedCity) => {
    if (selectedCity && selectedCity.lat && selectedCity.lon) {
      // Only update URL if the location is different
      if (selectedCity.lat !== location.lat || selectedCity.lon !== location.lon) {
        // Use replace instead of push to avoid adding to history stack
        router.replace(`?lat=${selectedCity.lat}&lon=${selectedCity.lon}`)
      }
    }
  }

  const handleSaveApiKeys = (keys) => {
    setApiKeys(keys)
    localStorage.setItem("openWeatherMapApiKey", keys.openWeatherMap)
    localStorage.setItem("stormGlassApiKey", keys.stormGlass)
    setShowSettings(false)

    toast({
      title: "API Keys Saved",
      description: "Your API keys have been saved to local storage.",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white dark:bg-card elevation-1">
        <div className="container flex items-center justify-between h-16 px-4 md:px-6">
          <div className="flex items-center gap-2">
            <CloudRain className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">Mariner Console</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full" 
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="h-5 w-5 text-muted-foreground" />
              <span className="sr-only">Settings</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-4 py-6 md:px-6 md:py-8">
        {showSettings ? (
          <Card className="elevation-2">
            <CardHeader className="bg-muted/50">
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                API Settings
              </CardTitle>
              <CardDescription>Enter your API keys for OpenWeatherMap and StormGlass.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <APIKeyForm initialKeys={apiKeys} onSave={handleSaveApiKeys} />
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
              <div className="col-span-full">
                <CitySearch onCitySelect={handleCitySelect} apiKey={apiKeys.openWeatherMap} />
              </div>

              {loading ? (
                <div className="col-span-full flex justify-center items-center h-40">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Loading weather data...</p>
                  </div>
                </div>
              ) : !apiKeys.openWeatherMap ? (
                <div className="col-span-full">
                  <Card className="elevation-2">
                    <CardHeader className="bg-muted/50">
                      <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-destructive" />
                        API Key Required
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <p>Please add your OpenWeatherMap API key in settings to view weather data.</p>
                      <Button onClick={() => setShowSettings(true)} className="mt-4">
                        Open Settings
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ) : weatherData ? (
                <>
                  <CurrentWeather data={weatherData} />
                  <ForecastWeather data={forecastData} />
                </>
              ) : (
                <div className="col-span-full">
                  <Card className="elevation-2">
                    <CardHeader className="bg-muted/50">
                      <CardTitle>No Weather Data</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <p>Unable to load weather data. Please check your API key or try a different location.</p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center gap-2">
                <Waves className="h-6 w-6 text-primary" />
                Marine Weather
              </h2>

              {!apiKeys.stormGlass ? (
                <Card className="elevation-2">
                  <CardHeader className="bg-muted/50">
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-destructive" />
                      API Key Required
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p>Please add your StormGlass API key in settings to view marine weather data.</p>
                    <Button onClick={() => setShowSettings(true)} className="mt-4">
                      Open Settings
                    </Button>
                  </CardContent>
                </Card>
              ) : marineLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Loading marine weather data...</p>
                  </div>
                </div>
              ) : marineData ? (
                <Tabs defaultValue="weather" className="w-full">
                  <TabsList className="grid grid-cols-2 md:grid-cols-7 mb-6 bg-muted/50">
                    <TabsTrigger value="weather" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Weather</TabsTrigger>
                    <TabsTrigger value="bio" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Bio</TabsTrigger>
                    <TabsTrigger value="tide" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Tide</TabsTrigger>
                    <TabsTrigger value="astronomy" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Astronomy</TabsTrigger>
                    <TabsTrigger value="solar" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Solar</TabsTrigger>
                    <TabsTrigger value="elevation" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Elevation</TabsTrigger>
                    <TabsTrigger value="historical" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Historical</TabsTrigger>
                  </TabsList>

                  <TabsContent value="weather">
                    <MarineWeather data={marineData} type="weather" />
                  </TabsContent>
                  <TabsContent value="bio">
                    <MarineWeather data={marineData} type="bio" />
                  </TabsContent>
                  <TabsContent value="tide">
                    <MarineWeather data={marineData} type="tide" />
                  </TabsContent>
                  <TabsContent value="astronomy">
                    <MarineWeather data={marineData} type="astronomy" />
                  </TabsContent>
                  <TabsContent value="solar">
                    <MarineWeather data={marineData} type="solar" />
                  </TabsContent>
                  <TabsContent value="elevation">
                    <MarineWeather data={marineData} type="elevation" />
                  </TabsContent>
                  <TabsContent value="historical">
                    <MarineWeather data={marineData} type="historical" />
                  </TabsContent>
                </Tabs>
              ) : (
                <Card className="elevation-2">
                  <CardHeader className="bg-muted/50">
                    <CardTitle>No Marine Data</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p>Unable to load marine weather data. Please check your API key or try a different location.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        )}
      </main>

      <footer className="border-t py-4 bg-muted/30">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Mariner Console &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  )
}

