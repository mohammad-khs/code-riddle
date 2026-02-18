import { FC } from "react";
import RiddleItem from "./RiddleItem";
import { Button } from "../../button";

interface Riddle {
  question: string;
  answer: string;
}

interface RiddleListProps {
  riddle: Riddle[];
  onUpdate: (
    index: number,
    field: "question" | "answer",
    value: string,
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
        <Button onClick={onAdd} variant={"green"}>
          Add Riddle
        </Button>
      </div>
    </div>
  );
};

export default RiddleList;
