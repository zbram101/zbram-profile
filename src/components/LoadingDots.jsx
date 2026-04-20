import "./loadingdots.css";

const LoadingDots = ({
  color = "#000",
  style = "small",
}) => {
  return (
    <span className={style === "small" ? "loading2" : "loading"}>
      <span style={{ backgroundColor: color }} />
      <span style={{ backgroundColor: color }} />
      <span style={{ backgroundColor: color }} />
    </span>
  );
};

LoadingDots.defaultProps = {
  style: "small",
};

export default LoadingDots;
