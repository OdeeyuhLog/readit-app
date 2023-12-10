import { FC } from "react";

interface PostProps {
  orgName: string;
}

const Post: FC<PostProps> = ({ orgName }) => {
  return (
    <div className="rounded-md bg-white shadow">
      <div className="px-6 py-4 flex justify-between ">
        <div className="w-0 flex-1">
          <div className="max-h-40 mt-1 text-xs text-gray-500">
            {orgName ? (
              <>
                <a
                  className="underline text-zinc-900 text-sm underline-offset-2"
                  href={`/o/${orgName}`}
                >
                  org/{orgName}
                </a>
                <span className="px-1">-</span>
              </>
            ) : null}
            <span>Posted by</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
