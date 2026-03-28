"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Camera, Scan, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"

interface BarcodeScannerProps {
  onBarcodeDetected: (barcode: string) => void
  onClose: () => void
}

type ScannerState = "idle" | "requesting" | "scanning" | "error"

export function BarcodeScanner({ onBarcodeDetected }: BarcodeScannerProps) {
  const [state, setState] = useState<ScannerState>("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [manualBarcode, setManualBarcode] = useState("")
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [hasBarcodeDetector, setHasBarcodeDetector] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number | null>(null)
  const detectorRef = useRef<any>(null)

  // Check for BarcodeDetector support on mount
  useEffect(() => {
    if ("BarcodeDetector" in window) {
      setHasBarcodeDetector(true)
      // @ts-ignore
      detectorRef.current = new (window as any).BarcodeDetector({
        formats: ["ean_13", "ean_8", "qr_code", "code_128", "code_39", "upc_a", "upc_e"],
      })
    }
  }, [])

  // Attach stream to video element whenever scanning state activates
  useEffect(() => {
    if (state === "scanning" && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current
      videoRef.current.play().catch(console.error)
    }
  }, [state])

  const scanFrame = useCallback(async () => {
    if (!videoRef.current || !detectorRef.current || state !== "scanning") return

    if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      try {
        const barcodes = await detectorRef.current.detect(videoRef.current)
        if (barcodes.length > 0) {
          const code = barcodes[0].rawValue
          setSuccessMessage(`Detected: ${code}`)
          stopCamera()
          lookupBarcode(code)
          return
        }
      } catch (err) {
        // Ignore per-frame detection errors
      }
    }

    rafRef.current = requestAnimationFrame(scanFrame)
  }, [state]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (state === "scanning" && hasBarcodeDetector) {
      rafRef.current = requestAnimationFrame(scanFrame)
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [state, hasBarcodeDetector, scanFrame])

  const startCamera = async () => {
    setState("requesting")
    setErrorMessage(null)
    setSuccessMessage(null)

    if (!navigator.mediaDevices?.getUserMedia) {
      setErrorMessage("Camera API is not supported in this browser. Please use Chrome or Edge on a secure (HTTPS/localhost) origin.")
      setState("error")
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })
      streamRef.current = stream
      setState("scanning") // video useEffect will attach the stream
    } catch (err: any) {
      console.error("Camera access error:", err)
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setErrorMessage("Camera permission was denied. Please allow camera access in your browser settings and try again.")
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setErrorMessage("No camera device found on this device.")
      } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
        setErrorMessage("Camera is already in use by another application.")
      } else if (err.name === "OverconstrainedError") {
        // Try again without constraints
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true })
          streamRef.current = stream
          setState("scanning")
          return
        } catch {
          setErrorMessage("Could not access camera with the required constraints.")
        }
      } else {
        setErrorMessage(`Camera error: ${err.message || "Unknown error"}`)
      }
      setState("error")
    }
  }

  const stopCamera = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setState("idle")
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => stopCamera()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const lookupBarcode = async (barcode: string) => {
    if (!barcode) return
    onBarcodeDetected(barcode)
  }

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const code = manualBarcode.trim()
    if (!code) return
    lookupBarcode(code)
  }

  const isScanning = state === "scanning"
  const isRequesting = state === "requesting"

  return (
    <div className="w-full space-y-4 p-4">
      {/* Header */}
      <div className="flex items-center gap-2 text-sm font-medium">
        <Scan className="w-4 h-4" />
        Barcode Scanner
      </div>

      {/* Camera View */}
      <div className="space-y-3">
        <div className="relative w-full rounded-lg overflow-hidden bg-zinc-900" style={{ height: "200px" }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{ display: isScanning ? "block" : "none" }}
          />
          {!isScanning && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-zinc-400">
              {isRequesting ? (
                <>
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <p className="text-xs">Requesting camera access…</p>
                </>
              ) : (
                <>
                  <Camera className="w-10 h-10" />
                  <p className="text-xs">Camera preview will appear here</p>
                </>
              )}
            </div>
          )}
          {isScanning && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-32 border-2 border-secondary rounded-md opacity-70" />
            </div>
          )}
        </div>

        {/* Status messages */}
        {successMessage && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle2 className="w-4 h-4" />
            {successMessage}
          </div>
        )}
        {(state === "error" || errorMessage) && errorMessage && (
          <div className="flex items-start gap-2 text-sm text-red-600">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
        {isScanning && !hasBarcodeDetector && (
          <p className="text-xs text-amber-600 text-center">
            Auto-detection not supported in this browser. Use manual entry below.
          </p>
        )}
        {isScanning && hasBarcodeDetector && (
          <p className="text-xs text-zinc-400 text-center">
            Point camera at a barcode — detecting automatically…
          </p>
        )}

        {/* Camera controls */}
        <div className="flex gap-2">
          {!isScanning ? (
            <Button
              onClick={startCamera}
              disabled={isRequesting}
              className="w-full"
              variant="secondary"
            >
              {isRequesting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Camera className="w-4 h-4 mr-2" />
              )}
              {isRequesting ? "Starting…" : "Open Camera"}
            </Button>
          ) : (
            <Button onClick={stopCamera} variant="outline" className="w-full btn-cancel-red">
              Stop Camera
            </Button>
          )}
        </div>
      </div>

      {/* Manual Entry — Under camera controls */}
      <div className="border-t pt-4">
        <form onSubmit={handleManualSubmit} className="space-y-3">
          <Label htmlFor="manual-barcode">Lookup Manually</Label>
          <div className="flex gap-2">
            <Input
              id="manual-barcode"
              placeholder="e.g., 3017620425035"
              value={manualBarcode}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setManualBarcode(e.target.value)}
              type="text"
              inputMode="numeric"
            />
            <Button type="submit" disabled={!manualBarcode.trim()} variant="secondary">
              Lookup
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

