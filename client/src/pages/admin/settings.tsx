
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Settings,
  Store,
  Users,
  Bell,
  Shield,
  Palette,
  Clock,
  DollarSign,
  Printer,
  Wifi,
  Save,
  Download,
  Upload,
  RefreshCw
} from "lucide-react";

// Static settings data
const restaurantSettings = {
  name: "Delicious Bistro",
  address: "123 Main Street, New York, NY 10001",
  phone: "+1 (555) 123-4567",
  email: "info@deliciousbistro.com",
  website: "www.deliciousbistro.com",
  description: "A cozy family restaurant serving fresh, local ingredients with a modern twist on classic dishes.",
  capacity: 80,
  tablesCount: 20,
  avgServiceTime: 25,
  operatingHours: {
    monday: { open: "11:00", close: "22:00", closed: false },
    tuesday: { open: "11:00", close: "22:00", closed: false },
    wednesday: { open: "11:00", close: "22:00", closed: false },
    thursday: { open: "11:00", close: "23:00", closed: false },
    friday: { open: "11:00", close: "23:00", closed: false },
    saturday: { open: "10:00", close: "23:00", closed: false },
    sunday: { open: "10:00", close: "21:00", closed: false }
  },
  currency: "USD",
  taxRate: 8.5,
  serviceCharge: 18,
  theme: "modern",
  language: "en"
};

const notificationSettings = {
  newOrders: true,
  statusUpdates: true,
  lowStock: true,
  dailyReports: true,
  customerFeedback: true,
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true
};

const systemSettings = {
  autoAcceptOrders: false,
  orderTimeout: 30,
  printReceipts: true,
  requirePayment: false,
  allowTakeaway: true,
  allowDineIn: true,
  maintenanceMode: false,
  debugMode: false
};

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("restaurant");
  const [settings, setSettings] = useState({
    restaurant: restaurantSettings,
    notifications: notificationSettings,
    system: systemSettings
  });

  const handleSave = (category: string) => {
    // Handle save logic here
    console.log(`Saving ${category} settings:`, settings[category as keyof typeof settings]);
  };

  const tabs = [
    { id: "restaurant", label: "Restaurant Info", icon: Store },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "system", label: "System", icon: Settings },
    { id: "users", label: "Users & Roles", icon: Users },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "billing", label: "Billing", icon: DollarSign }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Configure your restaurant management system</p>
        </div>
        <Button className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save All Changes
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <Card className="lg:w-64">
          <CardContent className="p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Restaurant Information */}
          {activeTab === "restaurant" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Store className="w-5 h-5" />
                    Restaurant Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Restaurant Name</Label>
                      <Input
                        id="name"
                        value={settings.restaurant.name}
                        onChange={(e) => setSettings({
                          ...settings,
                          restaurant: { ...settings.restaurant, name: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={settings.restaurant.phone}
                        onChange={(e) => setSettings({
                          ...settings,
                          restaurant: { ...settings.restaurant, phone: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={settings.restaurant.email}
                        onChange={(e) => setSettings({
                          ...settings,
                          restaurant: { ...settings.restaurant, email: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={settings.restaurant.website}
                        onChange={(e) => setSettings({
                          ...settings,
                          restaurant: { ...settings.restaurant, website: e.target.value }
                        })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={settings.restaurant.address}
                      onChange={(e) => setSettings({
                        ...settings,
                        restaurant: { ...settings.restaurant, address: e.target.value }
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      rows={3}
                      value={settings.restaurant.description}
                      onChange={(e) => setSettings({
                        ...settings,
                        restaurant: { ...settings.restaurant, description: e.target.value }
                      })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="capacity">Seating Capacity</Label>
                      <Input
                        id="capacity"
                        type="number"
                        value={settings.restaurant.capacity}
                        onChange={(e) => setSettings({
                          ...settings,
                          restaurant: { ...settings.restaurant, capacity: parseInt(e.target.value) }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tables">Number of Tables</Label>
                      <Input
                        id="tables"
                        type="number"
                        value={settings.restaurant.tablesCount}
                        onChange={(e) => setSettings({
                          ...settings,
                          restaurant: { ...settings.restaurant, tablesCount: parseInt(e.target.value) }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="serviceTime">Avg Service Time (mins)</Label>
                      <Input
                        id="serviceTime"
                        type="number"
                        value={settings.restaurant.avgServiceTime}
                        onChange={(e) => setSettings({
                          ...settings,
                          restaurant: { ...settings.restaurant, avgServiceTime: parseInt(e.target.value) }
                        })}
                      />
                    </div>
                  </div>

                  <Button onClick={() => handleSave("restaurant")} className="w-full md:w-auto">
                    Save Restaurant Info
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Operating Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(settings.restaurant.operatingHours).map(([day, hours]) => (
                      <div key={day} className="flex items-center justify-between">
                        <div className="flex items-center gap-4 min-w-[120px]">
                          <Label className="capitalize font-medium">{day}</Label>
                          <Switch
                            checked={!hours.closed}
                            onCheckedChange={(checked) => {
                              setSettings({
                                ...settings,
                                restaurant: {
                                  ...settings.restaurant,
                                  operatingHours: {
                                    ...settings.restaurant.operatingHours,
                                    [day]: { ...hours, closed: !checked }
                                  }
                                }
                              });
                            }}
                          />
                        </div>
                        {!hours.closed && (
                          <div className="flex items-center gap-2">
                            <Input
                              type="time"
                              value={hours.open}
                              onChange={(e) => {
                                setSettings({
                                  ...settings,
                                  restaurant: {
                                    ...settings.restaurant,
                                    operatingHours: {
                                      ...settings.restaurant.operatingHours,
                                      [day]: { ...hours, open: e.target.value }
                                    }
                                  }
                                });
                              }}
                              className="w-32"
                            />
                            <span>to</span>
                            <Input
                              type="time"
                              value={hours.close}
                              onChange={(e) => {
                                setSettings({
                                  ...settings,
                                  restaurant: {
                                    ...settings.restaurant,
                                    operatingHours: {
                                      ...settings.restaurant.operatingHours,
                                      [day]: { ...hours, close: e.target.value }
                                    }
                                  }
                                });
                              }}
                              className="w-32"
                            />
                          </div>
                        )}
                        {hours.closed && (
                          <Badge variant="secondary" className="ml-auto">Closed</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Order Notifications</h3>
                  <div className="space-y-3">
                    {Object.entries({
                      newOrders: "New Orders",
                      statusUpdates: "Order Status Updates",
                      lowStock: "Low Stock Alerts",
                      customerFeedback: "Customer Feedback"
                    }).map(([key, label]) => (
                      <div key={key} className="flex items-center justify-between">
                        <Label>{label}</Label>
                        <Switch
                          checked={settings.notifications[key as keyof typeof settings.notifications] as boolean}
                          onCheckedChange={(checked) => {
                            setSettings({
                              ...settings,
                              notifications: {
                                ...settings.notifications,
                                [key]: checked
                              }
                            });
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Delivery Methods</h3>
                  <div className="space-y-3">
                    {Object.entries({
                      emailNotifications: "Email Notifications",
                      smsNotifications: "SMS Notifications",
                      pushNotifications: "Push Notifications"
                    }).map(([key, label]) => (
                      <div key={key} className="flex items-center justify-between">
                        <Label>{label}</Label>
                        <Switch
                          checked={settings.notifications[key as keyof typeof settings.notifications] as boolean}
                          onCheckedChange={(checked) => {
                            setSettings({
                              ...settings,
                              notifications: {
                                ...settings.notifications,
                                [key]: checked
                              }
                            });
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <Button onClick={() => handleSave("notifications")} className="w-full md:w-auto">
                  Save Notification Settings
                </Button>
              </CardContent>
            </Card>
          )}

          {/* System Settings */}
          {activeTab === "system" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    System Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Order Management</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Auto Accept Orders</Label>
                          <p className="text-sm text-gray-500">Automatically accept new orders without manual confirmation</p>
                        </div>
                        <Switch
                          checked={settings.system.autoAcceptOrders}
                          onCheckedChange={(checked) => {
                            setSettings({
                              ...settings,
                              system: { ...settings.system, autoAcceptOrders: checked }
                            });
                          }}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="orderTimeout">Order Timeout (minutes)</Label>
                          <Input
                            id="orderTimeout"
                            type="number"
                            value={settings.system.orderTimeout}
                            onChange={(e) => {
                              setSettings({
                                ...settings,
                                system: { ...settings.system, orderTimeout: parseInt(e.target.value) }
                              });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-medium">Service Options</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Allow Takeaway Orders</Label>
                        <Switch
                          checked={settings.system.allowTakeaway}
                          onCheckedChange={(checked) => {
                            setSettings({
                              ...settings,
                              system: { ...settings.system, allowTakeaway: checked }
                            });
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Allow Dine-in Orders</Label>
                        <Switch
                          checked={settings.system.allowDineIn}
                          onCheckedChange={(checked) => {
                            setSettings({
                              ...settings,
                              system: { ...settings.system, allowDineIn: checked }
                            });
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Print Receipts Automatically</Label>
                        <Switch
                          checked={settings.system.printReceipts}
                          onCheckedChange={(checked) => {
                            setSettings({
                              ...settings,
                              system: { ...settings.system, printReceipts: checked }
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-medium">System Status</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Maintenance Mode</Label>
                          <p className="text-sm text-gray-500">Disable ordering system for maintenance</p>
                        </div>
                        <Switch
                          checked={settings.system.maintenanceMode}
                          onCheckedChange={(checked) => {
                            setSettings({
                              ...settings,
                              system: { ...settings.system, maintenanceMode: checked }
                            });
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Debug Mode</Label>
                          <p className="text-sm text-gray-500">Enable detailed logging for troubleshooting</p>
                        </div>
                        <Switch
                          checked={settings.system.debugMode}
                          onCheckedChange={(checked) => {
                            setSettings({
                              ...settings,
                              system: { ...settings.system, debugMode: checked }
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <Button onClick={() => handleSave("system")} className="w-full md:w-auto">
                    Save System Settings
                  </Button>
                </CardContent>
              </Card>
            </>
          )}

          {/* Other tabs placeholder */}
          {!["restaurant", "notifications", "system"].includes(activeTab) && (
            <Card>
              <CardHeader>
                <CardTitle>{tabs.find(tab => tab.id === activeTab)?.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    {tabs.find(tab => tab.id === activeTab)?.label} configuration coming soon...
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
