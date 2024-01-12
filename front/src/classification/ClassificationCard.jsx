import { Component } from "react";
import { Col, Image, Row } from "react-bootstrap";
import "./classification_styles.css"; // Import your custom CSS file

class ClassificationCard extends Component {
    state = { imageSrc: null };

    componentDidMount() {
        this.setState({ image: this.props?.children[0]?.image });
    }
    render() {
        const { image } = this.state;
        const { children: predictions } = this.props;
        const total = predictions.length ?? 0,
            rows = Math.ceil(total / 4);

        console.log(total, rows);
        return (
            <Row className="my-2 mx-1 classification-card">
                <Col xs={3} className="image-column">
                    <Image
                        src={image}
                        alt="Card Image"
                        width={256}
                        height={164}
                        rounded
                        className="img-fluid"
                    />
                </Col>
                <Col className="data-column">
                    <Row>
                        {Array(rows)
                            .fill(0)
                            .map((_, row) => (
                                <Col key={row}>
                                    {Array(row < rows - 1 ? 4 : total - 4 * row)
                                        .fill(0)
                                        .map((_, col) => (
                                            <Row className="text-left data-row" key={col}>
                                                {
                                                    predictions[row * 4 + col]
                                                        .classification
                                                } : {predictions[
                                                    row * 4 + col
                                                ].probability.toFixed(4)}
                                                %
                                            </Row>
                                        ))}
                                </Col>
                            ))}
                    </Row>
                </Col>
            </Row>
        );
    }
}

export default ClassificationCard;
