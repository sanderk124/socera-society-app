'use server';

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveSettingsAction(societyId: string, formData: FormData) {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    const base = process.env.API_BASE_URL;

    const avatar = formData.get('avatar') as File | null;
    if (avatar && avatar.size > 0) {
        const fd = new FormData();
        fd.append('file', avatar);
        const res = await fetch(`${base}/api/v1/societies/${societyId}/profile/avatar`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: fd,
        });
        if (!res.ok) throw new Error('Failed to upload avatar');
    }

    const banner = formData.get('banner') as File | null;
    if (banner && banner.size > 0) {
        const fd = new FormData();
        fd.append('file', banner);
        const res = await fetch(`${base}/api/v1/societies/${societyId}/profile/banner`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: fd,
        });
        if (!res.ok) throw new Error('Failed to upload banner');
    }

    const res = await fetch(`${base}/api/v1/societies/${societyId}/profile`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: formData.get('name'),
            description: formData.get('description'),
            contactEmail: formData.get('contactEmail'),
            contactPhoneNumber: formData.get('contactPhoneNumber'),
            contactWebsite: formData.get('contactWebsite'),
        }),
    });
    if (!res.ok) throw new Error('Failed to update society profile');

    revalidatePath(`/society/${societyId}/instellingen`);
    redirect(`/society/${societyId}/instellingen?saved=true`);
}