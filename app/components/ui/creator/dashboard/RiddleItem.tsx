import { FC } from "react";

interface Riddle {
  question: string;
  answer: string;
}

interface RiddleItemProps {
  riddle: Riddle;
  index: number;
  onUpdate: (
    index: number,
    field: "question" | "answer",
    value: string
  ) => void;
  onRemove: (index: number) => void;
}

const RiddleItem: FC<RiddleItemProps> = ({
  riddle,
  index,
  onUpdate,
  onRemove,
}) => {
  return (
    <div
      key={index}
      className="bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-md p-4"
    >
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Question
        </label>
        <input
          title="Question"
          value={riddle.question}
          onChange={(e) => onUpdate(index, "question", e.target.value)}
          className="mt-1 w-full rounded-md border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2"
        />
      </div>
      <div className="mt-2">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Answer
        </label>
        <input
          title="Answer"
          value={riddle.answer}
          onChange={(e) => onUpdate(index, "answer", e.target.value)}
          className="mt-1 w-full rounded-md border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2"
        />
      </div>
      <div className="mt-3">
        <button type="button" onClick={() => onRemove(index)} className="text-red-600">
          Remove
        </button>
      </div>
    </div>
  );
};

export default RiddleItem;
