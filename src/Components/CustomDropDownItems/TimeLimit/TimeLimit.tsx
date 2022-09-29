import "./TimeLimit.css";

export interface TimeLimitProps {
  onTimeLimitChange: (checked: boolean) => void;
  onSetTimeLimit: (value: string) => void;
  timeLimitEnabled: boolean;
  timeLimitValue: string;
}

const TimeLimit = (props: TimeLimitProps) => {
  const handleTimeCheckBoxChange = (event: any) => {
    props.onTimeLimitChange(event.target.checked);
    props.onSetTimeLimit("");
  };

  return (
    <div className="time-wrapper">
      <div className="checkbox-wrapper">
        Time Limit <input className="cursor-pointer" type="checkbox" onChange={handleTimeCheckBoxChange} checked={props.timeLimitEnabled} />
      </div>
      {props.timeLimitEnabled && (
        <input
          style={{ width: "45%" }}
          className="time-input"
          placeholder={"in sec"}
          value={props.timeLimitValue}
          onChange={(event) => {
            props.onSetTimeLimit(event.target.value);
          }}
        ></input>
      )}
    </div>
  );
};

export default TimeLimit;
