# My React Views Only Do Two Things: Read State and Send Events

Do you remember **container/presentational components**? A few years ago, a lot of React code split each component in two: a "smart" container that held the logic, and a "dumb" component that only rendered what it received. When hooks arrived, most of us stopped doing that.

Recently I've been using a small variation of that idea, and I've liked it enough that I want to share it. Nothing revolutionary, just a habit that has made my screens easier to read.

The idea is simple: **the view only reads `state` and sends events with `dispatch`. All the logic lives in one hook.**

---

## Where I was coming from

Most of my forms used to look something like this:

```tsx
function NewPost() {
  const [title, setTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    try {
      await fetch('/api/posts', { method: 'POST', body: JSON.stringify({ title }) });
    } catch {
      setError('Could not save your post.');
    } finally {
      setIsSaving(false);
    }
  }

  return <form onSubmit={handleSubmit}>{/* ...inputs, error, button... */}</form>;
}
```

Nothing wrong with it. But as the screen grew, the logic and the JSX grew together in the same place, and every time I came back to it I had to scroll up and down to understand what the screen actually did.

So I started splitting each screen into two files.

---

## Two files per screen

```
new-post/
  container.tsx   ← state and logic
  view.tsx        ← JSX
```

The container exports one hook, `useContainer()`, which returns two things:

- `state`: everything the view needs to render
- `dispatch`: the only way the view can say "something happened"

Here's the example I'll use: a form to create a blog post, with a title, a body and a status.

---

## The container

```tsx
// new-post/container.tsx
import { type FormEvent, useState } from 'react';

type Status = 'draft' | 'published';

type Post = { title: string; body: string; status: Status };

type Action =
  | { type: 'set_title'; payload: string }
  | { type: 'set_body'; payload: string }
  | { type: 'set_status'; payload: string }
  | { type: 'save_post/request'; payload: FormEvent<HTMLFormElement> }
  | { type: 'save_post/success'; payload: Post }
  | { type: 'save_post/failure'; payload: string };

async function createPost(input: Post): Promise<Post> {
  const response = await fetch('/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    throw new Error('Request failed');
  }
  return response.json();
}

export function useContainer() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [status, setStatus] = useState<Status>('draft');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function savePost() {
    try {
      const post = await createPost({ title, body, status });
      dispatch({ type: 'save_post/success', payload: post });
    } catch {
      dispatch({ type: 'save_post/failure', payload: 'Could not save your post. Try again.' });
    }
  }

  function dispatch(action: Action) {
    switch (action.type) {
      case 'set_title':
        setTitle(action.payload);
        break;
      case 'set_body':
        setBody(action.payload);
        break;
      case 'set_status':
        setStatus(action.payload as Status);
        break;
      case 'save_post/request':
        action.payload.preventDefault();
        setIsSaving(true);
        setError(null);
        savePost();
        break;
      case 'save_post/success':
        setIsSaving(false);
        setTitle('');
        setBody('');
        setStatus('draft');
        break;
      case 'save_post/failure':
        setIsSaving(false);
        setError(action.payload);
        break;
      default:
        action satisfies never;
    }
  }

  const state = {
    title,
    body,
    status,
    statuses: ['draft', 'published'],
    isSaving,
    error,
  };

  return { state, dispatch };
}
```

A few things I like about this:

**The `Action` type reads like a summary of the screen.** Before opening the JSX, I already know everything that can happen here: the user can edit three fields and save, and saving can succeed or fail.

**Async results are events too.** The request doesn't set state on its own. When it finishes, it calls `dispatch` with `save_post/success` or `save_post/failure`. So every change on this screen, whether it came from the user or from the server, goes through the same `switch`. When something looks wrong, there's one place to look.

**`action satisfies never` keeps me honest.** If I add a new action and forget to handle it, TypeScript complains.

**`state` is shaped for the view.** The view doesn't need to know where the list of statuses comes from or how saving works. It gets exactly what it needs to render.

---

## The view

```tsx
// new-post/view.tsx
import { useContainer } from './container.tsx';

export function NewPost() {
  const { state, dispatch } = useContainer();

  return (
    <form onSubmit={(e) => dispatch({ type: 'save_post/request', payload: e })}>
      <input
        placeholder="Title"
        value={state.title}
        onChange={(e) => dispatch({ type: 'set_title', payload: e.target.value })}
        required
      />
      <textarea
        placeholder="Body"
        value={state.body}
        onChange={(e) => dispatch({ type: 'set_body', payload: e.target.value })}
        required
      />
      <select
        value={state.status}
        onChange={(e) => dispatch({ type: 'set_status', payload: e.target.value })}
      >
        {state.statuses.map((it) => (
          <option key={it} value={it}>
            {it}
          </option>
        ))}
      </select>
      <button type="submit" disabled={state.isSaving}>
        {state.isSaving ? 'Saving...' : 'Save'}
      </button>
      {state.error ? <p role="alert">{state.error}</p> : null}
    </form>
  );
}
```

That's the whole view. No `useState`, no `fetch`, no `try/catch`, no `preventDefault`. It reads `state`, and when something happens, it tells the container with `dispatch`.

When I open a `view.tsx`, I'm only thinking about how the screen looks. When I open a `container.tsx`, I'm only thinking about how it behaves. I don't have to hold both in my head at the same time.

And every screen follows the same shape, even the simple ones. A list page that only loads data still gets a `container.tsx` and a `view.tsx`, its hook just returns `{ state }` with no `dispatch`. After a while, I stopped having to think about where things go.

---

## Wrapping up

This isn't a library or a framework, just a convention: one hook per screen, one `state` object, one `dispatch` function, and a view that only reads and sends. It's an old idea in a slightly different shape, and it has made my components calmer to work with.

I'm curious how other people handle this. **Do you keep logic and JSX together in the same component, or do you split them somehow? And if you split them, what does your version look like?**
