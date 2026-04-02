import { getSocietyProfile } from '@/services/society.services';
import { saveSettingsAction } from '@/actions/society.actions';
import Image from 'next/image';

export default async function SettingsPage({
    params,
    searchParams,
}: {
    params: Promise<{ societyID: string }>;
    searchParams: Promise<{ saved?: string }>;
}) {
    const { societyID } = await params;
    const { saved } = await searchParams;
    const profile = await getSocietyProfile({ societyId: societyID });

    const avatarUrl = profile.profileMedia.find((m) => m.mediaKind === 'Avatar')?.url ?? null;
    const bannerUrl = profile.profileMedia.find((m) => m.mediaKind === 'Banner')?.url ?? null;

    async function action(formData: FormData) {
        'use server';
        await saveSettingsAction(societyID, formData);
    }

    return (
        <form action={action} className="space-y-6 max-w-2xl">
            {/* Banner */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Banner</label>
                {bannerUrl && (
                    <div className="relative w-full h-36 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 mb-2">
                        <Image src={bannerUrl} alt="Banner" fill className="object-cover" unoptimized />
                    </div>
                )}
                <input type="file" name="banner" accept="image/*"
                    className="text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
            </div>

            {/* Avatar */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Avatar</label>
                {avatarUrl && (
                    <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-100 border border-gray-200 mb-2">
                        <Image src={avatarUrl} alt="Avatar" fill className="object-cover" unoptimized />
                    </div>
                )}
                <input type="file" name="avatar" accept="image/*"
                    className="text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
            </div>

            <hr className="border-gray-200" />

            {/* General info */}
            <div className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Naam</label>
                    <input id="name" name="name" type="text" defaultValue={profile.name}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-black focus:outline-none focus:ring-2 focus:ring-gray-400" />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Beschrijving</label>
                    <textarea id="description" name="description" rows={4} defaultValue={profile.description}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-black focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none" />
                </div>
            </div>

            <hr className="border-gray-200" />

            {/* Contact info */}
            <div className="space-y-4">
                <div>
                    <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">E-mailadres</label>
                    <input id="contactEmail" name="contactEmail" type="email" defaultValue={profile.societyContactInfo.contactEmail}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-black focus:outline-none focus:ring-2 focus:ring-gray-400" />
                </div>
                <div>
                    <label htmlFor="contactPhoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Telefoonnummer</label>
                    <input id="contactPhoneNumber" name="contactPhoneNumber" type="tel" defaultValue={profile.societyContactInfo.contactPhoneNumber}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-black focus:outline-none focus:ring-2 focus:ring-gray-400" />
                </div>
                <div>
                    <label htmlFor="contactWebsite" className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <input id="contactWebsite" name="contactWebsite" type="url" defaultValue={profile.societyContactInfo.societyWebsite ?? ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-black focus:outline-none focus:ring-2 focus:ring-gray-400" />
                </div>
            </div>

            {saved === 'true' && (
                <p className="text-sm text-green-600">Wijzigingen opgeslagen.</p>
            )}

            <button type="submit"
                className="px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-700 transition-colors">
                Opslaan
            </button>
        </form>
    );
}