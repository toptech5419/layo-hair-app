"use client";

import { useState } from "react";
import { Clock, Save, Plus, Trash2, CalendarOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScheduleItem {
  day: string;
  dayOfWeek: number;
  isOpen: boolean;
  start: string;
  end: string;
}

interface BlockedItem {
  id: string;
  date: string;
  reason: string;
}

interface AvailabilityFormProps {
  initialSchedule: ScheduleItem[];
  initialBlocked: BlockedItem[];
}

export function AvailabilityForm({
  initialSchedule,
  initialBlocked,
}: AvailabilityFormProps) {
  const [schedule, setSchedule] = useState(initialSchedule);
  const [blocked, setBlocked] = useState(initialBlocked);
  const [newBlockDate, setNewBlockDate] = useState("");
  const [newBlockReason, setNewBlockReason] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const toggleDay = (dayOfWeek: number) => {
    setSchedule((prev) =>
      prev.map((item) =>
        item.dayOfWeek === dayOfWeek ? { ...item, isOpen: !item.isOpen } : item
      )
    );
  };

  const updateTime = (
    dayOfWeek: number,
    field: "start" | "end",
    value: string
  ) => {
    setSchedule((prev) =>
      prev.map((item) =>
        item.dayOfWeek === dayOfWeek ? { ...item, [field]: value } : item
      )
    );
  };

  const addBlockedDate = async () => {
    if (!newBlockDate) return;

    try {
      const response = await fetch("/api/availability/blocked", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: newBlockDate, reason: newBlockReason }),
      });

      if (response.ok) {
        const data = await response.json();
        setBlocked([
          ...blocked,
          { id: data.id, date: newBlockDate, reason: newBlockReason },
        ]);
        setNewBlockDate("");
        setNewBlockReason("");
        setMessage({ type: "success", text: "Date blocked successfully" });
      } else {
        setMessage({ type: "error", text: "Failed to block date" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to block date" });
    }

    setTimeout(() => setMessage(null), 3000);
  };

  const removeBlockedDate = async (id: string) => {
    try {
      const response = await fetch(`/api/availability/blocked?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setBlocked(blocked.filter((b) => b.id !== id));
        setMessage({ type: "success", text: "Date unblocked" });
      } else {
        setMessage({ type: "error", text: "Failed to unblock date" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to unblock date" });
    }

    setTimeout(() => setMessage(null), 3000);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schedule }),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Availability saved successfully" });
      } else {
        setMessage({ type: "error", text: "Failed to save availability" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to save availability" });
    }

    setIsSaving(false);
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <>
      {/* Message */}
      {message && (
        <div
          className={`mb-4 p-3 rounded-lg ${
            message.type === "success"
              ? "bg-green-500/10 border border-green-500/20 text-green-500"
              : "bg-red-500/10 border border-red-500/20 text-red-500"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Schedule */}
        <div className="bg-zinc-900 rounded-xl border border-[#FFD700]/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#FFD700]" />
              Weekly Schedule
            </h2>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>

          <div className="space-y-4">
            {schedule.map((item) => (
              <div
                key={item.dayOfWeek}
                className="flex items-center gap-4 p-3 rounded-lg bg-zinc-800/50"
              >
                <div className="w-28">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.isOpen}
                      onChange={() => toggleDay(item.dayOfWeek)}
                      className="w-4 h-4 rounded border-zinc-600 bg-zinc-700 text-[#FFD700] focus:ring-[#FFD700]"
                    />
                    <span
                      className={`text-sm font-medium ${
                        item.isOpen ? "text-white" : "text-white/40"
                      }`}
                    >
                      {item.day}
                    </span>
                  </label>
                </div>

                {item.isOpen ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="time"
                      value={item.start}
                      onChange={(e) =>
                        updateTime(item.dayOfWeek, "start", e.target.value)
                      }
                      className="bg-zinc-700 border border-zinc-600 rounded px-3 py-1.5 text-white text-sm"
                    />
                    <span className="text-white/40">to</span>
                    <input
                      type="time"
                      value={item.end}
                      onChange={(e) =>
                        updateTime(item.dayOfWeek, "end", e.target.value)
                      }
                      className="bg-zinc-700 border border-zinc-600 rounded px-3 py-1.5 text-white text-sm"
                    />
                  </div>
                ) : (
                  <span className="text-white/40 text-sm">Closed</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Blocked Dates */}
        <div className="bg-zinc-900 rounded-xl border border-[#FFD700]/10 p-6">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <CalendarOff className="w-5 h-5 text-[#FFD700]" />
            Blocked Dates
          </h2>

          {/* Add New Blocked Date */}
          <div className="mb-6 p-4 bg-zinc-800/50 rounded-lg">
            <h3 className="text-sm font-medium text-white/70 mb-3">
              Block a Date
            </h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="date"
                value={newBlockDate}
                onChange={(e) => setNewBlockDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="bg-zinc-700 border border-zinc-600 rounded px-3 py-2 text-white text-sm flex-1"
              />
              <input
                type="text"
                placeholder="Reason (optional)"
                value={newBlockReason}
                onChange={(e) => setNewBlockReason(e.target.value)}
                className="bg-zinc-700 border border-zinc-600 rounded px-3 py-2 text-white text-sm placeholder:text-white/40 flex-1"
              />
              <Button
                onClick={addBlockedDate}
                disabled={!newBlockDate}
                size="sm"
                className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Blocked Dates List */}
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {blocked.length === 0 ? (
              <p className="text-white/40 text-sm text-center py-8">
                No blocked dates
              </p>
            ) : (
              blocked.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg"
                >
                  <div>
                    <p className="text-white font-medium">
                      {new Date(item.date).toLocaleDateString("en-GB", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    {item.reason && (
                      <p className="text-white/50 text-sm">{item.reason}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeBlockedDate(item.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
