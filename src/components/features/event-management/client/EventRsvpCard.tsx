'use client';

import { useState } from 'react';
import Link from 'next/link';
import { EventRsvp } from '@/types/events.types';
import { SocietyMember } from '@/types/memberships.types';

const PENDING_PAGE_SIZE = 20;

type Tab = 'going' | 'maybe' | 'notgoing' | 'pending';

type Props = {
    rsvps: EventRsvp[];
    members: SocietyMember[];
    societyId: string;
};

export function EventRsvpCard({ rsvps, members, societyId }: Props) {
    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>('going');
    const [pendingVisible, setPendingVisible] = useState(PENDING_PAGE_SIZE);

    const respondedIds = new Set(rsvps.map(r => r.userId));
    const memberMap = new Map(members.map(m => [m.id, m]));

    const byTab = {
        going:    rsvps.filter(r => r.status === 'Going'),
        maybe:    rsvps.filter(r => r.status === 'Maybe'),
        notgoing: rsvps.filter(r => r.status === 'NotGoing'),
        pending:  members.filter(m => !respondedIds.has(m.id)),
    };

    const tabs: { key: Tab; label: string }[] = [
        { key: 'going',    label: `Gaan (${byTab.going.length})` },
        { key: 'maybe',    label: `Misschien (${byTab.maybe.length})` },
        { key: 'notgoing', label: `Gaan niet (${byTab.notgoing.length})` },
        { key: 'pending',  label: `Niet gereageerd (${byTab.pending.length})` },
    ];

    const emptyMessages: Record<Tab, string> = {
        going:    'Niemand heeft zich aangemeld.',
        maybe:    'Niemand heeft misschien aangegeven.',
        notgoing: 'Niemand heeft zich afgemeld.',
        pending:  'Iedereen heeft gereageerd.',
    };

    function renderRow(userId: string, displayName: string) {
        return (
            <Link
                key={userId}
                href={`/society/${societyId}/user/${userId}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors"
            >
                <span className="text-sm text-gray-700 truncate">{displayName}</span>
            </Link>
        );
    }

    function renderRsvpRows() {
        const current = byTab[activeTab as 'going' | 'maybe' | 'notgoing'];
        return current.map(rsvp => {
            const member = memberMap.get(rsvp.userId);
            const name = member ? `${member.firstName} ${member.lastName}` : rsvp.userId;
            return renderRow(rsvp.userId, name);
        });
    }

    function renderPendingRows() {
        const visible = byTab.pending.slice(0, pendingVisible);
        const hasMore = byTab.pending.length > pendingVisible;

        return (
            <>
                {visible.map(member =>
                    renderRow(member.id, `${member.firstName} ${member.lastName}`)
                )}
                {hasMore && (
                    <div className="flex justify-center py-2 border-t border-gray-50">
                        <button
                            type="button"
                            onClick={() => setPendingVisible(v => v + PENDING_PAGE_SIZE)}
                            className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                            title="Laad meer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                        </button>
                    </div>
                )}
            </>
        );
    }

    const isEmpty = byTab[activeTab].length === 0;

    return (
        <>
            {/* Trigger button */}
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
                Bekijk aanwezigen
            </button>

            {/* Dialog backdrop */}
            {open && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
                    onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}
                >
                    <div className="bg-white rounded-xl border border-gray-200 w-full max-w-2xl max-h-[80vh] flex flex-col shadow-xl">
                        {/* Dialog header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
                            <div>
                                <h2 className="text-sm font-semibold text-gray-800">Aanwezigheid</h2>
                                <p className="text-xs text-gray-500 mt-0.5">{rsvps.length} reacties</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="grid grid-cols-4 border-b border-gray-100 shrink-0">
                            {tabs.map(t => (
                                <button
                                    key={t.key}
                                    type="button"
                                    onClick={() => {
                                        setActiveTab(t.key);
                                        if (t.key !== 'pending') setPendingVisible(PENDING_PAGE_SIZE);
                                    }}
                                    className={`py-2.5 px-2 text-xs font-medium transition-colors border-b-2 -mb-px text-center ${
                                        activeTab === t.key
                                            ? 'border-blue-600 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        {/* List */}
                        <div className="overflow-y-auto divide-y divide-gray-50">
                            {isEmpty ? (
                                <p className="px-6 py-8 text-xs text-gray-400 text-center">
                                    {emptyMessages[activeTab]}
                                </p>
                            ) : activeTab === 'pending' ? (
                                renderPendingRows()
                            ) : (
                                renderRsvpRows()
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}