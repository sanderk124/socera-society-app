import { authOptions } from '@/lib/auth';
import { SocietyEvent } from '@/types/events.types';
import { getServerSession } from 'next-auth';

export async function getSocietyEvents(params: { societyId: string }): Promise<SocietyEvent[]> {
    const { societyId } = params;
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
        throw new Error('Unauthorized');
    }

    const response = await fetch(
        `${process.env.API_BASE_URL}/api/v1/societies/${societyId}/events`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
            },
            cache: 'no-store',
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to get society events: ${response.status}`);
    }

    return response.json() as Promise<SocietyEvent[]>;
}

export async function getEventById(params: { societyId: string; eventId: string }): Promise<SocietyEvent> {
    const { societyId, eventId } = params;
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
        throw new Error('Unauthorized');
    }

    const response = await fetch(
        `${process.env.API_BASE_URL}/api/v1/societies/${societyId}/events/${eventId}`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
            },
            cache: 'no-store',
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to get event: ${response.status}`);
    }

    return response.json() as Promise<SocietyEvent>;
}