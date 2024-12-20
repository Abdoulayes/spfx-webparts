import * as React from "react";
import { FormEvent, useState, useRef } from "react";
import styles from "../CourseGoals.module.scss";
import { INewGoalProps } from "./INewGoalProps";

export default function NewGoal({ onSubmit }: INewGoalProps): JSX.Element {
  const [goalTitle, setGoalTitle] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const goalDescription = useRef<HTMLInputElement>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const enteredDesc = goalDescription.current?.value;
    if (!enteredDesc || !goalTitle) {
      setErrorMsg(
        "You have to enter goal title and description befor submit it!"
      );
    } else {
      onSubmit(goalTitle, enteredDesc);
      setErrorMsg("");
      setGoalTitle("");
      event.currentTarget.reset();
    }
  }
  return (
    <form onSubmit={handleSubmit} className={styles.newGoalForm}>
      <div className={styles.inputGroup}>
        <label htmlFor="goal-title">Your goal</label>
        <input
          type="text"
          id="goal-title"
          placeholder="Enter your goal"
          value={goalTitle}
          onChange={(e) => setGoalTitle(e.target.value)}
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="goal-description">Your goal description</label>
        <input
          ref={goalDescription}
          type="text"
          id="goal-description"
          placeholder="Enter your goal description"
        />
      </div>
      <p className={styles.errorMsg}>{errorMsg}</p>
      <button>Submit</button>
    </form>
  );
}
