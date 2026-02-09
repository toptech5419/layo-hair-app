"use client";

import { useState } from "react";
import {
  Clock,
  Save,
  Plus,
  Trash2,
  CalendarOff,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
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
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [blockedOpen, setBlockedOpen] = useState(false);
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

  // Build schedule summary for collapsed view
  const openDays = schedule.filter((d) => d.isOpen);
  const closedDays = schedule.filter((d) => !d.isOpen);
  const scheduleSummary = openDays.length === 0
    ? "All days closed"
    : `${openDays.map((d) => d.day.slice(0, 3)).join(", ")} open`;

  // Check if all open days share the same hours
  const allSameHours =
    openDays.length > 0 &&
    openDays.every((d) => d.start === openDays[0].start && d.end === openDays[0].end);
  const hoursLabel = allSameHours && openDays.length > 0
    ? `${openDays[0].start} – ${openDays[0].end}`
    : "Mixed hours";

  return (
    <>
      {/* Message */}
      {message && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm ${
            message.type === "success"
              ? "bg-green-500/10 border border-green-500/20 text-green-500"
              : "bg-red-500/10 border border-red-500/20 text-red-500"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Weekly Schedule */}
        <div className="bg-zinc-900 rounded-xl border border-white/[0.06] overflow-hidden">
          {/* Collapsible Header */}
          <button
            onClick={() => setScheduleOpen((prev) => !prev)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#FFD700]/10 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-[#FFD700]" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Weekly Schedule
                </h2>
                <p className="text-xs text-white/40 mt-0.5">
                  {scheduleSummary} · {hoursLabel}
                </p>
              </div>
            </div>
            {scheduleOpen ? (
              <ChevronUp className="w-4 h-4 text-white/40" />
            ) : (
              <ChevronDown className="w-4 h-4 text-white/40" />
            )}
          </button>

          {/* Collapsed Summary - quick glance at days */}
          {!scheduleOpen && (
            <div className="px-4 pb-3 flex flex-wrap gap-1.5">
              {schedule.map((item) => (
                <span
                  key={item.dayOfWeek}
                  className={`text-[10px] px-2 py-1 rounded-full font-medium ${
                    item.isOpen
                      ? "bg-green-500/10 text-green-500"
                      : "bg-zinc-800 text-white/30"
                  }`}
                >
                  {item.day.slice(0, 3)}
                </span>
              ))}
            </div>
          )}

          {/* Expanded Content */}
          {scheduleOpen && (
            <div className="border-t border-white/[0.06]">
              <div className="p-4 space-y-3">
                {schedule.map((item) => (
                  <div
                    key={item.dayOfWeek}
                    className="flex items-center gap-3 sm:gap-4 p-2.5 sm:p-3 rounded-lg bg-zinc-800/50"
                  >
                    <div className="w-20 sm:w-28">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.isOpen}
                          onChange={() => toggleDay(item.dayOfWeek)}
                          className="w-4 h-4 rounded border-zinc-600 bg-zinc-700 text-[#FFD700] focus:ring-[#FFD700]"
                        />
                        <span
                          className={`text-xs sm:text-sm font-medium ${
                            item.isOpen ? "text-white" : "text-white/40"
                          }`}
                        >
                          {item.day.slice(0, 3)}
                          <span className="hidden sm:inline">
                            {item.day.slice(3)}
                          </span>
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
                          className="bg-zinc-700 border border-zinc-600 rounded px-2 sm:px-3 py-1.5 text-white text-xs sm:text-sm w-[90px] sm:w-auto"
                        />
                        <span className="text-white/40 text-xs">to</span>
                        <input
                          type="time"
                          value={item.end}
                          onChange={(e) =>
                            updateTime(item.dayOfWeek, "end", e.target.value)
                          }
                          className="bg-zinc-700 border border-zinc-600 rounded px-2 sm:px-3 py-1.5 text-white text-xs sm:text-sm w-[90px] sm:w-auto"
                        />
                      </div>
                    ) : (
                      <span className="text-white/40 text-xs sm:text-sm">Closed</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Save Button */}
              <div className="p-4 border-t border-white/[0.06]">
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full sm:w-auto bg-[#FFD700] text-black hover:bg-[#FFD700]/90"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {isSaving ? "Saving..." : "Save Schedule"}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Blocked Dates */}
        <div className="bg-zinc-900 rounded-xl border border-white/[0.06] overflow-hidden">
          {/* Collapsible Header */}
          <button
            onClick={() => setBlockedOpen((prev) => !prev)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#FFD700]/10 rounded-lg flex items-center justify-center">
                <CalendarOff className="w-4 h-4 text-[#FFD700]" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Blocked Dates
                </h2>
                <p className="text-xs text-white/40 mt-0.5">
                  {blocked.length === 0
                    ? "No dates blocked"
                    : `${blocked.length} date${blocked.length !== 1 ? "s" : ""} blocked`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {blocked.length > 0 && (
                <span className="text-[10px] font-medium bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full">
                  {blocked.length}
                </span>
              )}
              {blockedOpen ? (
                <ChevronUp className="w-4 h-4 text-white/40" />
              ) : (
                <ChevronDown className="w-4 h-4 text-white/40" />
              )}
            </div>
          </button>

          {/* Expanded Content */}
          {blockedOpen && (
            <div className="border-t border-white/[0.06]">
              {/* Add New Blocked Date */}
              <div className="p-4 bg-zinc-800/30">
                <h3 className="text-xs font-medium text-white/60 mb-2.5">
                  Block a Date
                </h3>
                <div className="flex flex-col sm:flex-row gap-2">
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
              <div className="p-4 space-y-2 max-h-[300px] overflow-y-auto">
                {blocked.length === 0 ? (
                  <p className="text-white/40 text-sm text-center py-6">
                    No blocked dates
                  </p>
                ) : (
                  blocked.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2.5 bg-zinc-800/50 rounded-lg"
                    >
                      <div>
                        <p className="text-white text-sm font-medium">
                          {new Date(item.date).toLocaleDateString("en-GB", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                        {item.reason && (
                          <p className="text-white/40 text-xs">{item.reason}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeBlockedDate(item.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-7 w-7 p-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
