"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Moon, Sun, Monitor } from "lucide-react"

export default function ThemeSettingsPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast()

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSaveTheme = () => {
    toast({
      title: "Theme settings saved",
      description: `Your theme preference has been set to ${theme}`,
    })
  }

  if (!mounted) {
    return null
  }

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold">Theme Settings</h1>
      <Tabs defaultValue="appearance" className="mt-6">
        <TabsList>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>
        <TabsContent value="appearance" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme Preferences</CardTitle>
              <CardDescription>Customize the appearance of the dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Select Theme</Label>
                <RadioGroup
                  defaultValue={theme}
                  onValueChange={(value) => setTheme(value)}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <div>
                    <RadioGroupItem value="light" id="theme-light" className="peer sr-only" aria-label="Light theme" />
                    <Label
                      htmlFor="theme-light"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <Sun className="mb-3 h-6 w-6" />
                      <span className="text-sm font-medium">Light</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="dark" id="theme-dark" className="peer sr-only" aria-label="Dark theme" />
                    <Label
                      htmlFor="theme-dark"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <Moon className="mb-3 h-6 w-6" />
                      <span className="text-sm font-medium">Dark</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value="system"
                      id="theme-system"
                      className="peer sr-only"
                      aria-label="System theme"
                    />
                    <Label
                      htmlFor="theme-system"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <Monitor className="mb-3 h-6 w-6" />
                      <span className="text-sm font-medium">System</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="pt-4">
                <Button onClick={handleSaveTheme}>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Theme Preview</CardTitle>
              <CardDescription>See how different components look in the current theme</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Buttons</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="default">Default</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="destructive">Destructive</Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Cards</h3>
                  <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
                    <h4 className="text-sm font-semibold">Card Title</h4>
                    <p className="text-xs text-muted-foreground">Card description text</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Text Colors</h3>
                <div className="space-y-1">
                  <p className="text-foreground">Default text</p>
                  <p className="text-muted-foreground">Muted text</p>
                  <p className="text-primary">Primary text</p>
                  <p className="text-destructive">Destructive text</p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Background Colors</h3>
                <div className="flex flex-wrap gap-2">
                  <div className="h-10 w-10 rounded-md bg-background border"></div>
                  <div className="h-10 w-10 rounded-md bg-muted"></div>
                  <div className="h-10 w-10 rounded-md bg-primary"></div>
                  <div className="h-10 w-10 rounded-md bg-secondary"></div>
                  <div className="h-10 w-10 rounded-md bg-accent"></div>
                  <div className="h-10 w-10 rounded-md bg-destructive"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}
