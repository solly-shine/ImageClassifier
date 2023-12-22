import { Component } from "react";
import Dropzone from "react-dropzone";
import { callFunctionAsMemorized, shortFileSize, trunctuate } from "../tools";
import { Badge, Button, Spinner } from "react-bootstrap";
import "./UploadBox.css";
import api from "../api";

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
	state = { files: [], loading: false, alerts: [], showUploadHistory: false, uploadButtonText: null };

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

	loadImages = (images, rejections) => {
		this.setState({ loading: true });
		const acceptedImages = images.filter((file) =>
			file.type.includes("image/")
		);
		console.log(images, acceptedImages);
		const { files } = this.state;
		if (acceptedImages?.length) {
			const alerts =
				!rejections?.length && acceptedImages.length === images.length
					? []
					: [
							{
								variant: "warning",
								msg: "Some of the files were not recognized as supported images!",
							},
					  ];
			setTimeout(() => {
				console.log(alerts);
				this.setState({
					files: [...files, ...acceptedImages],
					loading: false,
					alerts,
				});
			}, [1000]);
		} else
			this.setState({
				files,
				loading: false,
				alerts: [
					{ variant: "danger", msg: "No supported image found!" },
				],
			});
	};
	upload = async () => {
		this.setState((state) => {
			state.loading = true;
			return state;
		});
		const alerts = [];
		let index = 0, progress;
		for (const file of this.state.files) {
			try {
				const { data, status, statusText } = await api.uploadImage(
					file
				);
				if (status !== 201) throw new Error(`${status}: ${statusText}`);
				alerts.push({
					variant: "success",
					msg: `image: ${trunctuate(
						file.name
					)} ➛ uploaded successfully.`,
				});
				console.log(data);
				progress = 100 * (++index) / this.state.files.length;
				this.setState(state => {
					state.uploadButtonText = `${progress.toFixed(2)} %`;
					return state;
				})
			} catch (err) {
				console.log(file.name, err);
				alerts.push({
					variant: "danger",
					msg: `image: ${trunctuate(
						file.name
					)} ➛ Uploading failed; ${err}`,
				});
			}
		}

		this.setState({
			loading: false,
			files: [],
			alerts,
			showUploadHistory: true,
			uploadButtonText: null
		});
	};

	render() {
		const { files, alerts, loading, showUploadHistory, uploadButtonText } = this.state;
		return (
			// Note that there will be nothing logged when files are dropped
			<Dropzone
				accept={{
					"image/jpeg": [".jpeg", ".jpg"],
					"image/png": [".png"],
					"image/gif": [".gif"],
				}}
				onDrop={(files, rejections) =>
					this.loadImages(files, rejections)
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
					<section className="container text-center">
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

							<>
								{!isDragActive ? (
									<i
										className="fa fa-image"
										style={{ fontSize: "15em" }}
									>
										<p style={{ fontSize: "16px" }}>
											<br />
											Drag some files here, or click to
											select files.
										</p>
									</i>
								) : (
									<i
										className="fa fa-dropbox"
										style={{ fontSize: "15em" }}
									>
										<p style={{ fontSize: "16px" }}>
											<br />
											Now drop to upload to start
											uploading...
										</p>
									</i>
								)}
							</>
						</div>
						<hr />

						{loading && (
							<Spinner
								className="mx-auto my-3"
								animation="border"
								role="status"
							>
								<span className="sr-only">Uploading...</span>
							</Spinner>
						)}
						{Boolean(files?.length) &&
							callFunctionAsMemorized(this.listFiles, files)}

						{Boolean((!loading || uploadButtonText) && files?.length) && (
							<Button
								variant="outline-success"
								className="my-3 px-5 "
								size="lg"
								onClick={() => this.upload()}
							>
								{!uploadButtonText ? 'Upload' : uploadButtonText}
							</Button>
						)}
						{Boolean(alerts?.length) &&
							alerts.map((alert, idx) => (
								<Badge
									key={idx}
									style={{ fontSize: "1.5em" }}
									className="my-3 mx-3 text-wrap"
									bg={alert.variant}
								>
									{alert.msg}
								</Badge>
							))}
						<hr />
						{showUploadHistory && (
							<a href={api.routes.entities}
								className="btn btn-primary btn-large btn-block my-3 px-5 "
							>
								Show Upload History
							</a>
						)}
					</section>
				)}
			</Dropzone>
		);
	}
}

export default UploadBox;
