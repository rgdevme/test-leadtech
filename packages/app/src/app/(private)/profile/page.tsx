import { ProfilePage as ProfilePageView } from "@/components/pages/ProfilePage";
import { requireSessionPrincipal } from "@/guards/authentication";
import { getSubscription } from "@/repositories/subscriptions";

export default async function ProfilePage() {
  const principal = await requireSessionPrincipal();
  const subscription = await getSubscription(principal.uid);

  return <ProfilePageView principal={principal} subscription={subscription} />;
}
