import { type } from 'arktype';
import { Fragment, Suspense, useState } from 'react';
import { useSuspense } from './util/suspense.ts';

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
  return validated.map((it) => it);
}

export function TodoList() {
  const [page, setPage] = useState(1);
  return (
    <Fragment>
      <button
        type="button"
        className="cursor-pointer bg-black py-2 px-4 text-amber-50"
        onClick={() => {
          setPage((page) => page + 1);
        }}
      >
        next
      </button>
      <Suspense fallback={<p>Loading...</p>}>
        <Suspended page={page} />
      </Suspense>
    </Fragment>
  );
}

function Suspended(props: { page: number }) {
  const todos = useSuspense({
    key: ['todos', props.page],
    fn: () => findMany(props.page),
  });

  return (
    <ul>
      {todos.map((it) => {
        return <li key={it.id}>{it.title}</li>;
      })}
    </ul>
  );
}
