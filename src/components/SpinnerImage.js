import "./SpinnerImage.css";
import logo from "../assets/logoSpinner.png";
const SpinnerImage = (props) => {
  return (
    <div className="divSpinner">
      <img className="loader" width={50} src={logo} alt="logo" />
      {/* <span className="loaderText">Loading...</span> */}
    </div>
    // <Spinner variant='primary' animation="border" role="status"></Spinner>
  );
};

export default SpinnerImage;
