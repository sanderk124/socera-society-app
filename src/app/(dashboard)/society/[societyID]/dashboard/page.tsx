import Link from 'next/link';
import { Users, UserCheck, CalendarDays, Clock, MapPin } from 'lucide-react';
import { getSocietyMembers } from '@/services/memberships.services';
import { MEMBERSHIP_STATUS } from '@/constants/status.constant';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Calendar } from '@/components/dashboard/Calendar';
import { PendingMembersCard } from '@/components/dashboard/PendingMembersCard';

export default async function SocietyDashboard({ params }: { params: Promise<{ societyID: string }> }) {
    const { societyID } = await params;

    const membersData = await getSocietyMembers({ societyId: societyID, pageSize: 100 });

    const pendingMembers = membersData.items.filter(
        m => m.membership.status === MEMBERSHIP_STATUS.PENDING
    );
    const activeMembers = membersData.items.filter(
        m => m.membership.status === MEMBERSHIP_STATUS.APPROVED && m.membership.isActive
    );

    return (
        <div className="space-y-6 pt-4">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    label="Totaal leden"
                    value={membersData.totalCount}
                    icon={Users}
                    iconBg="bg-blue-50"
                    iconColor="text-blue-600"
                />
                <StatsCard
                    label="Actieve leden"
                    value={activeMembers.length}
                    icon={UserCheck}
                    iconBg="bg-green-50"
                    iconColor="text-green-600"
                />
                <StatsCard
                    label="Openstaande verzoeken"
                    value={pendingMembers.length}
                    icon={Clock}
                    iconBg="bg-yellow-50"
                    iconColor="text-yellow-600"
                />
                <StatsCard
                    label="Aankomende evenementen"
                    value={3}
                    icon={CalendarDays}
                    iconBg="bg-purple-50"
                    iconColor="text-purple-600"
                    sub="deze maand"
                />
            </div>

            {/* Calendar + Pending members */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-3">
                    <Calendar />
                </div>
                <div className="lg:col-span-2">
                    <PendingMembersCard members={pendingMembers} societyID={societyID} />
                </div>
            </div>

            {/* Quick links */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link
                    href={`/society/${societyID}/ledenbeheer`}
                    className="bg-white rounded-lg border border-gray-200 px-5 py-4 flex items-center gap-3 hover:bg-gray-50 hover:border-gray-300 transition-colors group"
                >
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <Users size={18} className="text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-800 group-hover:text-blue-600">Ledenbeheer</p>
                        <p className="text-xs text-gray-400">Beheer leden en rollen</p>
                    </div>
                </Link>
                <Link
                    href={`/society/${societyID}/evenementen`}
                    className="bg-white rounded-lg border border-gray-200 px-5 py-4 flex items-center gap-3 hover:bg-gray-50 hover:border-gray-300 transition-colors group"
                >
                    <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                        <CalendarDays size={18} className="text-purple-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-800 group-hover:text-purple-600">Evenementen</p>
                        <p className="text-xs text-gray-400">Plan en beheer evenementen</p>
                    </div>
                </Link>
                <Link
                    href={`/society/${societyID}/instellingen`}
                    className="bg-white rounded-lg border border-gray-200 px-5 py-4 flex items-center gap-3 hover:bg-gray-50 hover:border-gray-300 transition-colors group"
                >
                    <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <MapPin size={18} className="text-gray-500" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-800 group-hover:text-gray-700">Instellingen</p>
                        <p className="text-xs text-gray-400">Profiel en contactgegevens</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}