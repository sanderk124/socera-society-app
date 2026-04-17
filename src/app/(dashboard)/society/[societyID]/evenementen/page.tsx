import Link from 'next/link';
import { NewEventButton } from '@/components/features/event-management/client/NewEventButton';
import { NewEventDialog } from '@/components/features/event-management/NewEventDialog';
import { getSocietyEvents } from '@/services/events.services';
import { EventCard } from '@/components/features/event-management/EventCard';

type Tab = 'opkomend' | 'verlopen';

export default async function EvenementenPage({
    params,
    searchParams,
}: {
    params: Promise<{ societyID: string }>;
    searchParams: Promise<{ tab?: string }>;
}) {
    const { societyID } = await params;
    const { tab } = await searchParams;
    const activeTab: Tab = tab === 'verlopen' ? 'verlopen' : 'opkomend';

    const events = await getSocietyEvents({ societyId: societyID });

    const now = new Date();

    const byTab = {
        opkomend: events.filter(e => new Date(e.startsAt) >= now),
        verlopen: events.filter(e => new Date(e.startsAt) < now),
    };

    const tabs: { key: Tab; label: string; count: number }[] = [
        { key: 'opkomend', label: 'Opkomende evenementen', count: byTab.opkomend.length },
        { key: 'verlopen', label: 'Verlopen evenementen',  count: byTab.verlopen.length },
    ];

    const currentEvents = byTab[activeTab];

    const emptyMessages: Record<Tab, string> = {
        opkomend: 'Geen opkomende evenementen.',
        verlopen: 'Geen verlopen evenementen.',
    };

    return (
        <div className="pt-4">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-lg font-semibold text-gray-900">Evenementen</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Beheer de evenementen van je vereniging.</p>
                </div>
                <NewEventButton>
                    <NewEventDialog societyId={societyID} />
                </NewEventButton>
            </div>

            {/* Tab navigation */}
            <div className="bg-white rounded-t-lg border border-gray-200 border-b-0 px-6 pt-4 flex items-center gap-1">
                {tabs.map(t => (
                    <Link
                        key={t.key}
                        href={`?tab=${t.key}`}
                        className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                            activeTab === t.key
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        {t.label}
                        <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
                            activeTab === t.key ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                        }`}>
                            {t.count}
                        </span>
                    </Link>
                ))}
            </div>

            {/* Content */}
            <div className="bg-white rounded-b-lg border border-gray-200 p-6">
                {currentEvents.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {currentEvents.map(event => (
                            <EventCard key={event.id} event={event} societyId={societyID} />
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-400 text-center py-8">
                        {emptyMessages[activeTab]}
                    </p>
                )}
            </div>
        </div>
    );
}