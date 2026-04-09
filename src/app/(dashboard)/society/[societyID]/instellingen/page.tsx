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
        <div className="max-w-3xl">
            {/* Page header */}

            {/* Success banner */}
            {saved === 'true' && (
                <div className="flex items-center gap-3 px-4 py-3 mb-6 bg-green-50 border border-green-200 rounded-lg text-green-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm font-medium">Wijzigingen zijn succesvol opgeslagen.</p>
                </div>
            )}

            <form action={action} className="space-y-5">

                {/* ── Media card ── */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="text-sm font-semibold text-gray-800">Afbeeldingen</h2>
                        <p className="text-xs text-gray-500 mt-0.5">De visuele identiteit van je vereniging</p>
                    </div>

                    {/* Profile preview */}
                    <div className="relative h-36 bg-gradient-to-r from-gray-100 to-gray-200">
                        {bannerUrl ? (
                            <Image src={bannerUrl} alt="Banner" fill className="object-cover" unoptimized />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <p className="text-xs text-gray-400">Geen banner ingesteld</p>
                            </div>
                        )}
                        {/* Avatar overlay */}
                        <div className="absolute left-6 -bottom-8 w-16 h-16 rounded-full ring-4 ring-white bg-gray-200 overflow-hidden shadow-sm">
                            {avatarUrl ? (
                                <Image src={avatarUrl} alt="Avatar" fill className="object-cover" unoptimized />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Upload buttons */}
                    <div className="px-6 pt-12 pb-6 flex flex-wrap gap-3">
                        <label className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            Banner uploaden
                            <input type="file" name="banner" accept="image/*" className="sr-only" />
                        </label>
                        <label className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            Profielfoto uploaden
                            <input type="file" name="avatar" accept="image/*" className="sr-only" />
                        </label>
                    </div>
                </div>

                {/* ── Algemeen card ── */}
                <div className="bg-white rounded-xl border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="text-sm font-semibold text-gray-800">Algemeen</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Basisinformatie over je vereniging</p>
                    </div>
                    <div className="px-6 py-5 space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Naam
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                defaultValue={profile.name}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-shadow"
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Beschrijving
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                defaultValue={profile.description}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent resize-none transition-shadow"
                            />
                        </div>
                    </div>
                </div>

                {/* ── Contactgegevens card ── */}
                <div className="bg-white rounded-xl border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="text-sm font-semibold text-gray-800">Contactgegevens</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Hoe leden contact met je kunnen opnemen</p>
                    </div>
                    <div className="px-6 py-5 space-y-4">
                        {/* E-mail */}
                        <div>
                            <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1.5">
                                E-mailadres
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <input
                                    id="contactEmail"
                                    name="contactEmail"
                                    type="email"
                                    defaultValue={profile.societyContactInfo.contactEmail}
                                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-shadow"
                                />
                            </div>
                        </div>

                        {/* Telefoon */}
                        <div>
                            <label htmlFor="contactPhoneNumber" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Telefoonnummer
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <input
                                    id="contactPhoneNumber"
                                    name="contactPhoneNumber"
                                    type="tel"
                                    defaultValue={profile.societyContactInfo.contactPhoneNumber}
                                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-shadow"
                                />
                            </div>
                        </div>

                        {/* Website */}
                        <div>
                            <label htmlFor="contactWebsite" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Website
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                    </svg>
                                </div>
                                <input
                                    id="contactWebsite"
                                    name="contactWebsite"
                                    type="url"
                                    defaultValue={profile.societyContactInfo.societyWebsite ?? ''}
                                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-shadow"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Save button ── */}
                <div className="flex justify-end pb-2">
                    <button
                        type="submit"
                        className="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors shadow-sm"
                    >
                        Wijzigingen opslaan
                    </button>
                </div>

            </form>
        </div>
    );
}
