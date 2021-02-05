import styles from "./guide-wizard.module.css";
import React from "react";
import { Alert, Button, Card, Col, Form, Input, Popconfirm, Row } from "antd";
import { DeleteTwoTone, FileDoneOutlined, PlusCircleTwoTone } from '@ant-design/icons';
import Text from "antd/lib/typography/Text";

const IMAGE_URL = process.env.PUBLIC_URL + '/guide-wizard/guide-wizard-questions.png'

const GuideWizardQuestions = ({
                                  guide,
                                  onNext,
                                  onBack,
                                  onPreview,
                                  onGroupNameChanges,
                                  onAddGroupClicked,
                                  onRemoveGroupClicked,
                                  onAddQuestionClicked
                              }) => {

    return <Row key={guide.guideId} align="middle" wrap={false}>
        <Col span={12}>
            <div className={styles.container}>
                <Alert
                    className={styles.alert}
                    message="Grouping questions helps to evaluate skills in a particular area and make a more granular assessment. "
                    type="info"
                    showIcon
                />
                <Card className={styles.card}>
                    {guide.structure.groups.map((group, index) => {

                        return <div style={{ marginTop: index === 0 ? 0 : 24 }}>
                            <Form>
                                <div className={styles.buttonContainer}>
                                    <Text strong>Question Group</Text>
                                    <Text>{group.questions.length} questions</Text>
                                </div>
                                <div className={styles.questionGroup}>
                                    <Input placeholder='e.g. Software Design Patterns'
                                           onChange={e => onGroupNameChanges(group.groupId, e.target.value)}
                                           defaultValue={group.name}
                                    />
                                    <Button type="dashed" style={{ marginLeft: '12px' }}
                                            block icon={<PlusCircleTwoTone />}
                                            className={styles.addQuestionButton}
                                            onClick={() => {
                                                onAddQuestionClicked(group)
                                            }}>Question</Button>
                                    <Popconfirm
                                        title="Are you sure you want to delete this group?"
                                        onConfirm={() => onRemoveGroupClicked(group.groupId)}
                                        okText="Yes"
                                        cancelText="No">
                                        <DeleteTwoTone twoToneColor="red" style={{ marginLeft: '12px' }} />
                                    </Popconfirm>
                                </div>
                            </Form>
                        </div>
                    })}
                    <Button
                        style={{ marginTop: '24px' }}
                        type="dashed" block
                        icon={<PlusCircleTwoTone />}
                        onClick={onAddGroupClicked}
                    >Group</Button>
                    <div className={styles.buttonContainer} style={{ marginTop: '24px' }}>
                        <Button className={styles.button} onClick={onBack}>Back</Button>
                        <Button className={styles.button} type="primary" onClick={onNext}>Next</Button>
                    </div>
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
                    onClick={onPreview}
                    icon={<FileDoneOutlined />}>Interview Preview</Button>
            </div>
        </Col>
    </Row>
}

export default GuideWizardQuestions