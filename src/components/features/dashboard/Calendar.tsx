'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { SocietyEvent } from '@/types/events.types';

type CalendarEvent = {
    id: string;
    date: string; // YYYY-MM-DD (UTC)
    title: string;
    time: string;
};

const DAYS = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];

const MONTHS = [
    'januari', 'februari', 'maart', 'april', 'mei', 'juni',
    'juli', 'augustus', 'september', 'oktober', 'november', 'december',
];

function toYMD(year: number, month: number, day: number) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function mapToCalendarEvent(event: SocietyEvent): CalendarEvent {
    const date = new Date(event.startsAt);
    return {
        id: event.id,
        date: event.startsAt.slice(0, 10),
        title: event.title,
        time: date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }),
    };
}

type Props = {
    events: SocietyEvent[];
};

export function Calendar({ events }: Props) {
    const today = new Date();
    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const calendarEvents = events.map(mapToCalendarEvent);

    const firstDay = new Date(viewYear, viewMonth, 1);
    const startOffset = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    function prevMonth() {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
        else setViewMonth(m => m - 1);
        setSelectedDate(null);
    }

    function nextMonth() {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
        else setViewMonth(m => m + 1);
        setSelectedDate(null);
    }

    const eventsByDate = calendarEvents.reduce<Record<string, CalendarEvent[]>>((acc, ev) => {
        acc[ev.date] = acc[ev.date] ? [...acc[ev.date], ev] : [ev];
        return acc;
    }, {});

    const selectedEvents = selectedDate ? (eventsByDate[selectedDate] ?? []) : [];
    const todayYMD = toYMD(today.getFullYear(), today.getMonth(), today.getDate());

    const cells: (number | null)[] = [
        ...Array(startOffset).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];
    while (cells.length % 7 !== 0) cells.push(null);

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-700">Agenda</h2>
                <div className="flex items-center gap-2">
                    <button onClick={prevMonth} className="p-1 rounded hover:bg-gray-100 transition-colors">
                        <ChevronLeft size={16} className="text-gray-500" />
                    </button>
                    <span className="text-sm font-medium text-gray-700 w-36 text-center">
                        {MONTHS[viewMonth]} {viewYear}
                    </span>
                    <button onClick={nextMonth} className="p-1 rounded hover:bg-gray-100 transition-colors">
                        <ChevronRight size={16} className="text-gray-500" />
                    </button>
                </div>
            </div>

            <div className="p-4">
                {/* Day headers */}
                <div className="grid grid-cols-7 mb-1">
                    {DAYS.map(d => (
                        <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">{d}</div>
                    ))}
                </div>

                {/* Day cells */}
                <div className="grid grid-cols-7 gap-y-1">
                    {cells.map((day, i) => {
                        if (!day) return <div key={`empty-${i}`} />;
                        const ymd = toYMD(viewYear, viewMonth, day);
                        const dayEvents = eventsByDate[ymd] ?? [];
                        const isToday = ymd === todayYMD;
                        const isSelected = ymd === selectedDate;

                        return (
                            <button
                                key={ymd}
                                onClick={() => setSelectedDate(isSelected ? null : ymd)}
                                className={`relative flex flex-col items-center py-1 rounded-md transition-colors
                                    ${isSelected ? 'bg-blue-600' : isToday ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                            >
                                <span className={`text-xs font-medium leading-5
                                    ${isSelected ? 'text-white' : isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                                    {day}
                                </span>
                                {dayEvents.length > 0 && (
                                    <span className={`w-1.5 h-1.5 rounded-full mt-0.5 ${isSelected ? 'bg-white/80' : 'bg-blue-500'}`} />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Event panel */}
            {selectedDate && (
                <div className="border-t border-gray-100 px-4 py-3">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-gray-600">
                            {new Date(selectedDate + 'T00:00:00').toLocaleDateString('nl-NL', {
                                weekday: 'long', day: 'numeric', month: 'long',
                            })}
                        </p>
                        <button onClick={() => setSelectedDate(null)} className="text-gray-400 hover:text-gray-600">
                            <X size={14} />
                        </button>
                    </div>
                    {selectedEvents.length === 0 ? (
                        <p className="text-xs text-gray-400">Geen evenementen op deze dag.</p>
                    ) : (
                        <ul className="space-y-2">
                            {selectedEvents.map(ev => (
                                <li key={ev.id} className="flex items-start gap-2.5">
                                    <span className="mt-1 w-2 h-2 rounded-full flex-shrink-0 bg-blue-500" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{ev.title}</p>
                                        <span className="text-xs text-gray-400">{ev.time}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}