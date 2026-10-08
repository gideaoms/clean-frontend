export function ReRender({
  random,
  setRandom,
}: {
  random: number;
  setRandom: () => void;
}) {
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
