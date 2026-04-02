import { authOptions } from "@/lib/auth";
import { MembershipDetails } from "@/types/memberships.types";
import { getServerSession } from "next-auth";

export async function getSocietyMemberships(params: { societyId: string }): Promise<MembershipDetails[]> {
    const { societyId } = params;
    const session = await getServerSession(authOptions);
    const endpoint = `/api/v1/societies/${societyId}/memberships`;
    const URL = `${process.env.API_BASE_URL}${endpoint}`;
    console.log(URL);

    try {
        const response = await fetch(URL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${session?.accessToken}`,
            },
        });
        console.log( "response:", response);

        const data = await response.json();
        return data as MembershipDetails[];
    } catch (error) {
        console.error(error);
        throw new Error('Failed to get society memberships: ' + error);
    }
}