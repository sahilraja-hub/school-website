import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Sparkles,
  Users,
} from 'lucide-react';
import { LinkedChild } from '../types';

interface TimetableSlot {
  id: string;
  dayOfWeek: string;
  periodNumber: number;
  startTime: string;
  endTime: string;
  subjectName: string;
  teacherName: string;
  roomNumber: string;
}

interface ParentTimetableSectionProps {
  childrenList: LinkedChild[];
  selectedChild: LinkedChild | null;
  onSelectChild: (childId: string) => void;
  timetable: TimetableSlot[];
  loading?: boolean;
}

export const ParentTimetableSection: React.FC<ParentTimetableSectionProps> = ({
  childrenList,
  selectedChild,
  onSelectChild,
  timetable,
  loading,
}) => {
  const [selectedDay, setSelectedDay] = useState<string>('Monday');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  // Default fallback timetable slots
  const defaultTimetable: TimetableSlot[] = [
    {
      id: 'tt-01',
      dayOfWeek: 'Monday',
      periodNumber: 1,
      startTime: '08:30',
      endTime: '09:20',
      subjectName: 'Advanced Mathematics',
      teacherName: 'Dr. Robert Chen',
      roomNumber: 'Room 302',
    },
    {
      id: 'tt-02',
      dayOfWeek: 'Monday',
      periodNumber: 2,
      startTime: '09:30',
      endTime: '10:20',
      subjectName: 'AP Physics C: Mechanics',
      teacherName: 'Dr. Evelyn Reed',
      roomNumber: 'Lab B-2',
    },
    {
      id: 'tt-03',
      dayOfWeek: 'Monday',
      periodNumber: 3,
      startTime: '10:40',
      endTime: '11:30',
      subjectName: 'World Literature & Rhetoric',
      teacherName: 'Sarah Jenkins',
      roomNumber: 'Room 204',
    },
    {
      id: 'tt-04',
      dayOfWeek: 'Monday',
      periodNumber: 4,
      startTime: '11:40',
      endTime: '12:30',
      subjectName: 'European History',
      teacherName: 'Marcus Holloway',
      roomNumber: 'Room 105',
    },
    {
      id: 'tt-05',
      dayOfWeek: 'Monday',
      periodNumber: 5,
      startTime: '13:30',
      endTime: '14:20',
      subjectName: 'Computer Science & AI',
      teacherName: 'David Mercer',
      roomNumber: 'Tech Studio 1',
    },
  ];

  const slotsToDisplay = timetable.length > 0 ? timetable : defaultTimetable;

  const currentDaySlots = slotsToDisplay.filter(
    (slot) => (slot.dayOfWeek || '').toLowerCase() === selectedDay.toLowerCase()
  );

  const sortedSlots = [...currentDaySlots].sort(
    (a, b) => a.periodNumber - b.periodNumber
  );

  return (
    <div className="space-y-8" data-testid="parent-timetable-section">
      {/* Multi-Child Selector */}
      {childrenList.length > 1 && (
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-crest-700" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Timetable For:
            </span>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {childrenList.map((child) => {
              const isSelected = selectedChild?.id === child.id;
              return (
                <button
                  key={child.id}
                  onClick={() => onSelectChild(child.id)}
                  data-testid={`timetable-child-btn-${child.id}`}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
                    isSelected
                      ? 'bg-crest-950 text-white shadow-sm ring-2 ring-gold-400'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{child.fullName}</span>
                  <span className="text-[10px] opacity-75">({child.className})</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Header and Day Selector */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-crest-700" /> Weekly Class Schedule
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Academic periods, classroom assignments, and instructors for {selectedChild?.fullName || 'the student'} ({selectedChild?.className || 'Grade 10'} • {selectedChild?.sectionName || 'Section A'}).
          </p>
        </div>

        {/* Day Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl overflow-x-auto max-w-full">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
                selectedDay === day
                  ? 'bg-white text-crest-950 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Schedule Period Cards */}
      <div className="space-y-4">
        {sortedSlots.length > 0 ? (
          sortedSlots.map((slot) => (
            <div
              key={slot.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-crest-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-crest-50 text-crest-800 flex flex-col items-center justify-center font-bold flex-shrink-0 border border-crest-100">
                  <span className="text-[10px] uppercase text-crest-600">Period</span>
                  <span className="text-xl font-serif">{slot.periodNumber}</span>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-base text-slate-900">
                    {slot.subjectName}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-crest-700" />
                      <span>{slot.teacherName}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gold-500" />
                      <span>{slot.roomNumber}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                  <Clock className="w-3.5 h-3.5 text-crest-700" />
                  <span>
                    {slot.startTime} – {slot.endTime}
                  </span>
                </div>
                <span className="text-[11px] text-emerald-700 font-semibold mt-1">
                  Active Instruction
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
            No scheduled periods recorded for {selectedDay}.
          </div>
        )}
      </div>
    </div>
  );
};
