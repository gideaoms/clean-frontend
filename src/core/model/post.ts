import { User } from './user.ts';

export declare namespace Post {
  type Status = 'draft' | 'published' | 'archived' | (string & {});
  type Props = {
    id: string;
    title: string;
    body: string;
    status: Status;
    authorId: string;
    author: User;
  };
}

export class Post {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly status: Post.Status;
  readonly authorId: string;
  readonly author: User;

  constructor(props: Partial<Post.Props>) {
    this.id = props.id ?? '';
    this.title = props.title ?? '';
    this.body = props.body ?? '';
    this.status = props.status ?? '';
    this.authorId = props.authorId ?? '';
    this.author = props.author ?? new User({});
  }

  isPublished(): boolean {
    return this.status === 'published';
  }

  isDraft(): boolean {
    return this.status === 'draft';
  }

  isArchived(): boolean {
    return this.status === 'archived';
  }
}
