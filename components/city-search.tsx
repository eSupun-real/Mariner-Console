"use client"

import { useState, useEffect, useRef } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface City {
  name: string
  lat: number
  lon: number
  country: string
  state?: string
}

interface CitySearchProps {
  onCitySelect: (city: City) => void
  apiKey: string
}

export function CitySearch({ onCitySelect, apiKey }: CitySearchProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(false)
  const searchTimeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Skip if no search query or API key
    if (!searchQuery.trim() || !apiKey) {
      setCities([])
      setLoading(false)
      return
    }

    // Clear previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current)
    }

    // Set a new timeout to debounce the search
    searchTimeout.current = setTimeout(async () => {
      setLoading(true)

      try {
        const response = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${searchQuery}&limit=5&appid=${apiKey}`,
        )

        if (!response.ok) throw new Error("Failed to fetch cities")

        const data = await response.json()
        setCities(data)
      } catch (error) {
        console.error("Error fetching cities:", error)
        setCities([])
      } finally {
        setLoading(false)
      }
    }, 500)

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current)
      }
    }
  }, [searchQuery, apiKey])

  const handleSelect = (city: City) => {
    onCitySelect(city)
    setOpen(false)
    setSearchQuery("")
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={!apiKey}
          >
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 shrink-0 opacity-50" />
              {searchQuery || "Search for a city..."}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-full" align="start">
          <Command>
            <CommandInput
              placeholder="Search for a city..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="h-9"
            />
            <CommandList>
              {loading && <CommandEmpty>Loading cities...</CommandEmpty>}
              {!loading && cities.length === 0 && <CommandEmpty>No cities found.</CommandEmpty>}
              <CommandGroup>
                {cities.map((city) => (
                  <CommandItem
                    key={`${city.name}-${city.lat}-${city.lon}`}
                    value={`${city.name}-${city.lat}-${city.lon}`}
                    onSelect={() => handleSelect(city)}
                  >
                    {city.name}
                    {city.state && `, ${city.state}`}
                    {city.country && `, ${city.country}`}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

