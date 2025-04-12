import { getCurrentUser } from "@/lib/auth/session";
import ProfileClient from './profile-client';

export const runtime = 'nodejs';

export default async function ProfilePage() {
    const user = await getCurrentUser();
    return <ProfileClient user={user} />;
}
