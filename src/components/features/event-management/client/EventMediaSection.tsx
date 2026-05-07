'use client';

import { useRef, useState, useTransition } from 'react';
import { ImageCropperModal } from '@/components/modals/ImageCropperModal';

type Props = {
    currentAvatarUrl: string | null;
    currentBannerUrl: string | null;
    deleteAvatarAction: () => Promise<void>;
    deleteBannerAction: () => Promise<void>;
};

export function EventMediaSection({
    currentAvatarUrl,
    currentBannerUrl,
    deleteAvatarAction,
    deleteBannerAction,
}: Props) {
    const [avatarPreview, setAvatarPreview] = useState<string | null>(currentAvatarUrl);
    const [bannerPreview, setBannerPreview] = useState<string | null>(currentBannerUrl);
    const [isPendingAvatar, startAvatarTransition] = useTransition();
    const [isPendingBanner, startBannerTransition] = useTransition();
    const [avatarSuccess, setAvatarSuccess] = useState(false);
    const [bannerSuccess, setBannerSuccess] = useState(false);

    const [cropperImage, setCropperImage] = useState<string | null>(null);
    const [cropperMode, setCropperMode] = useState<'avatar' | 'banner' | null>(null);

    const avatarInputRef = useRef<HTMLInputElement>(null);
    const bannerInputRef = useRef<HTMLInputElement>(null);
    const avatarFileRef = useRef<DataTransfer | null>(null);
    const bannerFileRef = useRef<DataTransfer | null>(null);
    const avatarTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const bannerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setCropperImage(URL.createObjectURL(file));
        setCropperMode('avatar');
        e.target.value = '';
    }

    function handleBannerChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setCropperImage(URL.createObjectURL(file));
        setCropperMode('banner');
        e.target.value = '';
    }

    function handleCropComplete(croppedFile: File) {
        const dt = new DataTransfer();
        dt.items.add(croppedFile);

        if (cropperMode === 'avatar' && avatarInputRef.current) {
            avatarFileRef.current = dt;
            avatarInputRef.current.files = dt.files;
            setAvatarPreview(URL.createObjectURL(croppedFile));
            setAvatarSuccess(true);
            if (avatarTimerRef.current) clearTimeout(avatarTimerRef.current);
            avatarTimerRef.current = setTimeout(() => setAvatarSuccess(false), 3000);
        } else if (cropperMode === 'banner' && bannerInputRef.current) {
            bannerFileRef.current = dt;
            bannerInputRef.current.files = dt.files;
            setBannerPreview(URL.createObjectURL(croppedFile));
            setBannerSuccess(true);
            if (bannerTimerRef.current) clearTimeout(bannerTimerRef.current);
            bannerTimerRef.current = setTimeout(() => setBannerSuccess(false), 3000);
        }

        closeCropper();
    }

    function closeCropper() {
        setCropperImage(null);
        setCropperMode(null);
    }

    function handleDeleteAvatar() {
        startAvatarTransition(async () => {
            await deleteAvatarAction();
            setAvatarPreview(null);
            if (avatarInputRef.current) avatarInputRef.current.value = '';
        });
    }

    function handleDeleteBanner() {
        startBannerTransition(async () => {
            await deleteBannerAction();
            setBannerPreview(null);
            if (bannerInputRef.current) bannerInputRef.current.value = '';
        });
    }

    return (
        <>
            {cropperImage && cropperMode && (
                <ImageCropperModal
                    open
                    image={cropperImage}
                    aspect={cropperMode === 'avatar' ? 1 : 16 / 9}
                    cropShape={cropperMode === 'avatar' ? 'round' : 'rect'}
                    title={cropperMode === 'avatar' ? 'Avatar bijsnijden' : 'Banner bijsnijden'}
                    onComplete={handleCropComplete}
                    onCancel={closeCropper}
                />
            )}

            <div className="space-y-4">
                {/* Banner */}
                <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Banner</p>
                    <div className="relative h-36 rounded-lg overflow-hidden bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-200">
                        {bannerPreview ? (
                            <img
                                src={bannerPreview}
                                alt="Banner preview"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <p className="text-xs text-gray-400">Geen banner ingesteld</p>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            Banner uploaden
                            <input
                                ref={bannerInputRef}
                                type="file"
                                name="banner"
                                accept="image/*"
                                className="sr-only"
                                onChange={handleBannerChange}
                            />
                        </label>
                        {bannerPreview && (
                            <button
                                type="button"
                                onClick={handleDeleteBanner}
                                disabled={isPendingBanner}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                            >
                                {isPendingBanner ? 'Verwijderen...' : 'Verwijderen'}
                            </button>
                        )}
                        {bannerSuccess && (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Upload succesvol
                            </span>
                        )}
                    </div>
                </div>

                {/* Avatar */}
                <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Avatar</p>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                            {avatarPreview ? (
                                <img
                                    src={avatarPreview}
                                    alt="Avatar preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                Avatar uploaden
                                <input
                                    ref={avatarInputRef}
                                    type="file"
                                    name="avatar"
                                    accept="image/*"
                                    className="sr-only"
                                    onChange={handleAvatarChange}
                                />
                            </label>
                            {avatarPreview && (
                                <button
                                    type="button"
                                    onClick={handleDeleteAvatar}
                                    disabled={isPendingAvatar}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                                >
                                    {isPendingAvatar ? 'Verwijderen...' : 'Verwijderen'}
                                </button>
                            )}
                            {avatarSuccess && (
                                <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Upload succesvol
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}