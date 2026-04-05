import { authOptions } from "@/lib/auth";
import { PaginatedMemberships } from "@/types/memberships.types";
import { getServerSession } from "next-auth";

export async function getSocietyMemberships(params: {
    societyId: string;
    pageNumber?: number;
    pageSize?: number;
}): Promise<PaginatedMemberships> {
    const { societyId, pageNumber, pageSize } = params;
    const session = await getServerSession(authOptions);

    const query = new URLSearchParams();
    if (pageNumber !== undefined) query.set('pageNumber', String(pageNumber));
    if (pageSize !== undefined) query.set('pageSize', String(pageSize));

    const url = `${process.env.API_BASE_URL}/api/v1/societies/${societyId}/memberships${query.size > 0 ? `?${query}` : ''}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${session?.accessToken}`,
            },
        });

        const data = await response.json();
        return data as PaginatedMemberships;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to get society memberships: ' + error);
    }
}