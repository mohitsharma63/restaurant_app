import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { generateQRCode } from "@/lib/qr-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Table } from "@shared/schema";

export default function QRGenerator() {
  const [tableNumber, setTableNumber] = useState("");
  const [section, setSection] = useState("");
  const [restaurantName] = useState("Bella Vista Restaurant");
  const [baseUrl] = useState("https://menu.bellavista.com");
  const [generatedQR, setGeneratedQR] = useState<string | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tables = [], isLoading } = useQuery<Table[]>({
    queryKey: ["/api/restaurants/default/tables"],
    retry: false,
  });

  const createTableMutation = useMutation({
    mutationFn: async (tableData: any) => {
      const response = await apiRequest("POST", "/api/restaurants/default/tables", tableData);
      return response.json();
    },
    onSuccess: (newTable) => {
      queryClient.invalidateQueries({ queryKey: ["/api/restaurants/default/tables"] });
      toast({
        title: "QR Code Generated",
        description: `QR code created for Table ${newTable.tableNumber}`,
      });
      
      // Generate QR code image
      generateQRCode(newTable.qrCodeUrl || newTable.qrCodeUrl).then(setGeneratedQR);
      
      // Reset form
      setTableNumber("");
      setSection("");
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate QR code.",
        variant: "destructive",
      });
    },
  });

  const handleGenerateQR = async () => {
    if (!tableNumber.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a table number.",
        variant: "destructive",
      });
      return;
    }

    if (!section.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a section.",
        variant: "destructive",
      });
      return;
    }

    createTableMutation.mutate({
      tableNumber: tableNumber.trim(),
      section: section.trim(),
    });
  };

  const handleDownloadQR = () => {
    if (!generatedQR) return;
    
    const link = document.createElement('a');
    link.download = `table-${tableNumber}-qr.png`;
    link.href = generatedQR;
    link.click();
  };

  return (
    <div className="pt-16">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold font-serif mb-2" data-testid="text-qr-generator-title">
            QR Code Generator
          </h1>
          <p className="text-muted-foreground">Generate QR codes for your restaurant tables</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Generator Form */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Generate New QR Code</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="restaurantName">Restaurant Name</Label>
                  <Input
                    id="restaurantName"
                    type="text"
                    value={restaurantName}
                    disabled
                    className="bg-muted"
                    data-testid="input-restaurant-name"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tableNumber">Table Number</Label>
                    <Input
                      id="tableNumber"
                      type="text"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      placeholder="12"
                      data-testid="input-table-number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="section">Section</Label>
                    <Select value={section} onValueChange={setSection}>
                      <SelectTrigger data-testid="select-section">
                        <SelectValue placeholder="Select section" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Section A">Section A</SelectItem>
                        <SelectItem value="Section B">Section B</SelectItem>
                        <SelectItem value="Section C">Section C</SelectItem>
                        <SelectItem value="Outdoor">Outdoor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="baseUrl">Base URL</Label>
                  <Input
                    id="baseUrl"
                    type="url"
                    value={baseUrl}
                    disabled
                    className="bg-muted"
                    data-testid="input-base-url"
                  />
                </div>
                
                <Button
                  onClick={handleGenerateQR}
                  disabled={createTableMutation.isPending}
                  className="w-full"
                  data-testid="button-generate-qr"
                >
                  {createTableMutation.isPending ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Generating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-qrcode mr-2"></i>
                      Generate QR Code
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Usage Instructions */}
            <div className="bg-muted rounded-lg p-6">
              <h3 className="font-semibold mb-3">How to Use QR Codes</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start">
                  <i className="fas fa-print mt-0.5 mr-3 text-primary"></i>
                  <span>Print the generated QR code and place it on each table</span>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-mobile-alt mt-0.5 mr-3 text-primary"></i>
                  <span>Customers scan the code with their phone camera</span>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-utensils mt-0.5 mr-3 text-primary"></i>
                  <span>They'll be directed to your digital menu automatically</span>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-shopping-cart mt-0.5 mr-3 text-primary"></i>
                  <span>Orders are sent directly to your restaurant dashboard</span>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code Preview and Existing Codes */}
          <div className="space-y-6">
            {/* Generated QR Code Display */}
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <h3 className="font-semibold mb-4">Generated QR Code</h3>
              
              <div className="bg-white p-8 rounded-lg shadow-inner mb-4 mx-auto w-64 h-64 flex items-center justify-center border-2 border-dashed border-border">
                {generatedQR ? (
                  <img 
                    src={generatedQR} 
                    alt="Generated QR Code" 
                    className="max-w-full max-h-full"
                    data-testid="img-generated-qr"
                  />
                ) : (
                  <div className="text-center">
                    <i className="fas fa-qrcode text-4xl text-muted-foreground mb-2"></i>
                    <p className="text-sm text-muted-foreground">Generate a QR code to preview</p>
                  </div>
                )}
              </div>
              
              {generatedQR && (
                <>
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <p data-testid="text-generated-table-info">
                      <strong>Table:</strong> {tableNumber} ({section})
                    </p>
                    <p data-testid="text-generated-url">
                      <strong>URL:</strong> {baseUrl}/table/{tableNumber}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleDownloadQR}
                      variant="secondary"
                      className="flex-1"
                      data-testid="button-download-qr"
                    >
                      <i className="fas fa-download mr-2"></i>Download PNG
                    </Button>
                    <Button
                      onClick={() => window.print()}
                      variant="outline"
                      className="flex-1"
                      data-testid="button-print-qr"
                    >
                      <i className="fas fa-print mr-2"></i>Print
                    </Button>
                  </div>
                </>
              )}
            </div>

            {/* Existing QR Codes */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold mb-4">Existing QR Codes</h3>
              
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="animate-pulse flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-border rounded mr-3"></div>
                        <div>
                          <div className="h-4 bg-border rounded w-24 mb-1"></div>
                          <div className="h-3 bg-border rounded w-16"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : tables.length === 0 ? (
                <p className="text-center text-muted-foreground py-4" data-testid="text-no-tables">
                  No QR codes generated yet. Create your first one above!
                </p>
              ) : (
                <div className="space-y-3">
                  {tables.map((table) => (
                    <div key={table.id} className="flex items-center justify-between p-3 bg-muted rounded-lg" data-testid={`existing-table-${table.id}`}>
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-white rounded mr-3 flex items-center justify-center border">
                          <i className="fas fa-qrcode text-xl text-primary"></i>
                        </div>
                        <div>
                          <p className="font-medium" data-testid={`text-table-${table.id}`}>
                            Table {table.tableNumber} - {table.section}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Created {new Date(table.createdAt!).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          className="text-primary hover:text-primary/80"
                          data-testid={`button-download-${table.id}`}
                          onClick={() => {
                            if (table.qrCodeUrl) {
                              generateQRCode(table.qrCodeUrl).then(qrImage => {
                                const link = document.createElement('a');
                                link.download = `table-${table.tableNumber}-qr.png`;
                                link.href = qrImage;
                                link.click();
                              });
                            }
                          }}
                        >
                          <i className="fas fa-download"></i>
                        </button>
                        <button 
                          className="text-muted-foreground hover:text-foreground"
                          data-testid={`button-edit-${table.id}`}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* QR Code Examples Gallery */}
        <div className="mt-8">
          <h2 className="text-xl font-bold font-serif mb-6">QR Code Usage Examples</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <img 
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
              alt="QR code scanning" 
              className="rounded-lg shadow-sm w-full h-48 object-cover" 
            />
            <img 
              src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
              alt="QR menu stand" 
              className="rounded-lg shadow-sm w-full h-48 object-cover" 
            />
            <img 
              src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
              alt="Contactless ordering" 
              className="rounded-lg shadow-sm w-full h-48 object-cover" 
            />
            <img 
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
              alt="Table QR setup" 
              className="rounded-lg shadow-sm w-full h-48 object-cover" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
