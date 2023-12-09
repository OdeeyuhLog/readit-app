import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { OrganizationValidator } from "@/lib/validators/organization";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name } = OrganizationValidator.parse(body);

    const orgExists = await db.organization.findFirst({
      where: {
        name,
      },
    });

    if (orgExists) {
      return new Response("Organization already exists", { status: 409 });
    }

    const organization = await db.organization.create({
      data: {
        name,
        creatorId: session.user.id,
      },
    });

    await db.subscription.create({
      data: {
        userId: session.user.id,
        orgId: organization.id,
      },
    });

    return new Response(organization.name);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("Could not create organization", { status: 500 });
  }
}
