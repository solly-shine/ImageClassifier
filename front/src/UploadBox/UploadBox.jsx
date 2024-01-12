import { Component, Fragment } from "react";
import Dropzone from "react-dropzone";
import { callFunctionAsMemorized, shortFileSize, trunctuate } from "../tools";
import { Badge, Button, Spinner } from "react-bootstrap";
import "./UploadBox.css";
import api from "../api";
import ClassificationList from "../classification/ClassificationList";

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
    state = {
        files: [],
        loading: false,
        alerts: [],
        showUploadHistory: false,
        uploadButtonText: null,
        recentUploadedEntities: [], // list of id s
    };

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
        this.setState({ loading: true, recentUploadedEntities: [] });
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
            }, [500]);
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
        const alerts = [
            {
                variant: "info",
                msg: "Uploading and classifying each image will take some time. Be Patient ...",
            },
        ];
        this.setState({ alerts, loading: true, uploadButtonText: '0.0 %'});
        let index = 0,
            progress;
        const recents = [];
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
                recents.push(data?.id);

                progress = (100 * ++index) / this.state.files.length;
                this.setState({
                    uploadButtonText: `${progress.toFixed(2)} %`,
                    alerts,
                });
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
        alerts.splice(0, 1); // remove the first alert, that is Be Patient message!
        this.setState({
            loading: false,
            files: [],
            alerts,
            showUploadHistory: true,
            uploadButtonText: null,
        });
        setTimeout(
            () =>
                this.setState({
                    alerts: [
                        {
                            variant: "info",
                            msg: "Classification Predictions:",
                        },
                    ],
                    recentUploadedEntities: recents,
                }),
            [1000]
        );
    };

    render() {
        const {
            files,
            alerts,
            loading,
            showUploadHistory,
            uploadButtonText,
            recentUploadedEntities,
        } = this.state;
        console.log(recentUploadedEntities);
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

                        {loading && (
                            <Spinner
                                className="mx-auto my-3"
                                animation="border"
                                role="status"
                            >
                                <span className="sr-only">Uploading...</span>
                            </Spinner>
                        )}

                        {Boolean(files?.length) && (
                            <Fragment>
                                <hr />
                                {callFunctionAsMemorized(this.listFiles, files)}
                            </Fragment>
                        )}

                        {Boolean(
                            (!loading || uploadButtonText) && files?.length
                        ) && (
                            <Fragment>
                                <Button
                                    variant="outline-success"
                                    className="my-3 px-5 "
                                    size="lg"
                                    onClick={() => this.upload()}
                                >
                                    {!uploadButtonText
                                        ? "Upload"
                                        : uploadButtonText}
                                </Button>
                            </Fragment>
                        )}

                        {Boolean(alerts?.length) && (
                            <Fragment>
                                <hr />
                                {alerts.map((alert, idx) => (
                                    <Badge
                                        key={idx}
                                        style={{ fontSize: "1.5em" }}
                                        className="my-3 mx-3 text-wrap"
                                        bg={alert.variant}
                                    >
                                        {alert.msg}
                                    </Badge>
                                ))}
                            </Fragment>
                        )}
                        {Boolean(recentUploadedEntities?.length) && (
                            <ClassificationList>
                                {recentUploadedEntities}
                            </ClassificationList>
                        )}
                        {showUploadHistory && (
                            <Fragment>
                                <hr />

                                <a
                                    href={api.routes.entities}
                                    className="btn btn-primary btn-large btn-block my-3 px-5 "
                                >
                                    Show Upload History
                                </a>
                            </Fragment>
                        )}
                    </section>
                )}
            </Dropzone>
        );
    }
}

export default UploadBox;
