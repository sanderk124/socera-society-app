import { SocietyEvent } from '@/types/events.types';
import Link from 'next/link';

type Props = {
    event: SocietyEvent;
    societyId: string;
};

export function EventCard({ event, societyId }: Props) {
    const bannerUrl = event.media.find((m) => m.mediaKind === 'Banner')?.url ?? null;

    const startsAt = new Date(event.startsAt);
    const endsAt = new Date(event.endsAt);

    const dateLabel = startsAt.toLocaleDateString('nl-NL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    const timeLabel = `${startsAt.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })} – ${endsAt.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}`;

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col text-left">
            {/* Banner */}
            <div className="h-32 bg-gray-100 flex-shrink-0">
                {bannerUrl ? (
                    <img
                        src={bannerUrl}
                        alt={event.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-300" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col gap-2 flex-1">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2">
                        {event.title}
                    </h3>
                    <span className={`flex-shrink-0 inline-flex px-1.5 py-0.5 rounded-full text-xs font-medium ${
                        event.isPublic
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                    }`}>
                        {event.isPublic ? 'Openbaar' : 'Privé'}
                    </span>
                </div>

                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {event.description}
                </p>

                <div className="mt-auto pt-2 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                        {dateLabel}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {timeLabel}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                        </svg>
                        {event.goingCount} gaan
                    </div>
                </div>

                <Link
                    href={`/society/${societyId}/evenementen/${event.id}`}
                    className="mt-2 inline-flex items-center justify-center gap-1.5 w-full px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                    </svg>
                    Bewerken
                </Link>
            </div>
        </div>
    );
}