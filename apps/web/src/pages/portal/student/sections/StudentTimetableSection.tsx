import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  BookOpen,
  MapPin,
  User,
  ShieldCheck,
} from 'lucide-react';

interface StudentTimetableSectionProps {
  timetable: any[];
  profile: any;
  loading?: boolean;
}

export const StudentTimetableSection: React.FC<StudentTimetableSectionProps> = ({
  timetable,
  profile,
  loading,
}) => {
  const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
  const [selectedDay, setSelectedDay] = useState<string>('MONDAY');

  // Filter slots for selected day
  const slots = timetable.filter(
    (slot) => (slot.dayOfWeek || '').toUpperCase() === selectedDay
  );

  // Fallback demo schedule if backend has not seeded all periods
  const displaySlots =
    slots.length > 0
      ? slots
      : [
          {
            id: 'slot-1',
            periodNumber: 1,
            startTime: '08:30 AM',
            endTime: '09:20 AM',
            subjectName: 'Advanced Mathematics',
            teacherName: 'Dr. Evelyn Reed',
            roomNumber: profile?.roomNumber || 'Room 301',
          },
          {
            id: 'slot-2',
            periodNumber: 2,
            startTime: '09:25 AM',
            endTime: '10:15 AM',
            subjectName: 'AP Physics C: Mechanics',
            teacherName: 'Dr. Evelyn Reed',
            roomNumber: 'Physics Lab 204',
          },
          {
            id: 'slot-3',
            periodNumber: 3,
            startTime: '10:30 AM',
            endTime: '11:20 AM',
            subjectName: 'World Literature & Rhetoric',
            teacherName: 'Mrs. Sarah Jenkins',
            roomNumber: 'Lecture Hall 105',
          },
          {
            id: 'slot-4',
            periodNumber: 4,
            startTime: '11:25 AM',
            endTime: '12:15 PM',
            subjectName: 'Computer Science & AI',
            teacherName: 'Prof. Alan Vance',
            roomNumber: 'Innovation Hub 1',
          },
          {
            id: 'slot-5',
            periodNumber: 5,
            startTime: '01:00 PM',
            endTime: '01:50 PM',
            subjectName: 'Physical Education & Athletics',
            teacherName: 'Coach Marcus Bell',
            roomNumber: 'Main Gymnasium',
          },
        ];

  return (
    <div className="space-y-8 animate-fadeIn" data-testid="student-timetable-section">
      {/* Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-crest-700 bg-crest-50 px-2.5 py-0.5 rounded">
            Enrolled Academic Section
          </span>
          <h2 className="font-serif text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-crest-700" />
            Class Timetable: {profile?.className || 'Grade 10'} • {profile?.sectionName || 'Section A'}
          </h2>
          <p className="text-xs text-slate-500">
            Homeroom: {profile?.roomNumber || 'Room 301'} • Fall Term 2026–2027
          </p>
        </div>

        {/* Day Selector Pills */}
        <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1.5 rounded-2xl">
          {daysOfWeek.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition capitalize ${
                selectedDay === day
                  ? 'bg-crest-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {day.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 className="font-serif text-lg font-bold text-slate-900 capitalize">
              {selectedDay.toLowerCase()} Schedule
            </h3>
            <p className="text-xs text-slate-500">5 Scheduled Academic Periods</p>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Full-day In-person Sessions
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {displaySlots.map((slot, idx) => (
            <div
              key={slot.id || idx}
              className="p-5 sm:p-6 hover:bg-slate-50/80 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-crest-100 text-crest-800 font-serif font-bold text-base flex items-center justify-center shrink-0">
                  P{slot.periodNumber || idx + 1}
                </div>

                <div>
                  <h4 className="font-serif text-base sm:text-lg font-bold text-slate-900">
                    {slot.subjectName}
                  </h4>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <User className="w-3.5 h-3.5 text-crest-700" />
                      {slot.teacherName || 'Faculty Instructor'}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {slot.roomNumber || profile?.roomNumber || 'Room 301'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="font-mono text-xs sm:text-sm font-bold text-slate-800 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  {slot.startTime} – {slot.endTime}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
