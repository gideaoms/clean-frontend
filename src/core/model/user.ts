export declare namespace User {
  type Props = {
    id: string;
    name: string;
    email: string;
  };
}

export class User {
  readonly id: string;
  readonly name: string;
  readonly email: string;

  constructor(props: Partial<User.Props>) {
    this.id = props.id ?? '';
    this.name = props.name ?? '';
    this.email = props.email ?? '';
  }
}
