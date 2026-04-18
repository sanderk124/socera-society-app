import Link from 'next/link';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getSocietyMember, getSocietyMemberships, approveMembership, denyMembership, deactivateMembership, updateMemberRole, updateMemberRoleAsOwner } from '@/services/memberships.services';
import { getMembershipDetails } from '@/services/user.services';
import { ROLES } from '@/constants/role.constant';
import { MEMBERSHIP_STATUS } from '@/constants/status.constant';
import { DeactivateButton } from './DeactivateButton';
import { RoleForm } from './RoleForm';

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

const adminRoles = [ROLES.MEMBER, ROLES.BOARDMEMBER, ROLES.ADMIN];
const ownerRoles = [ROLES.MEMBER, ROLES.BOARDMEMBER, ROLES.ADMIN, ROLES.OWNER];

const DEFAULT_MEMBERSHIP_PAGE_SIZE = 50;

export default async function MemberProfilePage({
    params,
    searchParams,
}: {
    params: Promise<{ societyID: string; userID: string }>;
    searchParams: Promise<{ membershipPageSize?: string }>;
}) {
    const { societyID, userID } = await params;
    const { membershipPageSize: membershipPageSizeParam } = await searchParams;
    const membershipPageSize = Math.max(
        DEFAULT_MEMBERSHIP_PAGE_SIZE,
        Number(membershipPageSizeParam) || DEFAULT_MEMBERSHIP_PAGE_SIZE
    );

    const [member, currentUserMembership, allMemberships] = await Promise.all([
        getSocietyMember({ societyId: societyID, userId: userID }),
        getMembershipDetails({ societyID }),
        getSocietyMemberships({ societyId: societyID, pageSize: membershipPageSize }),
    ]);

    // A user can have multiple membership rows (approved, pending re-apply, removed, etc.).
    // Approved beats everything; then Pending (actionable); then Denied; then Removed.
    const statusPriority: Record<string, number> = {
        [MEMBERSHIP_STATUS.APPROVED]: 0,
        [MEMBERSHIP_STATUS.PENDING]: 1,
        [MEMBERSHIP_STATUS.DENIED]: 2,
        [MEMBERSHIP_STATUS.REMOVED]: 3,
    };
    const userMemberships = allMemberships.items.filter(m => m.userId === userID);
    const membership = userMemberships.sort(
        (a, b) => (statusPriority[a.status] ?? 99) - (statusPriority[b.status] ?? 99)
    )[0] ?? member.membership;
    const hasMoreMemberships = allMemberships.totalCount > membershipPageSize;
    const avatar = member.profileMedia.find(m => m.mediaKind === 'Avatar');
    const isPending = membership.status === MEMBERSHIP_STATUS.PENDING;

    const isSelf = currentUserMembership?.userId === member.id;
    const cannotDeactivate = isSelf && membership.role === ROLES.OWNER;
    const currentUserIsOwner = currentUserMembership?.role === ROLES.OWNER;
    const availableRoles = currentUserIsOwner ? ownerRoles : adminRoles;

    async function handleApprove() {
        'use server';
        await approveMembership({ societyId: societyID, membershipId: membership.id });
        revalidatePath(`/society/${societyID}/user/${userID}`);
    }

    async function handleDeny() {
        'use server';
        await denyMembership({ societyId: societyID, membershipId: membership.id });
        revalidatePath(`/society/${societyID}/user/${userID}`);
    }

    async function handleDeactivate() {
        'use server';
        await deactivateMembership({ societyId: societyID, membershipId: membership.id });
        redirect(`/society/${societyID}/ledenbeheer`);
    }

    async function handleUpdateRole(newRole: string) {
        'use server';
        if (currentUserIsOwner) {
            await updateMemberRoleAsOwner({ societyId: societyID, membershipId: membership.id, newRole });
        } else {
            await updateMemberRole({ societyId: societyID, membershipId: membership.id, newRole });
        }
        revalidatePath(`/society/${societyID}/user/${userID}`);
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Back link */}
            <Link
                href={`/society/${societyID}/ledenbeheer`}
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                Terug naar ledenbeheer
            </Link>

            {/* Profile card */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="h-24 bg-gradient-to-r from-blue-500 to-indigo-600" />
                <div className="px-6 pb-6">
                    <div className="-mt-12 mb-4 flex items-end justify-between">
                        {avatar ? (
                            <img
                                src={avatar.url}
                                alt={member.displayName}
                                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow"
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-gray-200 border-4 border-white shadow flex items-center justify-center">
                                <span className="text-gray-500 text-2xl font-semibold">
                                    {member.firstName[0]}{member.lastName[0]}
                                </span>
                            </div>
                        )}
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${roleColors[membership.role] ?? 'bg-gray-100 text-gray-700'}`}>
                                {membership.role}
                            </span>
                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[membership.status] ?? 'bg-gray-100 text-gray-700'}`}>
                                {membership.status}
                            </span>
                        </div>
                    </div>

                    <h1 className="text-xl font-semibold text-gray-900">
                        {member.firstName} {member.lastName}
                    </h1>
                    <p className="text-sm text-gray-500">@{member.displayName}</p>
                </div>
            </div>

            {/* Details */}
            <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4">
                    <h2 className="text-sm font-semibold text-gray-700 mb-3">Persoonlijke gegevens</h2>
                    <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                        <div>
                            <dt className="text-gray-400">E-mail</dt>
                            <dd className="text-gray-800">{member.email}</dd>
                        </div>
                        <div>
                            <dt className="text-gray-400">Telefoonnummer</dt>
                            <dd className="text-gray-800">{member.phoneNumber}</dd>
                        </div>
                        <div>
                            <dt className="text-gray-400">Geboortedatum</dt>
                            <dd className="text-gray-800">
                                {new Date(member.dateOfBirth).toLocaleDateString('nl-NL', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-gray-400">Account actief</dt>
                            <dd>
                                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${member.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                    {member.isActive ? 'Actief' : 'Inactief'}
                                </span>
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

            {!isPending && hasMoreMemberships && (
                <div className="bg-white rounded-lg border border-gray-200 px-6 py-4 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Niet alle lidmaatschappen zijn geladen. Er kan een openstaand verzoek zijn.
                    </p>
                    <Link
                        href={`?membershipPageSize=${membershipPageSize + DEFAULT_MEMBERSHIP_PAGE_SIZE}`}
                        className="px-3 py-1.5 text-sm font-medium text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50 transition-colors"
                    >
                        Meer laden
                    </Link>
                </div>
            )}

            {isPending ? (
                /* Pending: accept / reject */
                <div className="bg-white rounded-lg border border-yellow-200">
                    <div className="px-6 py-4 border-b border-yellow-100">
                        <h2 className="text-sm font-semibold text-yellow-700">Lidmaatschapsverzoek</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Dit lid wacht op goedkeuring om toe te treden tot de society.</p>
                    </div>
                    <div className="px-6 py-4 flex items-center justify-end gap-3">
                        <form action={handleDeny}>
                            <button
                                type="submit"
                                className="px-4 py-2 border border-red-300 text-red-600 text-sm font-medium rounded-md hover:bg-red-50 transition-colors"
                            >
                                Afwijzen
                            </button>
                        </form>
                        <form action={handleApprove}>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
                            >
                                Accepteren
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <>
                    {/* Role management */}
                    <div className="bg-white rounded-lg border border-gray-200">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h2 className="text-sm font-semibold text-gray-700">Rol beheren</h2>
                        </div>
                        <div className="px-6 py-4">
                            <RoleForm
                                currentRole={membership.role}
                                availableRoles={availableRoles}
                                currentUserIsOwner={currentUserIsOwner}
                                action={handleUpdateRole}
                            />
                        </div>
                    </div>

                    {/* Danger zone */}
                    <div className="bg-white rounded-lg border border-red-200">
                        <div className="px-6 py-4 border-b border-red-100">
                            <h2 className="text-sm font-semibold text-red-700">Gevarenzone</h2>
                        </div>
                        <div className="px-6 py-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-800">Lid uitschrijven</p>
                                    <p className="text-xs text-gray-500">
                                        {cannotDeactivate
                                            ? 'Je kan jezelf niet uitschrijven als eigenaar.'
                                            : 'Verwijder dit lid uit de society.'}
                                    </p>
                                </div>
                                {cannotDeactivate ? (
                                    <button
                                        type="button"
                                        disabled
                                        className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md opacity-50 cursor-not-allowed"
                                        title="Je kan jezelf niet uitschrijven als eigenaar"
                                    >
                                        Uitschrijven
                                    </button>
                                ) : (
                                    <DeactivateButton
                                        action={handleDeactivate}
                                        memberName={`${member.firstName} ${member.lastName}`}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}