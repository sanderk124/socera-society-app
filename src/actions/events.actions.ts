'use server';

import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createEventAction(societyId: string, formData: FormData): Promise<void> {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
        throw new Error('Unauthorized');
    }

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const startsAt = formData.get('startsAt') as string;
    const endsAt = formData.get('endsAt') as string;
    const isPublic = formData.get('isPublic') === 'on';

    const response = await fetch(
        `${process.env.API_BASE_URL}/api/v1/societies/${societyId}/events`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                description,
                startsAt: new Date(startsAt).toISOString(),
                endsAt: new Date(endsAt).toISOString(),
                isPublic,
            }),
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to create event: ${response}`);
    }

    revalidatePath(`/society/${societyId}/evenementen`);
    redirect(`/society/${societyId}/evenementen`);
}

export async function updateEventAction(
    societyId: string,
    eventId: string,
    formData: FormData
): Promise<void> {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
        throw new Error('Unauthorized');
    }

    const base = process.env.API_BASE_URL;

    const avatar = formData.get('avatar') as File | null;
    if (avatar && avatar.size > 0) {
        const fd = new FormData();
        fd.append('file', avatar);
        const res = await fetch(`${base}/api/v1/societies/${societyId}/events/${eventId}/avatar`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${session.accessToken}` },
            body: fd,
        });
        if (!res.ok) throw new Error('Failed to upload avatar');
    }

    const banner = formData.get('banner') as File | null;
    if (banner && banner.size > 0) {
        const fd = new FormData();
        fd.append('file', banner);
        const res = await fetch(`${base}/api/v1/societies/${societyId}/events/${eventId}/banner`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${session.accessToken}` },
            body: fd,
        });
        if (!res.ok) throw new Error('Failed to upload banner');
    }

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const startsAt = formData.get('startsAt') as string;
    const endsAt = formData.get('endsAt') as string;
    const isPublic = formData.get('isPublic') === 'on';

    const response = await fetch(
        `${base}/api/v1/societies/${societyId}/events/${eventId}`,
        {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                description,
                startsAt: new Date(startsAt).toISOString(),
                endsAt: new Date(endsAt).toISOString(),
                isPublic,
            }),
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to update event: ${response.status}`);
    }

    revalidatePath(`/society/${societyId}/evenementen`);
    revalidatePath(`/society/${societyId}/evenementen/${eventId}`);
    redirect(`/society/${societyId}/evenementen`);
}

export async function deleteEventAction(societyId: string, eventId: string): Promise<void> {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
        throw new Error('Unauthorized');
    }

    const response = await fetch(
        `${process.env.API_BASE_URL}/api/v1/societies/${societyId}/events/${eventId}`,
        {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to delete event: ${response.status}`);
    }

    revalidatePath(`/society/${societyId}/evenementen`);
    redirect(`/society/${societyId}/evenementen`);
}

export async function deleteEventAvatarAction(societyId: string, eventId: string): Promise<void> {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
        throw new Error('Unauthorized');
    }

    const response = await fetch(
        `${process.env.API_BASE_URL}/api/v1/societies/${societyId}/events/${eventId}/avatar`,
        {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to delete event avatar: ${response.status}`);
    }

    revalidatePath(`/society/${societyId}/evenementen/${eventId}`);
}

export async function deleteEventBannerAction(societyId: string, eventId: string): Promise<void> {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
        throw new Error('Unauthorized');
    }

    const response = await fetch(
        `${process.env.API_BASE_URL}/api/v1/societies/${societyId}/events/${eventId}/banner`,
        {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to delete event banner: ${response.status}`);
    }

    revalidatePath(`/society/${societyId}/evenementen/${eventId}`);
}