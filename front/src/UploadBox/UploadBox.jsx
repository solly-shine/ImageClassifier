import React, { Component } from "react";
import Dropzone from "react-dropzone";
import { callFunctionAsMemorized, shortFileSize } from "../tools";

import "./UploadBox.css";

const focusedStyle = {
	borderColor: "#2196f3",
};

const dragActiveStyle = {
	animation: "pulse 1s infinite",
};

const acceptStyle = {
	borderColor: "#00e676",
};

const rejectStyle = {
	borderColor: "#ff1744",
};


class UploadBox extends Component {
	state = { files: [] };

	getStyles(focused, accepted, rejected, dragging) {
		return {
			...(focused ? focusedStyle : {}),
			...(accepted ? acceptStyle : {}),
			...(rejected ? rejectStyle : {}),
			...(dragging ? dragActiveStyle : {}),
		};
	}

	listFiles = (files) => (
		<aside>
			<h4>Files: </h4>
			<ul>
				{files.map((file) => (
					<li key={file.name}>
						{file.name} -{" "}
						{callFunctionAsMemorized(shortFileSize, file.size)}
					</li>
				))}
			</ul>
		</aside>
	);

	render() {
		return (
			// Note that there will be nothing logged when files are dropped
			<Dropzone
				accept={{'image/jpeg': ['.jpeg', '.png', '.jpg', '.gif']}}
				// accept={{"image/jpg": []}}
				onDrop={(files) => {
					const acceptedFiles = files.filter(file => file.type.includes('image/'))
					this.setState({ files: [...this.state.files, ...acceptedFiles] })
				}

				}
			>
				{({
					getRootProps,
					getInputProps,
					isFocused,
					isDragAccept,
					isDragActive,
					isDragReject,
				}) => (
					<section className="container">
						<div
							{...getRootProps({
								className: "dropzone dz-box",
								// memorizeOne(
								style:
									//(isFocused, isDragAccept, isDragReject) =>
									callFunctionAsMemorized(
										this.getStyles,
										isFocused,
										isDragAccept,
										isDragReject,
										isDragActive
									),
								//),
							})}
						>
							<input {...getInputProps()} />
							<p>
								{!isDragActive
									? "Drag some files here, or click to select files."
									: "Now drop to upload to start uploading..."}
							</p>
						</div>
						<hr />
						{Boolean(this.state.files?.length) &&
							callFunctionAsMemorized(
								this.listFiles,
								this.state.files
							)}
					</section>
				)}
			</Dropzone>
		);
	}
}

export default UploadBox;
