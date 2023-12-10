import { Comment, Organization, Post, User, Vote } from "@prisma/client";

export type ExtendedPost = Post & {
  organization: Organization;
  votes: Vote[];
  author: User;
  comments: Comment[];
};
