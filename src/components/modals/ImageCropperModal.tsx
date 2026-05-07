'use client';

import { useState, useCallback } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { getCroppedImg } from '@/lib/cropImage';

type Props = {
    image: string;
    aspect: number;
    cropShape?: 'rect' | 'round';
    open: boolean;
    title?: string;
    onComplete: (croppedImage: File) => void;
    onCancel: () => void;
};

export function ImageCropperModal({
    image,
    aspect,
    cropShape = 'rect',
    open,
    title = 'Afbeelding bijsnijden',
    onComplete,
    onCancel,
}: Props) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const onCropComplete = useCallback((_: Area, pixels: Area) => {
        setCroppedAreaPixels(pixels);
    }, []);

    async function handleComplete() {
        if (!croppedAreaPixels) return;
        setIsProcessing(true);
        try {
            const file = await getCroppedImg(image, croppedAreaPixels);
            onComplete(file);
        } catch (e) {
            console.error(e);
        } finally {
            setIsProcessing(false);
        }
    }

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onCancel}
            />

            {/* Modal */}
            <div className="relative z-10 bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 overflow-hidden">
                {/* Header */}
                <div className="px-5 py-4 border-b border-gray-100">
                    <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
                    <p className="text-xs text-gray-500 mt-0.5">Versleep en zoom om de afbeelding aan te passen</p>
                </div>

                {/* Cropper */}
                <div className="relative h-72 bg-gray-900">
                    <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspect}
                        cropShape={cropShape}
                        showGrid={false}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                    />
                </div>

                {/* Zoom slider */}
                <div className="px-5 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 w-8">Zoom</span>
                        <input
                            type="range"
                            min={1}
                            max={3}
                            step={0.01}
                            value={zoom}
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="flex-1 h-1.5 appearance-none bg-gray-200 rounded-full cursor-pointer accent-gray-900"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="px-5 py-4 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        Annuleren
                    </button>
                    <button
                        type="button"
                        onClick={handleComplete}
                        disabled={isProcessing}
                        className="px-4 py-2 text-xs font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                        {isProcessing ? 'Bezig...' : 'Toepassen'}
                    </button>
                </div>
            </div>
        </div>
    );
}