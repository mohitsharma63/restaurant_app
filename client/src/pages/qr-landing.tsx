import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { generateQrCodeUrl } from "@/lib/qr-generator";
import { Download, QrCode, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function QrLanding() {
  const [, setLocation] = useLocation();
  const [restaurantName, setRestaurantName] = useState("Delicious Bistro");
  const [tableNumber, setTableNumber] = useState(5);
  const [generatedQr, setGeneratedQr] = useState<string | null>(null);
  const { toast } = useToast();

  // Get first restaurant for demo
  const { data: restaurants } = useQuery({
    queryKey: ['/api/restaurants'],
  });

  const restaurant = restaurants?.[0];

  const generateQrMutation = useMutation({
    mutationFn: async () => {
      if (!restaurant) throw new Error("No restaurant available");
      
      const qrData = {
        restaurantId: restaurant.id,
        tableNumber: tableNumber,
        qrData: `/menu/${restaurant.id}/${tableNumber}`,
        isActive: true
      };

      await apiRequest("POST", "/api/qr-codes", qrData);
      return generateQrCodeUrl(`${window.location.origin}/menu/${restaurant.id}/${tableNumber}`);
    },
    onSuccess: (qrUrl) => {
      setGeneratedQr(qrUrl);
      toast({
        title: "QR Code Generated",
        description: `QR code for ${restaurantName} - Table ${tableNumber} has been created.`
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate QR code. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleGenerateQr = () => {
    generateQrMutation.mutate();
  };

  const handleDownloadQr = () => {
    if (generatedQr) {
      const link = document.createElement('a');
      link.href = generatedQr;
      link.download = `qr-code-table-${tableNumber}.png`;
      link.click();
    }
  };

  const handleSimulateScan = () => {
    if (restaurant) {
      // Always go to welcome page first for QR authentication
      setLocation(`/welcome/${restaurant.id}/${tableNumber}`);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-card rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-center mb-6" data-testid="heading-qr-generator">
            QR Code Generator
          </h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="restaurant-name" className="block text-sm font-medium mb-2">
                Restaurant Name
              </Label>
              <Input
                id="restaurant-name"
                data-testid="input-restaurant-name"
                type="text"
                placeholder="Enter restaurant name"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="table-number" className="block text-sm font-medium mb-2">
                Table Number
              </Label>
              <Input
                id="table-number"
                data-testid="input-table-number"
                type="number"
                placeholder="Table #"
                value={tableNumber}
                onChange={(e) => setTableNumber(parseInt(e.target.value) || 1)}
                className="w-full"
              />
            </div>
            <Button 
              onClick={handleGenerateQr}
              disabled={generateQrMutation.isPending}
              data-testid="button-generate-qr"
              className="w-full"
            >
              {generateQrMutation.isPending ? "Generating..." : "Generate QR Code"}
            </Button>
          </div>
          
          {generatedQr && (
            <div className="mt-6 text-center">
              <div className="w-48 h-48 mx-auto bg-muted rounded-lg flex items-center justify-center mb-4">
                <img 
                  src={generatedQr} 
                  alt="Generated QR Code" 
                  className="w-40 h-40"
                  data-testid="img-generated-qr"
                />
              </div>
              <p className="text-sm text-muted-foreground" data-testid="text-qr-description">
                Table {tableNumber} - {restaurantName}
              </p>
              <Button
                onClick={handleDownloadQr}
                variant="secondary"
                size="sm"
                className="mt-3"
                data-testid="button-download-qr"
              >
                <Download className="w-4 h-4 mr-2" />
                Download QR Code
              </Button>
            </div>
          )}
        </div>

        <div className="max-w-md mx-auto bg-card rounded-lg shadow-lg p-6">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-6" data-testid="heading-customer-experience">
            Customer Experience
          </h2>
          <div className="qr-scanner-frame aspect-square bg-muted mb-4 relative">
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <QrCode className="w-12 h-12 md:w-16 md:h-16 text-primary mb-4 mx-auto animate-pulse" />
                <p className="text-xs md:text-sm text-muted-foreground px-4" data-testid="text-scan-instruction">
                  Point your phone's camera at the QR code on your table
                </p>
              </div>
            </div>
            {/* Scanning overlay for mobile */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="w-full h-full border-2 border-dashed border-primary/30 rounded-lg animate-pulse"></div>
            </div>
          </div>
          <div className="space-y-3">
            <Button 
              onClick={handleSimulateScan}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 text-base font-semibold shadow-lg"
              data-testid="button-simulate-scan"
            >
              <Camera className="w-5 h-5 mr-2" />
              Open Mobile Menu
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Click above to simulate scanning Table {tableNumber} QR code
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
