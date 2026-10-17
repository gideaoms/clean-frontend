import { type } from 'arktype';
import { Fragment, Suspense, use, useState, useTransition } from 'react';

const URL = 'https://jsonplaceholder.typicode.com/todos?_limit=10';

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

const schema = type({
  id: 'number',
  title: 'string',
  completed: 'boolean',
});

async function findMany(page: number): Promise<Todo[]> {
  const response = await fetch(`${URL}&_page=${page}`);
  if (!response.ok) {
    throw new Error('Something went wrong');
  }
  const json = await response.json();
  const validated = schema.array()(json);
  if (validated instanceof type.errors) {
    throw new Error(validated.summary);
  }
  await new Promise((resolve) => {
    setTimeout(resolve, 2000);
  });
  return validated.map((it) => it);
}

export function TodoList() {
  const [page, setPage] = useState(1);
  const [promise, setPromise] = useState(() => findMany(page));
  const [isPending, startTransition] = useTransition();
  return (
    <Fragment>
      <button
        type="button"
        className="cursor-pointer bg-black py-2 px-4 text-amber-50"
        onClick={() => {
          const next = page + 1;
          startTransition(() => {
            setPage(next);
            setPromise(findMany(next));
          });
        }}
      >
        next
      </button>
      <div style={{ opacity: isPending ? 0.5 : 1 }}>
        <Suspense fallback={<p>Loading...</p>}>
          <Suspended promise={promise} />
        </Suspense>
      </div>
    </Fragment>
  );
}

function Suspended(props: { promise: Promise<Todo[]> }) {
  const todos = use(props.promise);

  return (
    <ul>
      {todos.map((it) => {
        return <li key={it.id}>{it.title}</li>;
      })}
    </ul>
  );
}
