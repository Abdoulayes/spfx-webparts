import { IGoalItems } from "../../interfaces/IGoalItems";

export interface IGoalsListProps {
  goals: IGoalItems[];
  onDelete(id: string): void;
}