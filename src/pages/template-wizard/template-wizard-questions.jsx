import styles from "./template-wizard.module.css";
import React from "react";
import { Alert, Button, Card, Col, Dropdown, Form, Input, Menu, Row } from "antd";
import { FileDoneOutlined, MoreOutlined, PlusCircleTwoTone } from '@ant-design/icons';
import Text from "antd/lib/typography/Text";

const IMAGE_URL = process.env.PUBLIC_URL + '/template-wizard/questions.png'
const MENU_KEY_REMOVE = 'remove'
const MENU_KEY_UP = 'up'
const MENU_KEY_DOWN = 'down'

/**
 *
 * Works with `template` or `interview`.
 */
const TemplateWizardQuestions = ({
                                  guide,
                                  interview,
                                  onNext,
                                  onBack,
                                  onPreview,
                                  onGroupNameChanges,
                                  onAddGroupClicked,
                                  onRemoveGroupClicked,
                                  onMoveGroupUpClicked,
                                  onMoveGroupDownClicked,
                                  onAddQuestionClicked
                              }) => {

    const getDataId = () => guide ? guide.guideId : interview.interviewId;

    const getGroups = () => guide ? guide.structure.groups : interview.structure.groups;

    const onMenuClicked = (info, groupId) => {
        if(info.key === MENU_KEY_REMOVE) {
            onRemoveGroupClicked(groupId)
        } else if(info.key === MENU_KEY_UP) {
            onMoveGroupUpClicked(groupId)
        } else if(info.key === MENU_KEY_DOWN) {
            onMoveGroupDownClicked(groupId)
        }
    }

    return <Row key={getDataId()} align="middle" wrap={false} className={styles.row}>
        <Col span={12}>
            <div className={styles.container}>
                <Alert
                    className={styles.alert}
                    message="Grouping questions helps to evaluate skills in a particular competence area and make a more granular assessment. "
                    type="info"
                    showIcon
                    banner
                />
                <Card className={styles.card}>
                    {getGroups().map((group, index) => {

                        return <div style={{ marginTop: index === 0 ? 0 : 24 }}>
                            <Form key={group.groupId}>
                                <div className={styles.introContainer}>
                                    <Text strong>Competence Area</Text>
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
                                            onClick={() => onAddQuestionClicked(group)}>Question</Button>
                                    <Dropdown
                                        className={styles.moreIconDropdown}
                                        overlay={
                                            <Menu onClick={(info) => onMenuClicked(info, group.groupId)}>
                                                {index !== 0 && <Menu.Item key={MENU_KEY_UP}>Move Up</Menu.Item>}
                                                {index !== getGroups().length - 1 && <Menu.Item key={MENU_KEY_DOWN}>
                                                    Move Down
                                                </Menu.Item>}
                                                <Menu.Item key={MENU_KEY_REMOVE} danger>Remove</Menu.Item>
                                            </Menu>
                                        }>
                                        <MoreOutlined className={styles.moreIcon} />
                                    </Dropdown>
                                </div>
                            </Form>
                        </div>
                    })}
                    <div className={styles.plusButton}>
                        <Button
                            type="dashed"
                            block
                            icon={<PlusCircleTwoTone />}
                            onClick={onAddGroupClicked}>Competence Area</Button>
                    </div>
                    <div className={styles.introContainer}>
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

export default TemplateWizardQuestions