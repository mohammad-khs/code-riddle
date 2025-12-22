import { FC } from "react";
import RiddleItem from "./RiddleItem";

interface Riddle {
  question: string;
  answer: string;
}

interface RiddleListProps {
  riddle: Riddle[];
  onUpdate: (
    index: number,
    field: "question" | "answer",
    value: string
  ) => void;
  onRemove: (index: number) => void;
  onAdd: () => void;
}

const RiddleList: FC<RiddleListProps> = ({
  riddle,
  onUpdate,
  onRemove,
  onAdd,
}) => {
  return (
    <div className="space-y-4">
      {riddle.map((riddleItem, index) => (
        <RiddleItem
          key={index}
          riddle={riddleItem}
          index={index}
          onUpdate={onUpdate}
          onRemove={onRemove}
        />
      ))}
      <div>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 bg-gray-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 px-3 py-1 rounded-md"
        >
          Add Riddle
        </button>
      </div>
    </div>
  );
};

export default RiddleList;
