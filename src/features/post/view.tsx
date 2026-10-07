import { Suspense } from 'react';
import { Link, useParams } from 'react-router';
import { useForm } from './form.ts';

export function PostForm() {
  const { id } = useParams();

  return (
    <Suspense key={id ?? 'new'} fallback={<Skeleton />}>
      <Form />
    </Suspense>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-4 rounded-lg border border-gray-200 bg-white p-6">
      <div className="space-y-2">
        <div className="h-7 w-32 rounded bg-gray-200" />
        <div className="h-4 w-24 rounded bg-gray-200" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="h-9 rounded-md bg-gray-200" />
        <div className="h-9 rounded-md bg-gray-200" />
      </div>
      <div className="h-9 rounded-md bg-gray-200" />
      <div className="h-32 rounded-md bg-gray-200" />
      <div className="h-9 w-20 rounded-md bg-gray-200" />
    </div>
  );
}

function Form() {
  const form = useForm();

  return (
    <form
      className="space-y-4 rounded-lg border border-gray-200 bg-white p-6"
      action={form.action}
    >
      <div>
        <h1 className="text-xl font-semibold">
          {form.isNew ? 'New post' : 'Edit post'}
        </h1>
        {!form.isNew && (
          <p className="text-sm text-gray-500">
            by {form.state.post.author.name}
            {form.state.post.isPublished() && ' | Published'}
          </p>
        )}
      </div>
      <input name="id" defaultValue={form.state.post.id} hidden />
      <input name="authorId" defaultValue={form.state.post.authorId} hidden />
      <select
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        defaultValue={form.state.post.status}
        name="status"
      >
        <option value="">Select a option...</option>
        <option value="draft">Draft</option>
        <option value="published">Published</option>
        <option value="archived">Archived</option>
      </select>
      <input
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        defaultValue={form.state.post.title}
        placeholder="Title"
        name="title"
        required
      />
      <textarea
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-32"
        defaultValue={form.state.post.body}
        placeholder="Body"
        name="body"
        required
      />
      {form.state.err ? (
        <div className="bg-red-100 border border-red-400 p-2 rounded-md">
          <p className="text-sm text-red-600">{form.state.err.message}</p>
        </div>
      ) : null}
      <div className="flex items-center gap-4">
        <button
          className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          type="submit"
          disabled={form.isPending}
        >
          {form.isPending ? 'Saving...' : 'Save'}
        </button>
        <Link
          to="/"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          Back
        </Link>
      </div>
    </form>
  );
}
