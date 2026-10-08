# My React Views Only Do Two Things: Read State and Submit Actions

Do you remember **container/presentational components**? A few years ago, a lot of React code split each component in two: a "smart" container that held the logic, and a "dumb" component that only rendered what it received. When hooks arrived, most of us stopped doing that.

Recently I've been using a small variation of that idea, and I've liked it enough that I want to share it. Nothing revolutionary, just a habit that has made my screens easier to read.

The idea is simple: **the view only reads `state` and hands the form to an `action`. All the logic lives in one hook.**

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
  form.ts     ← state and logic
  view.tsx    ← JSX
```

The logic file exports one hook, `useForm()`, which returns three things:

- `state`: everything the view needs to render
- `action`: the function the `<form>` calls when it's submitted
- `isPending`: whether that action is still running

Here's the example I'll use: a form to create a blog post, with a title, a body and a status.

---

## The form hook

```ts
// new-post/form.ts
import { useActionState } from 'react';

type Post = { title: string; body: string; };

type State = {
  post: Post;
  error: string | null;
};

const empty: Post = { title: '', body: '' };

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

export function useForm() {
  const initial = { post: empty, error: null } satisfies State;
  const [state, action, isPending] = useActionState(reducer, initial);

  async function reducer(_prev: State, form: FormData): Promise<State> {
    const post: Post = {
      title: form.get('title')?.toString() ?? '',
      body: form.get('body')?.toString() ?? '',
    };
    if (!post.title || !post.body) {
      return { post, error: 'Title and body are required.' };
    }
    try {
      await createPost(post);
      return { post: empty, error: null };
    } catch {
      return { post, error: 'Could not save your post. Try again.' };
    }
  }

  return { state, action, isPending };
}
```

A few things I like about this:

**It reads like a reducer, because it is one.** `useActionState` takes a function that receives the previous state and the submitted `FormData`, and returns the next state. The only difference from a classic reducer is that it's allowed to be `async`, so the request lives right there, between reading the form and returning the result.

**No more loading and error flags to juggle.** `isPending` comes for free from React. I don't call `setIsSaving(true)` before the request and `setIsSaving(false)` in a `finally`. The error is just part of the state the reducer returns.

**Every outcome is a return value.** Validation failed? Return the state with an error. The request failed? Return the state with an error. It worked? Return a clean state. There's one function and every path out of it ends in a `return`, so when something looks wrong, there's one place to look.

**Failed submissions keep what the user typed.** On error, the reducer returns the `post` it just read from the form, and the view uses it as the inputs' `defaultValue`. Nobody loses a long post because the network blinked.

---

## The view

```tsx
// new-post/view.tsx
import { useForm } from './form.ts';

export function NewPost() {
  const form = useForm();

  return (
    <form action={form.action}>
      <input name="title" placeholder="Title" defaultValue={form.state.post.title} required />
      <textarea name="body" placeholder="Body" defaultValue={form.state.post.body} required />
      <button type="submit" disabled={form.isPending}>
        {form.isPending ? 'Saving...' : 'Save'}
      </button>
      {form.state.error ? <p role="alert">{form.state.error}</p> : null}
    </form>
  );
}
```

That's the whole view. No `useState`, no `fetch`, no `try/catch`, no `preventDefault`, and not even an `onChange`. The inputs are uncontrolled: they have a `name`, and the browser keeps their value until the form is submitted. The view reads `state`, and when the user hits Save, the whole form goes to `action`.

When I open a `view.tsx`, I'm only thinking about how the screen looks. When I open a `form.ts`, I'm only thinking about how it behaves. I don't have to hold both in my head at the same time.

And every screen follows the same shape, even the simple ones. A list page that only loads data gets a `query.ts` and a `view.tsx`, and its hook just returns `{ state }`. After a while, I stopped having to think about where things go.

---

## Wrapping up

This isn't a library or a framework, just a convention: one hook per screen, one `state` object, one `action` for the form, and a view that only reads and submits. It's an old idea in a slightly different shape, and it has made my components calmer to work with.

I'm curious how other people handle this. **Do you keep logic and JSX together in the same component, or do you split them somehow? And if you split them, what does your version look like?**
