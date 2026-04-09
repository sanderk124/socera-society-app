export type SocietyProfile = {
    id: string;
    name: string;
    description: string;
    kvkNumber: string;
    memberCount: number;
    createdAt: string;
    societyContactInfo: {
        contactPhoneNumber: string;
        contactEmail: string;
        societyWebsite: string | null;
    };
    societyAddress: {
        street: string;
        houseNumber: string;
        houseNumberAddition: string | null;
        postalCode: string;
        city: string;
        country: string;
    };
    profileMedia: {
        mediaKind: 'Banner' | 'Avatar';
        url: string;
    }[];
};

export type SocietyStatusData = {
    societyId: string
    name: string
    status: 'Approved' | 'Pending' | 'Denied'
    isActive: boolean
    createdAt: string
}

export type SocietyStatusResult =
    | { found: true; data: SocietyStatusData }
    | { found: false }