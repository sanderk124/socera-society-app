import { updateEventAction, deleteEventAvatarAction, deleteEventBannerAction } from '@/actions/events.actions';
import { SocietyEvent } from '@/types/events.types';
import { EventMediaSection } from './client/EventMediaSection';

type Props = {
    event: SocietyEvent;
    societyId: string;
};

function toDatetimeLocal(iso: string): string {
    return new Date(iso).toISOString().slice(0, 16);
}

export function EditEventForm({ event, societyId }: Props) {
    const action = updateEventAction.bind(null, societyId, event.id);
    const deleteAvatar = deleteEventAvatarAction.bind(null, societyId, event.id);
    const deleteBanner = deleteEventBannerAction.bind(null, societyId, event.id);

    const avatarUrl = event.media.find((m) => m.mediaKind === 'Avatar')?.url ?? null;
    const bannerUrl = event.media.find((m) => m.mediaKind === 'Banner')?.url ?? null;

    return (
        <form action={action} className="space-y-4">
            <EventMediaSection
                currentAvatarUrl={avatarUrl}
                currentBannerUrl={bannerUrl}
                deleteAvatarAction={deleteAvatar}
                deleteBannerAction={deleteBanner}
            />

            <div className="border-t border-gray-100 pt-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Naam <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="title"
                        name="title"
                        type="text"
                        required
                        defaultValue={event.title}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Beschrijving <span className="text-red-500">*</span>
                </label>
                <textarea
                    id="description"
                    name="description"
                    required
                    rows={4}
                    defaultValue={event.description}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="startsAt" className="block text-sm font-medium text-gray-700 mb-1">
                        Startdatum <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="startsAt"
                        name="startsAt"
                        type="datetime-local"
                        required
                        defaultValue={toDatetimeLocal(event.startsAt)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <div>
                    <label htmlFor="endsAt" className="block text-sm font-medium text-gray-700 mb-1">
                        Einddatum <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="endsAt"
                        name="endsAt"
                        type="datetime-local"
                        required
                        defaultValue={toDatetimeLocal(event.endsAt)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <input
                    id="isPublic"
                    name="isPublic"
                    type="checkbox"
                    defaultChecked={event.isPublic}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isPublic" className="text-sm font-medium text-gray-700">
                    Openbaar evenement
                </label>
            </div>

            <div className="flex justify-end pt-2">
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Wijzigingen opslaan
                </button>
            </div>
        </form>
    );
}