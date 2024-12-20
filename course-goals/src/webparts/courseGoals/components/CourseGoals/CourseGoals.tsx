import * as React from "react";
import { useState } from "react";
import styles from "../CourseGoals.module.scss";
import { ICourseGoalsProps } from "./ICourseGoalsProps";
import { IGoalItems } from "../../interfaces/IGoalItems";
import Header from "../Header/Header";
import NewGoal from "../NewGoal/NewGoal";
import GoalsList from "../GoalsList/GoalsList";

const CourseGoals: React.FC<ICourseGoalsProps> = (props): JSX.Element => {
  const { courseGoalsTitle } = props;
  const [goals, setGoals] = useState<IGoalItems[]>([]);

  function handleSubmit(title: string, description: string): void {
    setGoals((prevState) => {
      return [...prevState, { title, description, id: crypto.randomUUID() }];
    });
  }
  function handleDelete(id: string): void {
    const filteredGoals = goals.filter((goal) => goal.id !== id);
    setGoals(filteredGoals);
  }

  return (
    <div className={styles.container}>
      <Header
        img={{ src: require("../../assets/goals.jpg"), alt: "logo react" }}
      >
        <h2>{courseGoalsTitle}</h2>
      </Header>
      <NewGoal onSubmit={handleSubmit} />
      <GoalsList goals={goals} onDelete={handleDelete} />
    </div>
  );
};
export default CourseGoals;
