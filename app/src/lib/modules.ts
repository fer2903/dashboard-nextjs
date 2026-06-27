/**
 * Registro de módulos (micro-frontends)
 *
 * Única fuente de verdad sobre los módulos que requieren suscripción.
 * Lo consumen: el modelo User (enum), la capa de entitlements, los guards
 * de página, las APIs y (a futuro) el Sidebar y la administración.
 *
 * Para agregar un nuevo MFE: añade una entrada aquí y todo lo demás
 * (validación, control de acceso) queda alineado.
 */

export type ModuleKey = "transactions" | "products" | "alerts";

export type AppModule = {
  /** Clave estable usada como entitlement (debe coincidir con User.subscriptions) */
  key: ModuleKey;
  /** Etiqueta para UI */
  label: string;
  /** Ruta dentro del host */
  route: string;
  /** Prefijo de las rutas API del módulo */
  apiPrefix: string;
  /** Si true, el usuario debe estar suscrito para acceder */
  requiresSubscription: boolean;
};

export const MODULES: AppModule[] = [
  {
    key: "transactions",
    label: "Transacciones",
    route: "/dashboard/transactions",
    apiPrefix: "/api/transactions",
    requiresSubscription: true,
  },
  {
    key: "products",
    label: "Productos",
    route: "/dashboard/products",
    apiPrefix: "/api/products",
    requiresSubscription: true,
  },
  {
    key: "alerts",
    label: "Alertas",
    route: "/dashboard/alerts",
    apiPrefix: "/api/alerts",
    requiresSubscription: true,
  },
];

/** Todas las keys de módulo conocidas */
export const MODULE_KEYS: ModuleKey[] = MODULES.map((m) => m.key);

/** Keys de módulos que requieren suscripción (validables como entitlement) */
export const SUBSCRIBABLE_KEYS: ModuleKey[] = MODULES.filter(
  (m) => m.requiresSubscription
).map((m) => m.key);

/** Busca un módulo por su key */
export const getModuleByKey = (key: string): AppModule | undefined =>
  MODULES.find((m) => m.key === key);

/** Type guard: ¿este string es una ModuleKey válida? */
export const isModuleKey = (value: string): value is ModuleKey =>
  (MODULE_KEYS as string[]).includes(value);
