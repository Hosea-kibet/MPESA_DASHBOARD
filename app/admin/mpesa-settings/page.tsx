"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function MpesaSettingsPage() {
  // Get the base URL for the callback
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  const callbackUrl = `${baseUrl}/api/mpesa/callback`

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">M-Pesa Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Callback URL Configuration</CardTitle>
          <CardDescription>Configure your M-Pesa callback URL to receive payment notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Important</AlertTitle>
            <AlertDescription>
              M-Pesa requires a publicly accessible HTTPS URL to send payment notifications. During development, you can
              use a service like ngrok to expose your local server.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <h3 className="font-medium">Your Callback URL</h3>
            <div className="flex gap-2">
              <Input value={callbackUrl} readOnly />
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(callbackUrl)
                }}
                variant="outline"
              >
                Copy
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Use this URL in your M-Pesa API configuration and in your .env file.
            </p>
          </div>

          <div className="space-y-2 pt-4">
            <h3 className="font-medium">Testing Your Callback</h3>
            <p className="text-sm">
              You can test if your callback URL is accessible by visiting it in your browser. It should return a success
              message if it&apos;s properly configured.
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  window.open(callbackUrl, "_blank")
                }}
                variant="outline"
              >
                Test Callback URL
              </Button>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t">
            <h3 className="font-medium pt-4">Using ngrok for Development</h3>
            <p className="text-sm">To expose your local development server to the internet, you can use ngrok:</p>
            <div className="bg-muted p-3 rounded-md text-sm font-mono">
              <p>
                1. Install ngrok: <span className="text-green-600">npm install -g ngrok</span>
              </p>
              <p>
                2. Start your Next.js app: <span className="text-green-600">npm run dev</span>
              </p>
              <p>
                3. In a new terminal, run: <span className="text-green-600">ngrok http 3000</span>
              </p>
              <p>4. Copy the https URL provided by ngrok</p>
              <p>
                5. Use that URL + <span className="text-green-600">/api/mpesa/callback</span> as your callback URL
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>M-Pesa API Configuration</CardTitle>
          <CardDescription>Your current M-Pesa API configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Environment Variables</h3>
              <p className="text-sm text-muted-foreground">
                Make sure these environment variables are set in your .env file and on your hosting platform.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">MPESA_CONSUMER_KEY</p>
                <p className="text-sm text-muted-foreground">Your M-Pesa API consumer key</p>
              </div>
              <div>
                <p className="text-sm font-medium">MPESA_CONSUMER_SECRET</p>
                <p className="text-sm text-muted-foreground">Your M-Pesa API consumer secret</p>
              </div>
              <div>
                <p className="text-sm font-medium">MPESA_PASSKEY</p>
                <p className="text-sm text-muted-foreground">Your M-Pesa API passkey</p>
              </div>
              <div>
                <p className="text-sm font-medium">MPESA_SHORTCODE</p>
                <p className="text-sm text-muted-foreground">Your M-Pesa business shortcode</p>
              </div>
              <div>
                <p className="text-sm font-medium">MPESA_CALLBACK_URL</p>
                <p className="text-sm text-muted-foreground">The URL where M-Pesa will send payment notifications</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
