import { z } from "zod";

export const tenantInviteSchema = z.object({
    tenantEmail: z.string().email(),
});

export type TenantInviteFormValues = z.infer<typeof tenantInviteSchema>;
