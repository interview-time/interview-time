import React, {useState} from 'react';
import styles from "./guide-structure-card.module.css";
import {PlusCircleTwoTone, DeleteTwoTone} from '@ant-design/icons';
import {Card, Space, Form, Button, Input} from "antd";

const {TextArea} = Input;

const layout = {
    labelCol: {span: 8},
    wrapperCol: {span: 16},
};

const tailLayout = {
    wrapperCol: {offset: 8, span: 16},
};

const questionGroupPlaceholders = [
    'Java Core',
    'Design Patterns',
    'Problem Solving',
    'Architecture',
];

const GuideStructureCard = () => {
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
                                    className={styles.addQuestionButton}>Question</Button>
                            <DeleteTwoTone twoToneColor="red" onClick={() => remove(field.name)} />
                        </Space>
                    </Form.Item>;
                })}

                <Form.Item {...tailLayout}>
                    <Button className={styles.input} type="dashed" block icon={<PlusCircleTwoTone />}
                            onClick={() => add()}>Group</Button>
                </Form.Item>
            </>}
        </Form.List>;
    }

    return <Card title="Guide Structure" bordered={false} headStyle={{textAlign: 'center'}}>
        <Form
            {...layout}
            name="basic"
            initialValues={{remember: true}}>
            <Form.Item label="Intro">
                <TextArea
                    autoSize
                    className={styles.input}
                    placeholder="Take 10 minutes to introduce yourself and make the candidate comfortable." />
            </Form.Item>

            {createQuestionGroupList()}

            <Form.Item label="Overall">
                <TextArea placeholder="Should the candidate proceed to the next stage?" className={styles.input} />
            </Form.Item>

            <Form.Item {...tailLayout}>
                <Button className={styles.input} danger>Revert Changes</Button>
            </Form.Item>
        </Form>
    </Card>
}

export default GuideStructureCard