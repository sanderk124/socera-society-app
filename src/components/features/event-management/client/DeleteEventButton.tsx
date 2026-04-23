'use client';

import { useState, useTransition } from 'react';

type Props = {
    action: () => Promise<void>;
    eventTitle: string;
};

export function DeleteEventButton({ action, eventTitle }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [isPending, startTransition] = useTransition();

    function handleConfirm() {
        startTransition(async () => {
            await action();
        });
    }

    return (
        <>
            <button
                type="button"
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
                Evenement verwijderen
            </button>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setShowModal(false)}
                    />
                    <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-gray-900">Evenement verwijderen</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Weet je zeker dat je <span className="font-medium text-gray-700">{eventTitle}</span> wilt verwijderen? Dit kan niet ongedaan worden gemaakt.
                                </p>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                disabled={isPending}
                                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Annuleren
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirm}
                                disabled={isPending}
                                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                {isPending ? 'Verwijderen...' : 'Ja, verwijderen'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}