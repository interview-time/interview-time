import styles from "./interview-wizard.module.css";
import React, { useState } from "react";
import { Alert, Button, Card, Col, DatePicker, Form, Input, Row, Select } from "antd";
import { FileDoneOutlined } from "@ant-design/icons";
import { DATE_FORMAT_DISPLAY, DATE_FORMAT_SERVER } from "../../components/utils/constants";
import moment from "moment";
import { isEmpty } from "../../components/utils/utils";
import lang from "lodash/lang";
import { questionIdsToQuestions } from "../../components/utils/converters";

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
};

const tailLayout = {
    wrapperCol: { offset: 6, span: 16 }
};

const IMAGE_URL = process.env.PUBLIC_URL + '/interview-wizard/interview-wizard-details.png'

const InterviewWizardDetails = ({ interview, guides, questions, onNext, onDiscard, onPreview }) => {

    const noError = {
        status: null,
        help: null,
    }

    const [interviewGuide, setInterviewGuide] = useState({});
    const [candidateError, setCandidateError] = useState(noError);
    const [dateError, setDateError] = useState(noError);
    const [positionError, setPositionError] = useState(noError);

    React.useEffect(() => {
        if (interview.guideId) {
            const guide = guides.find(guide => guide.guideId === interview.guideId)
            if (guide) {
                setInterviewGuide(guide)
            }
        }
    }, [interview, guides]);

    const onCandidateChange = e => {
        interview.candidate = e.target.value;
        setCandidateError(noError)
    }

    const onDateChange = (date) => {
        interview.interviewDateTime = date.utc().format(DATE_FORMAT_SERVER)
        setDateError(noError)
    };

    const onPositionChange = e => {
        interview.position = e.target.value;
        setPositionError(noError)
    }

    const onGuideClear = () => {
        interview.guideId = null
    }
    const onGuideChange = value => {
        const guide = guides.find(guide => guide.guideId === value)
        if (guide) {
            const structure = lang.cloneDeep(guide.structure)

            structure.groups.forEach(group => {
                group.questions = questionIdsToQuestions(group.questions, questions)
            })

            interview.guideId = guide.guideId
            interview.structure = structure
        }
    }

    const isDataValid = () => {
        let valid = true;
        if (isEmpty(interview.candidate)) {
            valid = false;
            setCandidateError({
                status: 'error',
                help: "Please provide 'Candidate'",
            })
        }

        if (isEmpty(interview.interviewDateTime)) {
            valid = false;
            setDateError({
                status: 'error',
                help: "Please provide 'Interview Date'",
            })
        }

        if (isEmpty(interview.position)) {
            valid = false;
            setPositionError({
                status: 'error',
                help: "Please provide 'Position'",
            })
        }

        return valid
    }

    const onNextClicked = () => {
        if (isDataValid()) {
            onNext()
        }
    }

    return <Row key={interview.interviewId} align="middle" wrap={false}>
        <Col span={12}>
            <div className={styles.container}>
                <Alert
                    className={styles.alert}
                    message="Enter interview details information so you can easily discover it among other interviews."
                    type="info"
                    showIcon
                />
                <Card className={styles.card}>
                    <Form>
                        <Form.Item label="Candidate" {...layout}
                                   validateStatus={candidateError.status}
                                   help={candidateError.help}>
                            <Input
                                placeholder="Jon Doe"
                                onChange={onCandidateChange}
                                defaultValue={interview.candidate}
                            />
                        </Form.Item>
                        <Form.Item label="Interview Date" {...layout}
                                   validateStatus={dateError.status}
                                   help={dateError.help}>
                            <DatePicker showTime
                                        allowClear={false}
                                        format={DATE_FORMAT_DISPLAY}
                                        className={styles.date}
                                        defaultValue={interview.interviewDateTime ? moment(interview.interviewDateTime) : ''}
                                        onChange={onDateChange} />
                        </Form.Item>
                        <Form.Item label="Position" {...layout}
                                   validateStatus={positionError.status}
                                   help={positionError.help}>
                            <Input
                                placeholder="Junior Software Developer"
                                defaultValue={interview.position}
                                onChange={onPositionChange}
                            />
                        </Form.Item>
                        {guides.length > 0 && <Form.Item label="Guide" {...layout}>
                            <Select
                                key={interviewGuide.guideId}
                                placeholder="Select guide"
                                defaultValue={interviewGuide.title}
                                onSelect={onGuideChange}
                                onClear={onGuideClear}
                                options={guides.map(guide => {
                                    return {
                                        label: guide.title,
                                        value: guide.guideId,
                                    }
                                })}
                                showSearch
                                allowClear
                                filterOption={(inputValue, option) =>
                                    option.value.toLocaleLowerCase().includes(inputValue)
                                }
                            />
                        </Form.Item>}
                        <Form.Item {...tailLayout} style={{ marginBottom: 0 }}>
                            <div className={styles.buttonContainer}>
                                <Button className={styles.button} onClick={onDiscard}>Discard</Button>
                                <Button className={styles.button} type="primary" onClick={onNextClicked}>Next</Button>
                            </div>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </Col>
        <Col span={12}>
            <div className={styles.container}>
                <img alt="Intro" src={IMAGE_URL} className={styles.image} />
                <Button
                    className={styles.button}
                    size="large"
                    shape="round"
                    type="primary"
                    icon={<FileDoneOutlined />}
                    onClick={onPreview}>Interview Preview</Button>
            </div>
        </Col>
    </Row>
}

export default InterviewWizardDetails