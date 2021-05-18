import styles from "./interview-wizard.module.css";
import React, { useState } from "react";
import { Alert, Button, Card, Col, DatePicker, Form, Input, Row, Select } from "antd";
import { FileDoneOutlined } from "@ant-design/icons";
import { DATE_FORMAT_DISPLAY, DATE_FORMAT_SERVER } from "../../components/utils/constants";
import moment from "moment";
import { isEmpty } from "../../components/utils/utils";
import lang from "lodash/lang";
import { findInterviewGroupQuestions} from "../../components/utils/converters";

const { TextArea } = Input;

const IMAGE_URL = process.env.PUBLIC_URL + '/interview-wizard/details.png'

const InterviewWizardDetails = ({ interview, guides, categories, onNext, onDiscard, onPreview }) => {

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
                group.questions = findInterviewGroupQuestions(group, categories)
            })

            interview.guideId = guide.guideId
            interview.structure = structure
        }
    }

    const onNotesChange = e => interview.candidateNotes = e.target.value

    const isDataValid = () => {
        let valid = true;
        if (isEmpty(interview.candidate)) {
            valid = false;
            setCandidateError({
                status: 'error',
                help: "This field is required",
            })
        }

        if (isEmpty(interview.interviewDateTime)) {
            valid = false;
            setDateError({
                status: 'error',
                help: "This field is required",
            })
        }

        if (isEmpty(interview.position)) {
            valid = false;
            setPositionError({
                status: 'error',
                help: "This field is required",
            })
        }

        return valid
    }

    const onNextClicked = () => {
        if (isDataValid()) {
            onNext()
        }
    }

    return <Row key={interview.interviewId} align="middle" wrap={false} className={styles.row}>
        <Col
            xxl={{ span: 12, offset: 0 }}
            xl={{ span: 14, offset: 0 }}
            lg={{ span: 16, offset: 4 }}
            md={{ span: 16, offset: 4 }}
            sm={{ span: 16, offset: 4 }}
            xs={{ span: 16, offset: 4 }}
        >
            <div className={styles.container}>
                <Alert
                    className={styles.alert}
                    message="Enter interview details information so you can easily discover it among other interviews."
                    type="info"
                    showIcon
                    banner
                />
                <Card className={styles.card}>
                    <Form layout="vertical">
                        <Form.Item label="Candidate"
                                   required
                                   validateStatus={candidateError.status}
                                   help={candidateError.help}>
                            <Input
                                placeholder="Kristin Watson"
                                onChange={onCandidateChange}
                                defaultValue={interview.candidate}
                            />
                        </Form.Item>
                        <Form.Item label="Interview Date"
                                   required
                                   validateStatus={dateError.status}
                                   help={dateError.help}>
                            <DatePicker showTime
                                        allowClear={false}
                                        format={DATE_FORMAT_DISPLAY}
                                        className={styles.date}
                                        defaultValue={interview.interviewDateTime ? moment(interview.interviewDateTime) : ''}
                                        onChange={onDateChange} />
                        </Form.Item>
                        <Form.Item label="Position"
                                   required
                                   validateStatus={positionError.status}
                                   help={positionError.help}>
                            <Input
                                placeholder="Junior Software Developer"
                                defaultValue={interview.position}
                                onChange={onPositionChange}
                            />
                        </Form.Item>
                        {guides.length > 0 && <Form.Item label="Template">
                            <Select
                                key={interviewGuide.guideId}
                                placeholder="Select template"
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
                        <Form.Item label="Notes">
                            <TextArea
                                placeholder="Anything you wish to mention about the candidate"
                                defaultValue={interview.candidateNotes}
                                onChange={onNotesChange}
                                autoSize={{ minRows: 3, maxRows: 5 }}
                            />
                        </Form.Item>
                        <Form.Item style={{ marginBottom: 0 }}>
                            <div className={styles.buttonContainer}>
                                <Button className={styles.button} onClick={onDiscard}>Discard</Button>
                                <Button className={styles.button} type="primary" onClick={onNextClicked}>Next</Button>
                            </div>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </Col>
        <Col
            xxl={{ span: 12}}
            xl={{ span: 10 }}
            lg={{ span: 0 }}
            md={{ span: 0 }}
            sm={{ span: 0 }}
            xs={{ span: 0 }}
        >
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