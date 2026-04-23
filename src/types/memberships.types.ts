export type MembershipDetails = {
    id: string;
    userId: string;
    societyId: string;
    role: 'Owner' | 'Admin' | 'Boardmember' | 'Member';
    status: 'Approved' | 'Pending' | 'Denied' | 'Removed';
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

export type ProfileMedia = {
    mediaKind: string;
    url: string;
}

export type SocietyMember = {
    id: string;
    firstName: string;
    lastName: string;
    displayName: string;
    dateOfBirth: string;
    phoneNumber: string;
    email: string;
    isActive: boolean;
    profileMedia: ProfileMedia[];
    membership: MembershipDetails;
}

export type PaginatedSocietyMembers = {
    items: SocietyMember[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}