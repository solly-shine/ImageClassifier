import { Component, Fragment } from "react";
import UploadBox from "./UploadBox/UploadBox";

import api from "./api";
// import { ToastContainer } from "react-toastify";
class App extends Component {
	componentDidMount() {
		(async() => {
			// const {data} = await axios.get('http://localhost:8000/api/entities');
			api.getEntities()
		})()
		// axios.get('https://google.com');
	}
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
