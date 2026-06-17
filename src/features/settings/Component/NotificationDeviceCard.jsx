import React from "react";
import { Laptop, Smartphone, Tablet, Radio, Circle } from "lucide-react";

const getPlatformIcon = (platform) => {
  switch (platform?.toLowerCase()) {
    case "web":
      return Laptop;
    case "ios":
    case "android":
      return Smartphone;
    default:
      return Tablet;
  }
};

export default function NotificationDevicesCard({ devices = [], isLoading = false }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
        <Radio className="w-4 h-4 text-slate-500" />
        <h3 className="text-sm font-semibold text-slate-900">Registered Communication Devices</h3>
      </div>

      <div className="p-6">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 animate-pulse border-b border-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100" />
                  <div className="space-y-1.5">
                    <div className="h-4 w-32 bg-slate-100 rounded" />
                    <div className="h-3 w-20 bg-slate-100 rounded" />
                  </div>
                </div>
                <div className="h-6 w-16 bg-slate-100 rounded-full" />
              </div>
            ))}
          </div>
        ) : !devices || devices.length === 0 ? (
          <div className="text-center py-6">
            <Radio className="w-8 h-8 text-slate-300 mx-auto mb-2 stroke-1" />
            <p className="text-sm text-slate-500">No active endpoint core tokens mapped to your account token session context.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {devices.map((device) => {
              const Icon = getPlatformIcon(device.platform);
              return (
                <div key={device.id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0 group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 flex items-center justify-center group-hover:bg-slate-100/70 transition-colors shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">
                        {device.device_name || "Unknown Hardware Asset"}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5 uppercase tracking-wider font-semibold">
                        {device.platform} &bull; ID: {device.device_id?.substring(0, 8)}...
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                      device.is_active 
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
                        : "bg-slate-50 border-slate-200 text-slate-500"
                    }`}>
                      <Circle className={`w-1.5 h-1.5 fill-current ${device.is_active ? "text-emerald-500" : "text-slate-400"}`} />
                      {device.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}