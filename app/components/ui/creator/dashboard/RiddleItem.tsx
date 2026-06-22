import { FC } from "react";
import { Button } from "../../button";

interface Riddle {
  id?: string;
  question: string;
  answer: string;
}

interface RiddleItemProps {
  riddle: Riddle;
  index: number;
  onUpdate: (
    index: number,
    field: "question" | "answer",
    value: string,
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
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-1.5">
          Question
        </label>
        <textarea
          title="Question"
          value={riddle.question}
          onChange={(e) => onUpdate(index, "question", e.target.value)}
          className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
          rows={3}
        />
      </div>
      <div className="mt-3">
        <label className="block text-sm font-semibold text-slate-300 mb-1.5">
          Answer
        </label>
        <input
          title="Answer"
          value={riddle.answer}
          onChange={(e) => onUpdate(index, "answer", e.target.value)}
          className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2.5 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
        />
      </div>
      <div className="mt-4">
        <Button type="button" onClick={() => onRemove(index)} variant={"destructive"}>
          Remove
        </Button>
      </div>
    </div>
  );
};

export default RiddleItem;
