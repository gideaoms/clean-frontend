# I Used to Write a Lot of Code Just to Load a List. Now I Use `use`.

Do you remember how much code it took to show a list from an API in React? Not a complex screen, just "fetch some items and render them." For years, that simple task needed a `useEffect`, three pieces of state, and a handful of flags I had to keep in sync by hand.

Lately I've been loading data with React's `use` API and Suspense, and the difference surprised me. Nothing magical, just less code doing the same job, and fewer places for bugs to hide.

The idea is simple: **create a promise, hand it to a component, and let that component `use` it. React handles the waiting.**

---

## Where I was coming from

This is how most of my data-loading components used to look:

```tsx
function TodoList() {
  const [page, setPage] = useState(1);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    fetch(`${URL}&_page=${page}`)
      .then((response) => {
        if (!response.ok) {
          setError('Something went wrong');
        }
        return response.json();
      })
      .then((json) => setTodos(json))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [page]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p role="alert">{error}</p>;

  return (
    <>
      <button type="button" onClick={() => setPage((page) => page + 1)}>
        next
      </button>
      <ul>
        {todos.map((it) => (
          <li key={it.id}>{it.title}</li>
        ))}
      </ul>
    </>
  );
}
```

It works. But look at how much of it is about *managing the request* instead of *showing todos*:

- Three `useState` calls that must always be updated together.
- Loading and error flags I have to set and reset at the right moments.
- A dependency array I have to keep in sync by hand.

And every screen that loaded data had its own copy of this. Sometimes I'd forget to reset the error. Sometimes I'd forget to set the loading flag back. Each copy was a little different, and each one was a little wrong in its own way.

---

## The same screen with `use`

Here's the version I write now:

```tsx
import { type } from 'arktype';
import { Fragment, Suspense, use, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

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
  return validated;
}

export function TodoList() {
  const [page, setPage] = useState(1);
  const promise = findMany(page);

  return (
    <Fragment>
      <button type="button" onClick={() => setPage((page) => page + 1)}>
        next
      </button>
      <ErrorBoundary fallback={<p>Could not load todos.</p>}>
        <Suspense fallback={<p>Loading...</p>}>
          <Todos promise={promise} />
        </Suspense>
      </ErrorBoundary>
    </Fragment>
  );
}

function Todos(props: { promise: Promise<Todo[]> }) {
  const todos = use(props.promise);

  return (
    <ul>
      {todos.map((it) => (
        <li key={it.id}>{it.title}</li>
      ))}
    </ul>
  );
}
```

No `useEffect`. No `isLoading`. No `error` state. No dependency array.

A few things I like about this:

**The request is just a function.** `findMany` is a plain `async` function. It fetches, checks the response, validates the shape with [ArkType](https://arktype.io), and either returns todos or throws. It doesn't know React exists, which also makes it trivial to test.

**Loading is a place, not a flag.** Instead of `if (isLoading) return ...`, there's a `<Suspense>` boundary with a fallback. While the promise is pending, React shows the fallback. When it resolves, React renders `Todos`. I never write `setIsLoading(true)` or `setIsLoading(false)` again.

**The component reads data like it's already there.** Inside `Todos`, `use(props.promise)` gives me a `Todo[]`. Not `Todo[] | undefined`, not an empty array placeholder. By the time that line runs, the data exists. The rest of the component is just rendering.

**Errors are a place too.** If `findMany` throws, `use` re-throws it during render, and the `<ErrorBoundary>` around it shows its fallback instead. `Todos` doesn't need a `try/catch` or an `error` state. React only ships error boundaries as class components, so I use the small [react-error-boundary](https://github.com/bvaughn/react-error-boundary) package instead of writing one myself. Its `resetKeys={[page]}` prop means that when the user clicks "next" after a failure, the boundary resets and tries again with the new page.

---

## One thing to watch out for

`findMany(page)` runs in the render of `TodoList`, so **every** re-render of `TodoList` starts a new request. In this example that's fine, since the only thing that re-renders it is changing the page. But if the parent had other state, like a search input, every keystroke would refetch.

When that happens, I keep the promise in state and only create a new one on purpose:

```tsx
export function TodoList() {
  const [page, setPage] = useState(1);
  const [promise, setPromise] = useState(() => findMany(1));

  function next() {
    setPage(page + 1);
    setPromise(findMany(page + 1));
  }

  // ...same JSX
}
```

Now the request happens when the user clicks, not whenever React decides to render. For anything bigger than this, a data library with a cache is still the right tool. But for a lot of screens, `use` plus a plain async function is all I need.

---

## Wrapping up

The old way wasn't wrong, it was just a lot of ceremony: state for the data, state for loading, state for errors, and an effect to tie them together. With `use`, most of that ceremony moves into React. I write a function that returns a promise, a component that reads it, and a boundary that decides what to show while waiting.

It fits nicely with how I split my screens, too: the fetching lives in a plain function, and the view just reads what it's given.

I'm curious how other people load data these days. **Are you still using `useEffect` for fetching, have you moved to `use` and Suspense, or do you reach for a library like TanStack Query for everything?**
