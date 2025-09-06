import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Square } from 'lucide-react';

interface QRScannerProps {
  onResult: (result: string) => void;
}

export function QRScanner({ onResult }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startScanning = async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsScanning(true);
      }
    } catch (err) {
      setError('Camera access denied or not available');
      console.error('Error accessing camera:', err);
    }
  };

  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const simulateQRScan = () => {
    // For demo purposes, simulate a QR scan
    const mockQRCode = `table_demo_${Date.now()}`;
    onResult(mockQRCode);
  };

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-destructive text-sm mb-4">{error}</p>
        <Button onClick={simulateQRScan} data-testid="button-simulate-scan">
          Simulate QR Scan (Demo)
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isScanning ? (
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-48 object-cover rounded-lg bg-background"
            data-testid="video-scanner"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Square className="w-24 h-24 text-primary border-2 border-primary opacity-50" />
          </div>
          <div className="flex space-x-2 mt-4">
            <Button onClick={stopScanning} variant="outline" data-testid="button-stop-scan">
              Stop Scanner
            </Button>
            <Button onClick={simulateQRScan} data-testid="button-demo-scan">
              Demo Scan
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className="aspect-square bg-background/20 rounded-lg flex items-center justify-center mb-4">
            <Camera className="w-16 h-16 text-muted-foreground" />
          </div>
          <Button onClick={startScanning} data-testid="button-start-scan">
            Start QR Scanner
          </Button>
        </div>
      )}
    </div>
  );
}
