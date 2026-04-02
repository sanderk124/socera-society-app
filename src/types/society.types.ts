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