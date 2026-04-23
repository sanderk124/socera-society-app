import { createEventAction } from '@/actions/events.actions';

type Props = {
    societyId: string;
};

export function NewEventDialog({ societyId }: Props) {
    const action = createEventAction.bind(null, societyId);

    return (
        <div className="px-6 py-6">
            <div className="mb-5">
                <h2 className="text-base font-semibold text-gray-900">Nieuw evenement</h2>
                <p className="text-sm text-gray-500 mt-0.5">Vul de gegevens in om een evenement aan te maken.</p>
            </div>

            <form action={action} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Naam <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="title"
                        name="title"
                        type="text"
                        required
                        placeholder="bijv. Nieuwjaarsborrel"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Beschrijving <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        required
                        rows={3}
                        placeholder="Omschrijf het evenement..."
                        className="w-full border border-gray-300 rounded-lg text-gray-900 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
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
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        id="isPublic"
                        name="isPublic"
                        type="checkbox"
                        defaultChecked
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
                        Evenement aanmaken
                    </button>
                </div>
            </form>
        </div>
    );
}