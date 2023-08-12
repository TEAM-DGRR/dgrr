import classNames from "classnames";
import "assets/scss/AttackState.scss";

interface IStateProps {
  children: string;
  color: string;
}

export const AttackState = (props: IStateProps) => {
  const { children, color } = props;

  return (
    <div className={classNames("attack-state", color)}>
      <p>{children}</p>
    </div>
  );
};
