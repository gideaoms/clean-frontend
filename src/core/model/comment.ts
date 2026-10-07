export declare namespace Comment {
  type Props = {
    id: string;
    postId: string;
    content: string;
    authorId: string;
  };
}

export class Comment {
  readonly id: string;
  readonly postId: string;
  readonly content: string;
  readonly authorId: string;

  constructor(props: Partial<Comment.Props>) {
    this.id = props.id ?? '';
    this.postId = props.postId ?? '';
    this.content = props.content ?? '';
    this.authorId = props.authorId ?? '';
  }
}
