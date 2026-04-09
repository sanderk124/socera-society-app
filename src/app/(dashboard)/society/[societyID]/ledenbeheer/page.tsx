import Link from 'next/link';
import { getSocietyMembers } from '@/services/memberships.services';
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

export default async function MembersPage({ params }: { params: Promise<{ societyID: string }> }) {
    const { societyID } = await params;
    const members = await getSocietyMembers({ societyId: societyID });

    return (
        <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-gray-800 font-semibold">Leden ({members.totalCount})</h2>
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
                    {members.items.map((member) => (
                        <tr key={member.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                                <Link
                                    href={`/society/${societyID}/user/${member.id}`}
                                    className="flex items-center gap-3 group"
                                >
                                    {member.profileMedia.find(m => m.mediaKind === 'Avatar') ? (
                                        <img
                                            src={member.profileMedia.find(m => m.mediaKind === 'Avatar')!.url}
                                            alt={member.displayName}
                                            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                                            <span className="text-gray-500 text-xs font-medium">
                                                {member.firstName[0]}{member.lastName[0]}
                                            </span>
                                        </div>
                                    )}
                                    <span className="text-gray-700 font-medium group-hover:text-blue-600">
                                        {member.firstName} {member.lastName}
                                    </span>
                                </Link>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${roleColors[member.membership.role] ?? 'bg-gray-100 text-gray-700'}`}>
                                    {member.membership.role}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[member.membership.status] ?? 'bg-gray-100 text-gray-700'}`}>
                                    {member.membership.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-gray-500">
                                {new Date(member.membership.joinedAt).toLocaleDateString('nl-NL', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {members.items.length === 0 && (
                <p className="px-6 py-8 text-center text-gray-400 text-sm">Geen leden gevonden.</p>
            )}
        </div>
    );
}