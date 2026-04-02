import { ROLES } from "@/constants/role.constant";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { MembershipDetails } from "@/types/memberships.types";

export async function getMembershipDetails(params: { societyID: string }) {
    const societyID = params.societyID;
    const session = await getServerSession(authOptions);
    const endpoint = `/api/v1/societies/${societyID}/memberships/me`;

    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${session?.accessToken}`,
            },
        });
        console.log( "response:", response);
        const data = await response.json();
        return data as MembershipDetails;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to get membership details: ' + error);
    }

}

export async function isAdminOrOwner(params: { societyID: string }) {
    const membershipDetails = await getMembershipDetails(params);
    return membershipDetails.role === ROLES.ADMIN || membershipDetails.role === ROLES.OWNER;
}