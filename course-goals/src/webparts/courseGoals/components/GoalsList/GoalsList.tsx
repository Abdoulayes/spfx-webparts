import * as React from "react";
import styles from "../CourseGoals.module.scss";
import { IGoalsListProps } from "./IGoalsListProps";

export default function GoalsList(props: IGoalsListProps): JSX.Element {
  const { goals, onDelete } = props; 
  return (
    <ul className={styles.goalList}>
      {goals.map((goal, index) => (
        <li key={index} className={styles.goalListItem}>
          <div>
            <h2>{goal.title}</h2>
            <p>{goal.description}</p>
          </div>
          <button onClick={() => onDelete(goal.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
