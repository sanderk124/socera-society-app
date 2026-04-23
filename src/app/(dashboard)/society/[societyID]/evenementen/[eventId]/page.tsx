import { getEventById } from '@/services/events.services';
import { getSocietyMembers } from '@/services/memberships.services';
import { deleteEventAction } from '@/actions/events.actions';
import { EditEventForm } from '@/components/features/event-management/EditEventForm';
import { DeleteEventButton } from '@/components/features/event-management/client/DeleteEventButton';
import { EventRsvpCard } from '@/components/features/event-management/client/EventRsvpCard';
import Link from 'next/link';

export default async function EventDetailPage({
    params,
}: {
    params: Promise<{ societyID: string; eventId: string }>;
}) {
    const { societyID, eventId } = await params;

    const [event, membersData] = await Promise.all([
        getEventById({ societyId: societyID, eventId }),
        getSocietyMembers({ societyId: societyID, pageSize: 1000 }),
    ]);

    const deleteAction = deleteEventAction.bind(null, societyID, eventId);

    return (
        <div className="pt-4">
            <div className="flex items-center justify-between mb-6">
                <Link
                    href={`/society/${societyID}/evenementen`}
                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Terug naar evenementen
                </Link>

                <EventRsvpCard rsvps={event.rsvps} members={membersData.items} societyId={societyID} />
            </div>

            <div className="max-w-2xl space-y-4">
                <div className="bg-white rounded-xl border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h1 className="text-sm font-semibold text-gray-800">Evenement bewerken</h1>
                        <p className="text-xs text-gray-500 mt-0.5">Pas de gegevens aan en sla op.</p>
                    </div>
                    <div className="px-6 py-5">
                        <EditEventForm event={event} societyId={societyID} />
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-red-200">
                    <div className="px-6 py-4 border-b border-red-100">
                        <h2 className="text-sm font-semibold text-red-700">Gevaarlijke zone</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Deze actie kan niet ongedaan worden gemaakt.</p>
                    </div>
                    <div className="px-6 py-5">
                        <DeleteEventButton action={deleteAction} eventTitle={event.title} />
                    </div>
                </div>
            </div>
        </div>
    );
}