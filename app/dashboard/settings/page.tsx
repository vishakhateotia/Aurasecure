"use client"

import { useState } from "react"
import {
  Shield,
  Bell,
  Camera,
  Database,
  Users,
  Lock,
  Save,
  RefreshCw,
  UserPlus,
  Trash2,
  Edit,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { useUser } from "@/lib/user-context"

const adminSettingsSections = [
  { id: "general", label: "General", icon: Shield, adminOnly: false },
  { id: "notifications", label: "Notifications", icon: Bell, adminOnly: false },
  { id: "cameras", label: "Cameras", icon: Camera, adminOnly: true },
  { id: "storage", label: "Storage", icon: Database, adminOnly: true },
  { id: "users", label: "User Management", icon: Users, adminOnly: true },
  { id: "security", label: "Security", icon: Lock, adminOnly: true },
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("general")
  const { user, isAdmin } = useUser()

  const settingsSections = adminSettingsSections.filter((section) => !section.adminOnly || isAdmin)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            {isAdmin ? "System Settings" : "User Settings"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isAdmin ? "Configure system preferences and parameters" : "Manage your personal preferences"}
          </p>
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset to Defaults
            </Button>
          )}
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="glass-card-solid rounded-xl p-4 space-y-1">
            {settingsSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                  activeSection === section.id
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                <section.icon className="w-4 h-4" />
                {section.label}
              </button>
            ))}
          </div>

          {!isAdmin && (
            <div className="mt-4 p-4 bg-peach/30 border border-peach rounded-xl">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Limited Access</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Contact an administrator to access advanced settings.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="glass-card-solid rounded-xl p-6 space-y-6">
            {activeSection === "general" && (
              <>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">General Settings</h3>
                  <div className="space-y-4">
                    {isAdmin ? (
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>System Name</Label>
                          <Input placeholder="Enter system name" className="bg-muted border-border" />
                        </div>
                        <div className="space-y-2">
                          <Label>Time Zone</Label>
                          <select className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground">
                            <option>UTC-8 (Pacific Time)</option>
                            <option>UTC-5 (Eastern Time)</option>
                            <option>UTC+0 (GMT)</option>
                          </select>
                        </div>
                      </div>
                    ) : (
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Display Name</Label>
                          <Input placeholder="Your display name" className="bg-muted border-border" />
                        </div>
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input value={user?.email || ""} disabled className="bg-muted/50 border-border" />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">
                          {isAdmin ? "Auto-Lock System" : "Auto-Lock Session"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {isAdmin ? "Automatically lock after inactivity" : "Lock your session after inactivity"}
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">Dark Mode</p>
                        <p className="text-sm text-muted-foreground">Use dark theme interface</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeSection === "notifications" && (
              <>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Notification Settings</h3>
                  <div className="space-y-4">
                    {isAdmin && (
                      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium text-foreground">Intrusion Alerts</p>
                          <p className="text-sm text-muted-foreground">Get notified when intrusions are detected</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    )}
                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">Access Denials</p>
                        <p className="text-sm text-muted-foreground">Alert when access is denied</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    {isAdmin && (
                      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium text-foreground">System Health</p>
                          <p className="text-sm text-muted-foreground">Notify on system status changes</p>
                        </div>
                        <Switch />
                      </div>
                    )}
                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Send alerts via email</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeSection === "cameras" && isAdmin && (
              <>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Camera Settings</h3>
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Default Resolution</Label>
                        <select className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground">
                          <option>1080p (Full HD)</option>
                          <option>720p (HD)</option>
                          <option>4K (Ultra HD)</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>Frame Rate</Label>
                        <select className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground">
                          <option>30 FPS</option>
                          <option>24 FPS</option>
                          <option>60 FPS</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">Night Vision</p>
                        <p className="text-sm text-muted-foreground">Auto-enable in low light conditions</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">Motion Detection</p>
                        <p className="text-sm text-muted-foreground">Enable motion-triggered recording</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeSection === "users" && isAdmin && (
              <>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">User Management</h3>
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add User
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Manage system users, roles, and permissions. Add new users or modify existing access levels.
                    </p>

                    {/* Empty state for database integration */}
                    <div className="border border-dashed border-border rounded-xl p-8 text-center">
                      <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h4 className="text-foreground font-medium mb-2">No Users Configured</h4>
                      <p className="text-sm text-muted-foreground mb-4">User data will be loaded from your database.</p>
                      <div className="flex justify-center gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Roles
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive bg-transparent"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove User
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeSection === "storage" && isAdmin && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Database className="w-8 h-8 text-muted-foreground" />
                </div>
                <h4 className="text-lg font-medium text-foreground mb-2">Storage Settings</h4>
                <p className="text-muted-foreground mb-4">
                  Configure storage preferences and manage retention policies.
                </p>
                <p className="text-sm text-muted-foreground">Connect to your database to manage storage settings.</p>
              </div>
            )}

            {activeSection === "security" && isAdmin && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Security Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Require 2FA for all admin accounts</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">Session Timeout</p>
                      <p className="text-sm text-muted-foreground">Auto-logout after 30 minutes of inactivity</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">IP Whitelisting</p>
                      <p className="text-sm text-muted-foreground">Restrict access to specific IP addresses</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">Audit Logging</p>
                      <p className="text-sm text-muted-foreground">Log all administrative actions</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
