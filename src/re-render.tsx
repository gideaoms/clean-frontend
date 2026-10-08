import { useSuspense } from './util/suspense.ts';

export function ReRender({
  random,
  setRandom,
}: {
  random: number;
  setRandom: () => void;
}) {
  const user = useSuspense({
    key: ['session'],
    fn: () => {
      console.log('Hello');
    },
  });
  console.log('user [v2]', user);

  return (
    <button
      className="bg-amber-700 border cursor-pointer p-2 text-amber-50"
      type="button"
      onClick={setRandom}
    >
      Random: {random}
    </button>
  );
}
