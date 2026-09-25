export declare namespace Post {
  type Props = {
    id: number;
    title: string;
    body: string;
  }
}

export class Post {
  readonly id: number;
  readonly title: string;
  readonly body: string;

  constructor(props: Partial<Post.Props>) {
    this.id = props.id ?? 0;
    this.title = props.title ?? "";
    this.body = props.body ?? "";
  }
}