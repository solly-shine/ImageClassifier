import React, { Component, Fragment } from "react";
import UploadBox from "./UploadBox/UploadBox";
// import { ToastContainer } from "react-toastify";
class App extends Component {
	state = {};
	render() {
		return (
			<Fragment>
				{/* <ToastContainer /> */}
				<UploadBox />
			</Fragment>
		);
	}
}

export default App;
