import Link from 'next/link';
import { getSocietyMembers, getSocietyMemberships } from '@/services/memberships.services';
import { ROLES } from '@/constants/role.constant';
import { MEMBERSHIP_STATUS } from '@/constants/status.constant';

const roleColors: Record<string, string> = {
    [ROLES.OWNER]: 'bg-purple-100 text-purple-700',
    [ROLES.ADMIN]: 'bg-blue-100 text-blue-700',
    [ROLES.BOARDMEMBER]: 'bg-indigo-100 text-indigo-700',
    [ROLES.MEMBER]: 'bg-gray-100 text-gray-700',
};

const statusColors: Record<string, string> = {
    [MEMBERSHIP_STATUS.APPROVED]: 'bg-green-100 text-green-700',
    [MEMBERSHIP_STATUS.PENDING]: 'bg-yellow-100 text-yellow-700',
    [MEMBERSHIP_STATUS.DENIED]: 'bg-red-100 text-red-700',
};

type Tab = 'active' | 'pending' | 'denied';

export default async function MembersPage({
    params,
    searchParams,
}: {
    params: Promise<{ societyID: string }>;
    searchParams: Promise<{ tab?: string }>;
}) {
    const { societyID } = await params;
    const { tab } = await searchParams;
    const activeTab: Tab = tab === 'pending' ? 'pending' : tab === 'denied' ? 'denied' : 'active';

    // Fetch all members for user profile data, and ALL memberships (including duplicates per user)
    const [members, memberships] = await Promise.all([
        getSocietyMembers({ societyId: societyID, pageSize: 1000 }),
        getSocietyMemberships({ societyId: societyID, pageSize: 1000 }),
    ]);

    // Build userId → user profile map (name, avatar, etc.)
    const userMap = new Map(
        members.items.map(m => [m.id, {
            firstName: m.firstName,
            lastName: m.lastName,
            displayName: m.displayName,
            profileMedia: m.profileMedia,
        }])
    );

    // Enrich all membership records with user profile data
    const enriched = memberships.items.map(membership => ({
        ...membership,
        user: userMap.get(membership.userId) ?? null,
    }));

    const byStatus = {
        active: enriched.filter(m => m.status === MEMBERSHIP_STATUS.APPROVED),
        pending: enriched.filter(m => m.status === MEMBERSHIP_STATUS.PENDING),
        denied: enriched.filter(m => m.status === MEMBERSHIP_STATUS.DENIED),
    };

    const currentItems = byStatus[activeTab];

    const tabs: { key: Tab; label: string; count: number }[] = [
        { key: 'active', label: 'Actieve leden', count: byStatus.active.length },
        { key: 'pending', label: 'Pending leden', count: byStatus.pending.length },
        { key: 'denied', label: 'Afgewezen aanvragen', count: byStatus.denied.length },
    ];

    const emptyMessages: Record<Tab, string> = {
        active: 'Geen actieve leden gevonden.',
        pending: 'Geen openstaande verzoeken.',
        denied: 'Geen afgewezen aanvragen.',
    };

    return (
        <div className="space-y-0 pt-4">
            {/* Tab navigation */}
            <div className="bg-white rounded-t-lg border border-gray-200 border-b-0 px-6 pt-4 flex items-center gap-1">
                {tabs.map(t => (
                    <Link
                        key={t.key}
                        href={`?tab=${t.key}`}
                        className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                            activeTab === t.key
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        {t.label}
                        <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
                            activeTab === t.key ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                        }`}>
                            {t.count}
                        </span>
                    </Link>
                ))}
                <div className="ml-auto pb-2">
                    <a
                        href={`/api/societies/${societyID}/memberships/export`}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                        Exporteer ledenlijst
                    </a>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-b-lg border border-gray-200">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-200 text-left text-gray-500 text-xs uppercase tracking-wide">
                            <th className="px-6 py-3">Gebruiker</th>
                            <th className="px-6 py-3">Rol</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Lid sinds</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {currentItems.map((membership) => {
                            const user = membership.user;
                            return (
                                <tr key={membership.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        {user ? (
                                            <Link
                                                href={`/society/${societyID}/user/${membership.userId}`}
                                                className="flex items-center gap-3 group"
                                            >
                                                {user.profileMedia.find(m => m.mediaKind === 'Avatar') ? (
                                                    <img
                                                        src={user.profileMedia.find(m => m.mediaKind === 'Avatar')!.url}
                                                        alt={user.displayName}
                                                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                                    />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                                                        <span className="text-gray-500 text-xs font-medium">
                                                            {user.firstName[0]}{user.lastName[0]}
                                                        </span>
                                                    </div>
                                                )}
                                                <span className="text-gray-700 font-medium group-hover:text-blue-600">
                                                    {user.firstName} {user.lastName}
                                                </span>
                                            </Link>
                                        ) : (
                                            <span className="text-gray-400 text-xs italic">Onbekende gebruiker</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${roleColors[membership.role] ?? 'bg-gray-100 text-gray-700'}`}>
                                            {membership.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[membership.status] ?? 'bg-gray-100 text-gray-700'}`}>
                                            {membership.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {new Date(membership.joinedAt).toLocaleDateString('nl-NL', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {currentItems.length === 0 && (
                    <p className="px-6 py-8 text-center text-gray-400 text-sm">
                        {emptyMessages[activeTab]}
                    </p>
                )}
            </div>
        </div>
    );
}