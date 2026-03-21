import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, AlertCircle } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f3f4f6] px-4 text-center">
      <div className="p-8 bg-white rounded-[2.5rem] shadow-[20px_20px_60px_#cecece,-20px_-20px_60px_#ffffff] max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-amber-100 rounded-full text-amber-600">
            <AlertCircle size={48} />
          </div>
        </div>
        
        <h1 className="text-6xl font-black text-gray-900 mb-2">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h2>
        
        <p className="text-gray-500 mb-8 leading-relaxed">
          Oops! The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track.
        </p>
        
        <Link href="/" passHref>
          <Button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-6 rounded-2xl text-lg font-bold transition-all shadow-lg hover:shadow-amber-200">
            <Home className="mr-2 h-5 w-5" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
