import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  DoorOpen,
  BookOpen,
  Users,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

interface TimetableItem {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  subjectName: string;
  subjectCode: string;
  sectionName: string;
  roomNumber: string;
}

interface TeacherTimetableProps {
  timetable: TimetableItem[];
}

export const TeacherTimetableSection: React.FC<TeacherTimetableProps> = ({ timetable }) => {
  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
  const [selectedDay, setSelectedDay] = useState('MONDAY');

  // If timetable prop is empty, provide comprehensive default schedule
  const activeTimetable =
    timetable && timetable.length > 0
      ? timetable
      : [
          {
            id: 'tt-1',
            dayOfWeek: 'MONDAY',
            startTime: '08:30',
            endTime: '09:25',
            subjectName: 'Advanced Mathematics',
            subjectCode: 'MATH-101',
            sectionName: 'Grade 10-A',
            roomNumber: 'Room 301',
          },
          {
            id: 'tt-2',
            dayOfWeek: 'MONDAY',
            startTime: '10:30',
            endTime: '11:25',
            subjectName: 'Advanced Mathematics',
            subjectCode: 'MATH-101',
            sectionName: 'Grade 10-B',
            roomNumber: 'Room 302',
          },
          {
            id: 'tt-3',
            dayOfWeek: 'TUESDAY',
            startTime: '09:30',
            endTime: '10:25',
            subjectName: 'Advanced Mathematics',
            subjectCode: 'MATH-101',
            sectionName: 'Grade 10-A',
            roomNumber: 'Room 301',
          },
          {
            id: 'tt-4',
            dayOfWeek: 'WEDNESDAY',
            startTime: '08:30',
            endTime: '09:25',
            subjectName: 'Advanced Mathematics',
            subjectCode: 'MATH-101',
            sectionName: 'Grade 10-B',
            roomNumber: 'Room 302',
          },
          {
            id: 'tt-5',
            dayOfWeek: 'THURSDAY',
            startTime: '11:30',
            endTime: '12:25',
            subjectName: 'Advanced Mathematics',
            subjectCode: 'MATH-101',
            sectionName: 'Grade 10-A',
            roomNumber: 'Room 301',
          },
          {
            id: 'tt-6',
            dayOfWeek: 'FRIDAY',
            startTime: '10:30',
            endTime: '11:25',
            subjectName: 'Advanced Mathematics',
            subjectCode: 'MATH-101',
            sectionName: 'Grade 10-B',
            roomNumber: 'Room 302',
          },
        ];

  const daySlots = activeTimetable.filter((t) => t.dayOfWeek === selectedDay);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-white">Faculty Lecture Schedule</h2>
          <p className="text-xs text-slate-400 mt-1">
            Weekly instructional periods, assigned lecture halls, and room allocations.
          </p>
        </div>

        <span className="self-start px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-400">
          Academic Year 2026-2027
        </span>
      </div>

      {/* Days Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {days.map((day) => {
          const count = activeTimetable.filter((t) => t.dayOfWeek === day).length;
          const isActive = selectedDay === day;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'bg-[#0B1528] text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              <span>{day.charAt(0) + day.slice(1).toLowerCase()}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-white/10 text-slate-300'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Slots List */}
      <div className="space-y-3">
        {daySlots.length > 0 ? (
          daySlots.map((slot, idx) => (
            <div
              key={slot.id || idx}
              className="p-5 rounded-2xl bg-[#0B1528]/90 border border-white/10 hover:border-amber-400/30 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="flex items-start sm:items-center gap-5">
                {/* Time Badge */}
                <div className="px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center min-w-[100px]">
                  <span className="text-sm font-mono font-bold text-amber-400 block">
                    {slot.startTime}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono block">
                    {slot.endTime}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/5 text-amber-300">
                      {slot.subjectCode || 'MATH-101'}
                    </span>
                    <span className="text-xs text-slate-400">• 55 Minutes</span>
                  </div>
                  <h3 className="text-base font-serif font-bold text-white group-hover:text-amber-300 transition">
                    {slot.subjectName || 'Advanced Mathematics'}
                  </h3>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                      <Users className="w-3.5 h-3.5 text-blue-400" />
                      {slot.sectionName || 'Grade 10-A'}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <DoorOpen className="w-3.5 h-3.5 text-emerald-400" />
                      {slot.roomNumber || 'Room 301'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  Confirmed Period
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center text-slate-400 text-sm bg-[#0B1528]/50 border border-white/5 rounded-2xl">
            No lecture periods scheduled for {selectedDay}. Dedicated faculty research & preparation window.
          </div>
        )}
      </div>
    </div>
  );
};
