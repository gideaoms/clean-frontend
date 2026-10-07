import { Posts } from '../../components/posts/view.tsx';
import { useForm } from './form.ts';

export function Comment() {
  const form = useForm();
  return (
    <form
      className="space-y-4 rounded-lg border border-gray-200 bg-white p-6"
      action={form.action}
    >
      <h1 className="text-xl font-semibold">New comment</h1>
      <input
        name="authorId"
        defaultValue={form.state.comment.authorId}
        hidden
      />
      <Posts postId={form.state.comment.postId} />
      <textarea
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-32"
        defaultValue={form.state.comment.content}
        placeholder="Content"
        name="content"
        required
      />
      {form.state.err ? (
        <div className="bg-red-100 border border-red-400 p-2 rounded-md">
          <p className="text-sm text-red-600">{form.state.err.message}</p>
        </div>
      ) : null}
      <button
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        type="submit"
        disabled={form.isPending}
      >
        {form.isPending ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
