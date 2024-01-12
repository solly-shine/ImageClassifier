import { Component } from "react";
import api from "../api";
import { Container, Row } from "react-bootstrap";
import ClassificationCard from "./ClassificationCard";

class ClassificationList extends Component {
    state = {
        predictions: [],
    };

    async componentDidMount() {
        const { children: IDs } = this.props,
            predictions = [];

        for (const id of IDs) {
            const { status, data } = await api.getClassifications(id);
            if (status === 200) {
                predictions.push(data);
            }
        }
        this.setState({ predictions });
    }

    render() {
        return (
            <Container className="m-2">
                <Row>
                    {this.state?.predictions.map((entity, index) => (
                        <ClassificationCard key={index}>
                            {entity}
                        </ClassificationCard>
                    ))}
                </Row>
            </Container>
        );
    }
}

export default ClassificationList;
