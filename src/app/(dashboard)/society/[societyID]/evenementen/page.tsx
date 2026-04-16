import { NewEventButton } from '@/components/features/event-management/client/NewEventButton';
import { NewEventDialog } from '@/components/features/event-management/NewEventDialog';
import { getSocietyEvents } from '@/services/events.services';
import { EventCard } from '@/components/features/event-management/EventCard';

export default async function EvenementenPage({
    params,
}: {
    params: Promise<{ societyID: string }>;
}) {
    const { societyID } = await params;
    const events = await getSocietyEvents({ societyId: societyID });

    return (
        <div className="pt-4">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-lg font-semibold text-gray-900">Evenementen</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Beheer de evenementen van je vereniging.</p>
                </div>
                <NewEventButton>
                    <NewEventDialog societyId={societyID} />
                </NewEventButton>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 px-6 py-12 text-center">
                {events.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {events.map(event => (
                            <EventCard key={event.id} event={event} societyId={societyID} />
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-400">Nog geen evenementen aangemaakt.</p>
                )}
            </div>
        </div>
    );
}