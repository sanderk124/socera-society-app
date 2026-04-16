export type EventMedia = {
    mediaKind: 'Avatar' | 'Banner';
    url: string;
};

export type EventRsvp = {
    id: string;
    userId: string;
    status: 'Going' | 'NotGoing';
};

export type SocietyEvent = {
    id: string;
    title: string;
    description: string;
    isPublic: boolean;
    isArchived: boolean;
    startsAt: string;
    endsAt: string;
    media: EventMedia[];
    rsvps: EventRsvp[];
    goingCount: number;
    notGoingCount: number;
};

export type CreateEventPayload = {
    title: string;
    description: string;
    startsAt: string;
    endsAt: string;
    isPublic: boolean;
};
