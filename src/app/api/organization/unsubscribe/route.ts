import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { OrganizationSubscriptionValidator } from "@/lib/validators/organization";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const { orgId } = OrganizationSubscriptionValidator.parse(body);

    const subscriptionExists = await db.subscription.findFirst({
      where: {
        orgId,
        userId: session.user.id,
      },
    });

    if (!subscriptionExists) {
      return new Response("You have not joined this organization", {
        status: 400,
      });
    }

    const organization = await db.organization.findFirst({
        where: {
            id: orgId,
            creatorId: session.user.id,
        }
    })

    if(organization) {
        return new Response("You can't leave your own organization.",{
            status: 500,
        }
        )
    }

    await db.subscription.delete({
        where: {
            userId_orgId: {
                orgId,
                userId: session.user.id;
            }
        }
    });

    return new Response(orgId);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 });
    }

    return new Response("Could not join organization, try again later", {
      status: 500,
    });
  }
}
