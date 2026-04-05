export type MembershipDetails = {
    id: string;
    userId: string;
    societyId: string;
    role: 'Owner' | 'Admin' | 'Boardmember' | 'Member';
    status: 'Approved' | 'Pending' | 'Denied';
    joinedAt: string;
    isActive: boolean;
}

export type PaginatedMemberships = {
    items: MembershipDetails[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}