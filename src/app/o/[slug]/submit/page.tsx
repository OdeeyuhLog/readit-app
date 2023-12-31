import Editor from "@/components/Editor";
import { Button } from "@/components/ui/Button";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { FC } from "react";

interface PageProps {
  params: {
    slug: string;
  };
}

const page = async ({ params }: PageProps) => {
  const organization = await db.organization.findFirst({
    where: {
      name: params.slug,
    },
  });

  if (!organization) return notFound();
  return (
    <div className="flex flex-col items-start gap-6">
      <div className="border-b border-gray-200 pb-5">
        <div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
          <h3 className="ml-2 mt-2 text-base font-semibold leading-6 text-gray-900">
            Create Post
          </h3>
          <p className="ml-2 mt-1 truncate text-sm text-gray-500">
            in org/{params.slug}
          </p>
        </div>
      </div>

      <Editor orgId={organization.id} />

      <div className="w-full flex justify-end">
        <Button form="organization-post-form" type="submit">
          Post
        </Button>
      </div>
    </div>
  );
};

export default page;
