import { NextResponse } from "next/server"

// Simple in-memory cache for barcode lookups
const barcodeCache = new Map<string, any>()

export async function POST(req: Request) {
  try {
    const { barcode } = await req.json()

    // 1. Validate input
    if (!barcode || typeof barcode !== "string") {
      return NextResponse.json(
        { success: false, message: "Invalid or missing barcode" },
        { status: 400 }
      )
    }

    // 2. Check cache
    if (barcodeCache.has(barcode)) {
      console.log(`Cache hit for barcode: ${barcode}`)
      return NextResponse.json({ success: true, data: barcodeCache.get(barcode) })
    }

    // 3. Fetch from External API (OpenFoodFacts)
    const apiUrl = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
    const response = await fetch(apiUrl, {
      headers: {
        "User-Agent": "FETS - Food Expiry Tracker System - Web App",
      },
    })

    if (!response.ok) {
      throw new Error(`External API returned status: ${response.status}`)
    }

    const data = await response.json()

    // 4. Handle "Product not found"
    if (data.status === 0 || !data.product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      )
    }

    const p = data.product

    // 5. Extract and normalize fields
    const productData = {
      name: p.product_name || p.generic_name || "Unknown Product",
      brand: p.brands || "",
      category: p.categories_tags?.[0]?.replace("en:", "") || "other",
      image: p.image_front_url || p.image_url || p.image_front_small_url || null,
    }

    // 6. Save to cache (limit size to prevent memory issues)
    if (barcodeCache.size > 1000) {
      const firstKey = barcodeCache.keys().next().value
      if (firstKey) barcodeCache.delete(firstKey)
    }
    barcodeCache.set(barcode, productData)

    // 7. Return standardized response
    return NextResponse.json({
      success: true,
      data: productData,
    })
  } catch (error) {
    console.error("Barcode API Error:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error during barcode lookup" },
      { status: 500 }
    )
  }
}
