import { type } from 'arktype';
import { useActionState } from 'react';
import { useRepository } from '../../impl/context/repository.tsx';
import { useSession } from '../../impl/context/session.tsx';

type User = {
  email: string;
  password: string;
};
type State = {
  user: User;
  err: Error | null;
};

const schema = type({
  email: 'string.trim |> string.email',
  password: 'string > 0',
});

export function useForm() {
  const session = useSession();
  const repository = useRepository();
  const initial = {
    user: { email: '', password: '' },
    err: null,
  } satisfies State;
  const [state, action, isPending] = useActionState(reducer, initial);

  async function reducer(_prev: State, form: FormData): Promise<State> {
    const payload = {
      email: form.get('email')?.toString() ?? '',
      password: form.get('password')?.toString() ?? '',
    };
    const validated = schema(payload);
    if (validated instanceof type.errors) {
      return { user: payload, err: new Error(validated.summary) };
    }
    try {
      const { email, password } = validated;
      const user = await repository.user.signIn(email, password);
      session.dispatch({ type: 'sign_in/success', payload: user });
      return { user: payload, err: null };
    } catch (err) {
      if (err instanceof Error) {
        return { user: payload, err };
      }
      throw err;
    }
  }

  return { state, action, isPending };
}
