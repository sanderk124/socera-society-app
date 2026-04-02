import { getSocietyMemberships } from '@/services/memberships.services';
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
    const memberships = await getSocietyMemberships({ societyId: societyID });

    return (
        <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-gray-800 font-semibold">Leden ({memberships.length})</h2>
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
                    {memberships.map((member) => (
                        <tr key={member.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-gray-700 font-mono text-xs">{member.userId}</td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${roleColors[member.role] ?? 'bg-gray-100 text-gray-700'}`}>
                                    {member.role}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[member.status] ?? 'bg-gray-100 text-gray-700'}`}>
                                    {member.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-gray-500">
                                {new Date(member.joinedAt).toLocaleDateString('nl-NL', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {memberships.length === 0 && (
                <p className="px-6 py-8 text-center text-gray-400 text-sm">Geen leden gevonden.</p>
            )}
        </div>
    );
}