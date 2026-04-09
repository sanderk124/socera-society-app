import { ROLES } from "@/constants/role.constant";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { MembershipDetails } from "@/types/memberships.types";

export async function getMembershipDetails(params: { societyID: string }): Promise<MembershipDetails | null> {
    const session = await getServerSession(authOptions);
    const url = `${process.env.API_BASE_URL}/api/v1/societies/${params.societyID}/memberships/me`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${session?.accessToken}`,
        },
    });

    if (response.status === 404) return null;

    if (!response.ok) {
        throw new Error(`Failed to get membership details: ${response.status}`);
    }

    return response.json() as Promise<MembershipDetails>;
}

export async function isAdminOrOwner(params: { societyID: string }): Promise<boolean> {
    const membership = await getMembershipDetails(params);
    if (!membership) return false;
    return membership.role === ROLES.ADMIN || membership.role === ROLES.OWNER;
}