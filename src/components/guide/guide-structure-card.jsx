import React, {useState} from 'react';
import styles from "./guide-structure-card.module.css";
import {PlusCircleTwoTone, DeleteTwoTone} from '@ant-design/icons';
import {Card, Space, Form, Button, Input} from "antd";

const {TextArea} = Input;

const layout = {
    labelCol: {span: 6},
    wrapperCol: {span: 18},
};

const tailLayout = {
    wrapperCol: {offset: 6, span: 18},
};

const questionGroupPlaceholders = [
    'Java Core',
    'Design Patterns',
    'Problem Solving',
    'Architecture',
];

const GuideStructureCard = (props) => {
    function createQuestionGroupList() {
        return <Form.List
            {...layout}
            name="names">
            {(fields, {add, remove}) => <>
                {fields.map((field, index) => {
                    let placeholderIndex = index < questionGroupPlaceholders.length ? index : questionGroupPlaceholders.length - 1
                    return <Form.Item label="Question Group">
                        <Space>
                            <Input placeholder={questionGroupPlaceholders[placeholderIndex]}
                                   className={styles.inputQuestion} />
                            <Button type="dashed" block icon={<PlusCircleTwoTone />}
                                    className={styles.addQuestionButton} onClick={() => props.onAddQuestionClicked()}>Question</Button>
                            <DeleteTwoTone twoToneColor="red" onClick={() => remove(field.name)} />
                        </Space>
                    </Form.Item>;
                })}

                <Form.Item {...tailLayout}>
                    <Button className={styles.addGroupButton} type="dashed" block icon={<PlusCircleTwoTone />}
                            onClick={() => add()}>Group</Button>
                </Form.Item>
            </>}
        </Form.List>;
    }

    return <Card title="Guide Structure" bordered={false} headStyle={{textAlign: 'center'}} style={{width: 700}}>
        <Form
            {...layout}
            name="basic"
            initialValues={{remember: true}}>
            <Form.Item label="Intro" {...layout}>
                <TextArea
                    className={styles.input}
                    autoSize
                    placeholder="Take 10 minutes to introduce yourself and make the candidate comfortable." />
            </Form.Item>

            {createQuestionGroupList()}

            <Form.Item label="Overall">
                <TextArea
                    className={styles.input}
                    autoSize
                    placeholder="Should the candidate proceed to the next stage?" />
            </Form.Item>

            {props.showRevertButton && <Form.Item {...tailLayout}>
                <Button className={styles.input} danger>Revert Changes</Button>
            </Form.Item>}
        </Form>
    </Card>
}

export default GuideStructureCard