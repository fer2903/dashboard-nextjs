/**
 * Página: /dashboard/admin
 *
 * Administración de suscripciones a módulos. Solo accesible por admins
 * (requireAdminPage redirige a no-admins). La UI se monta en un componente
 * cliente que consume los endpoints /api/admin/users.
 */
import { requireAdminPage } from "@/app/src/lib/entitlements";
import SubscriptionsManager from "./SubscriptionsManager";

export default async function AdminPage() {
  await requireAdminPage();
  return <SubscriptionsManager />;
}
