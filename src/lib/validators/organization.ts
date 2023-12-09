import { z } from "zod";

export const OrganizationValidator = z.object({
  name: z.string().min(3).max(21),
});

export const OrganizationSubscriptionValidator = z.object({
  orgId: z.string(),
});

export type CreateOrgPayLoad = z.infer<typeof OrganizationValidator>;
export type SubscribeToOrgPayLoad = z.infer<
  typeof OrganizationSubscriptionValidator
>;
