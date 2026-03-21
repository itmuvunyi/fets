"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Camera, X, Scan, Loader2 } from "lucide-react"
import { searchByBarcode } from "@/app/actions/food"

interface BarcodeScannerProps {
  onBarcodeDetected: (barcode: string) => void
  onClose: () => void
}

export function BarcodeScanner({ onBarcodeDetected, onClose }: BarcodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [manualBarcode, setManualBarcode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const startCamera = async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Use back camera if available
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsScanning(true)
      }
    } catch (err) {
      setError("Camera access denied or not available. Please enter barcode manually.")
      console.error("Camera error:", err)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setIsScanning(false)
  }

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (manualBarcode.trim()) {
      handleLookup(manualBarcode.trim())
    }
  }

  const handleLookup = async (barcode: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const product = await searchByBarcode(barcode)
      if (product) {
        onBarcodeDetected(barcode) // The parent expects just the barcode to trigger the form population
      } else {
        setError("Product not found. Please try manual entry.")
      }
    } catch (err) {
      setError("Failed to fetch product data.")
    } finally {
      setIsLoading(false)
    }
  }

  // Simulate barcode detection (for demo/dev purposes)
  const simulateBarcodeScan = () => {
    const demoBarcode = "5449000000996" // Coca Cola
    handleLookup(demoBarcode)
  }

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Scan className="w-5 h-5" />
              Barcode Scanner
            </CardTitle>
            <CardDescription>Scan or enter a barcode to quickly add food items</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Camera Scanner */}
        <div className="space-y-3">
          <Label>Camera Scanner</Label>
          {!isScanning ? (
            <div className="text-center space-y-3">
              <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
                <Camera className="w-12 h-12 text-muted-foreground" />
              </div>
              <Button onClick={startCamera} className="w-full">
                <Camera className="w-4 h-4 mr-2" />
                Start Camera
              </Button>
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
          ) : (
            <div className="space-y-3">
              <video ref={videoRef} autoPlay playsInline className="w-full h-48 bg-black rounded-lg object-cover" />
              <div className="flex gap-2">
                <Button onClick={simulateBarcodeScan} className="flex-1">
                  Simulate Scan
                </Button>
                <Button variant="outline" onClick={stopCamera} className="btn-cancel-red">
                  Stop Camera
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Point camera at barcode or click "Simulate Scan" for demo
              </p>
            </div>
          )}
        </div>

        {/* Manual Entry */}
        <div className="border-t pt-4">
          <form onSubmit={handleManualSubmit} className="space-y-3">
            <Label htmlFor="manual-barcode">Manual Entry</Label>
            <div className="flex gap-2">
              <Input
                id="manual-barcode"
                placeholder="Enter barcode number"
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value)}
              />
              <Button type="submit" disabled={!manualBarcode.trim() || isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Lookup"}
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
