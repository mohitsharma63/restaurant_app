
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Shield, ArrowLeft } from "lucide-react";

export default function UnauthorizedAccess() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-white/95 backdrop-blur-xl shadow-2xl border-0 rounded-3xl overflow-hidden">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-red-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Restricted
          </h1>
          
          <p className="text-gray-600 mb-6">
            Please scan the QR code on your table to access the digital menu.
          </p>
          
          <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <QrCode className="w-8 h-8 text-orange-600" />
          </div>
          
          <p className="text-sm text-gray-500 mb-8">
            QR codes are located on each table for secure access
          </p>
          
          <Button
            onClick={() => setLocation('/')}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 rounded-2xl font-semibold"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to QR Scanner
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
