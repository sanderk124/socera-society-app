import { authOptions } from "@/lib/auth";
import { PaginatedMemberships, PaginatedSocietyMembers, SocietyMember } from "@/types/memberships.types";
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

export async function getSocietyMembers(params: {
    societyId: string;
    pageNumber?: number;
    pageSize?: number;
}): Promise<PaginatedSocietyMembers> {
    const { societyId, pageNumber, pageSize } = params;
    const session = await getServerSession(authOptions);

    const query = new URLSearchParams();
    if (pageNumber !== undefined) query.set('pageNumber', String(pageNumber));
    if (pageSize !== undefined) query.set('pageSize', String(pageSize));

    const url = `${process.env.API_BASE_URL}/api/v1/societies/${societyId}/members${query.size > 0 ? `?${query}` : ''}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${session?.accessToken}`,
            },
        });

        const data = await response.json();
        return data as PaginatedSocietyMembers;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to get society members: ' + error);
    }
}

export async function getSocietyMember(params: {
    societyId: string;
    userId: string;
}): Promise<SocietyMember> {
    const { societyId, userId } = params;
    const session = await getServerSession(authOptions);

    const url = `${process.env.API_BASE_URL}/api/v1/societies/${societyId}/members/${userId}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${session?.accessToken}`,
            },
        });

        const data = await response.json();
        return data as SocietyMember;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to get society member: ' + error);
    }
}

export async function approveMembership(params: {
    societyId: string;
    membershipId: string;
}): Promise<void> {
    const { societyId, membershipId } = params;
    const session = await getServerSession(authOptions);

    const url = `${process.env.API_BASE_URL}/api/v1/societies/${societyId}/memberships/${membershipId}/approve`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${session?.accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to approve membership: ${response.status}`);
    }
}

export async function denyMembership(params: {
    societyId: string;
    membershipId: string;
}): Promise<void> {
    const { societyId, membershipId } = params;
    const session = await getServerSession(authOptions);

    const url = `${process.env.API_BASE_URL}/api/v1/societies/${societyId}/memberships/${membershipId}/deny`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${session?.accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to deny membership: ${response.status}`);
    }
}

export async function updateMemberRole(params: {
    societyId: string;
    membershipId: string;
    newRole: string;
}): Promise<void> {
    const { societyId, membershipId, newRole } = params;
    const session = await getServerSession(authOptions);

    const url = `${process.env.API_BASE_URL}/api/v1/societies/${societyId}/memberships/${membershipId}/roles`;

    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${session?.accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newRole }),
    });

    if (!response.ok) {
        throw new Error(`Failed to update member role: ${response.status}`);
    }
}

export async function updateMemberRoleAsOwner(params: {
    societyId: string;
    membershipId: string;
    newRole: string;
}): Promise<void> {
    const { societyId, membershipId, newRole } = params;
    const session = await getServerSession(authOptions);

    const url = `${process.env.API_BASE_URL}/api/v1/societies/${societyId}/memberships/${membershipId}/roles/ownership`;

    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${session?.accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newRole }),
    });

    if (!response.ok) {
        throw new Error(`Failed to update member role as owner: ${response.status}`);
    }
}

export async function deactivateMembership(params: {
    societyId: string;
    membershipId: string;
}): Promise<void> {
    const { societyId, membershipId } = params;
    const session = await getServerSession(authOptions);

    const url = `${process.env.API_BASE_URL}/api/v1/societies/${societyId}/memberships/${membershipId}/deactivate`;

    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${session?.accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to deactivate membership: ${response.status}`);
    }
}