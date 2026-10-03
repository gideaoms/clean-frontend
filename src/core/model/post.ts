import { User } from "./user.ts";

export declare namespace Post {
  type Status = "draft" | "published" | "archived";
  type Props = {
    id: string;
    title: string;
    body: string;
    status: Status;
    author: User;
    reviewer?: User;
  }
}

export class Post {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly status: Post.Status = "draft";
  readonly author: User;
  readonly reviewer?: User;

  constructor(props: Partial<Post.Props>) {
    this.id = props.id ?? "";
    this.title = props.title ?? "";
    this.body = props.body ?? "";
    this.status = props.status ?? "draft";
    this.author = props.author ?? new User({});
    this.reviewer = props.reviewer;
  }
}