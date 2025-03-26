"use client"

import type React from "react"

import { useState } from "react"
import { ExternalLink, KeyRound, CloudRain, Waves } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface APIKeyFormProps {
  initialKeys: {
    openWeatherMap: string
    stormGlass: string
  }
  onSave: (keys: { openWeatherMap: string; stormGlass: string }) => void
}

export function APIKeyForm({ initialKeys, onSave }: APIKeyFormProps) {
  const [keys, setKeys] = useState(initialKeys)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setKeys((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(keys)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Alert className="bg-muted/50 border-primary/30">
        <AlertDescription className="text-sm text-muted-foreground">
          Your API keys are stored only in your browser&apos;s local storage and are never sent to our servers.
        </AlertDescription>
      </Alert>

      <div className="space-y-6">
        <Card className="elevation-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4 text-primary">
              <CloudRain className="h-4 w-4" />
              <h3 className="font-medium">OpenWeatherMap API</h3>
            </div>
            <div className="space-y-3">
              <Label htmlFor="openWeatherMap" className="text-sm text-muted-foreground">API Key</Label>
              <Input
                id="openWeatherMap"
                name="openWeatherMap"
                value={keys.openWeatherMap}
                onChange={handleChange}
                placeholder="Enter your OpenWeatherMap API key"
                className="border-input/50 focus:border-primary"
              />
              <div className="pt-1">
                <a
                  href="https://home.openweathermap.org/api_keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  Get your OpenWeatherMap API key
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="elevation-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4 text-primary">
              <Waves className="h-4 w-4" />
              <h3 className="font-medium">StormGlass API</h3>
            </div>
            <div className="space-y-3">
              <Label htmlFor="stormGlass" className="text-sm text-muted-foreground">API Key</Label>
              <Input
                id="stormGlass"
                name="stormGlass"
                value={keys.stormGlass}
                onChange={handleChange}
                placeholder="Enter your StormGlass API key"
                className="border-input/50 focus:border-primary"
              />
              <div className="pt-1">
                <a
                  href="https://dashboard.stormglass.io/register"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  Get your StormGlass API key
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6" />

      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
        <KeyRound className="h-4 w-4 mr-2" />
        Save API Keys
      </Button>
    </form>
  )
}

