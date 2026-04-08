import Link from 'next/link';
import { Clock } from 'lucide-react';
import { type SocietyMember } from '@/types/memberships.types';

type Props = {
    members: SocietyMember[];
    societyID: string;
};

export function PendingMembersCard({ members, societyID }: Props) {
    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-700">Openstaande verzoeken</h2>
                {members.length > 0 && (
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
                        {members.length}
                    </span>
                )}
            </div>

            {members.length === 0 ? (
                <div className="px-5 py-8 text-center">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2">
                        <Clock size={18} className="text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-400">Geen openstaande verzoeken.</p>
                </div>
            ) : (
                <ul className="divide-y divide-gray-100">
                    {members.map(member => {
                        const avatar = member.profileMedia.find(m => m.mediaKind === 'Avatar');
                        return (
                            <li key={member.id}>
                                <Link
                                    href={`/society/${societyID}/user/${member.id}`}
                                    className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors group"
                                >
                                    {avatar ? (
                                        <img
                                            src={avatar.url}
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
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-gray-800 truncate group-hover:text-blue-600">
                                            {member.firstName} {member.lastName}
                                        </p>
                                        <p className="text-xs text-gray-400 truncate">@{member.displayName}</p>
                                    </div>
                                    <span className="text-xs text-gray-400 flex-shrink-0">
                                        {new Date(member.membership.joinedAt).toLocaleDateString('nl-NL', {
                                            day: 'numeric', month: 'short',
                                        })}
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            )}

            {members.length > 0 && (
                <div className="px-5 py-3 border-t border-gray-100">
                    <Link
                        href={`/society/${societyID}/ledenbeheer`}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Bekijk alle leden →
                    </Link>
                </div>
            )}
        </div>
    );
}