import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrCode, Camera, Settings, User } from "lucide-react";
import { QRScanner } from "@/components/qr-scanner";

export default function HomePage() {
  const [, setLocation] = useLocation();
  const [showScanner, setShowScanner] = useState(false);
  const [tableNumber, setTableNumber] = useState("");

  const handleScanResult = (qrCode: string) => {
    setLocation(`/menu/${qrCode}`);
  };

  const handleManualEntry = () => {
    if (tableNumber) {
      // For demo, create a simple QR code string
      const qrCode = `table_${tableNumber}`;
      setLocation(`/menu/${qrCode}`);
    }
  };

  return (
    <>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-serif font-semibold text-primary">TableOrder Pro</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setLocation('/admin')}
                data-testid="button-admin"
              >
                <Settings className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setLocation('/auth')}
                data-testid="button-auth"
              >
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        <section className="min-h-screen gradient-bg flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center fade-in">
            <Card>
              <CardContent className="p-8">
                <div className="mb-6">
                  <QrCode className="w-16 h-16 text-primary mb-4 mx-auto" />
                  <h2 className="text-2xl font-serif font-semibold text-card-foreground mb-2">
                    Welcome to Fine Dining
                  </h2>
                  <p className="text-muted-foreground">
                    Scan the QR code on your table to begin your culinary journey
                  </p>
                </div>

                {/* QR Scanner */}
                <div className="bg-muted rounded-xl p-6 mb-6">
                  {showScanner ? (
                    <QRScanner onResult={handleScanResult} />
                  ) : (
                    <div className="aspect-square bg-background/20 rounded-lg flex items-center justify-center mb-4">
                      <Camera className="w-16 h-16 text-muted-foreground" />
                    </div>
                  )}
                  <Button 
                    onClick={() => setShowScanner(!showScanner)}
                    variant="outline"
                    className="w-full"
                    data-testid="button-toggle-scanner"
                  >
                    {showScanner ? "Hide Scanner" : "Start QR Scanner"}
                  </Button>
                </div>

                {/* Manual Table Entry */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-card-foreground mb-2">
                      Or enter table number manually:
                    </Label>
                    <Input
                      type="number"
                      placeholder="Table #"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      data-testid="input-table-number"
                    />
                  </div>
                  <Button
                    onClick={handleManualEntry}
                    className="w-full"
                    disabled={!tableNumber}
                    data-testid="button-enter-restaurant"
                  >
                    Enter Restaurant
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </>
  );
}
