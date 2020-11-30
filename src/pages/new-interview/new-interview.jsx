import React, {useState} from "react";
import Layout from "../../components/layout/layout";
import {Form, DatePicker, TimePicker, Select, Input, Button, PageHeader, Row, Col, Card} from 'antd';
import styles from "./new-interview.module.css";
import {PlusCircleTwoTone, DeleteTwoTone} from '@ant-design/icons';
import {Link} from "react-router-dom";

const {TextArea} = Input;

const questionGroupPlaceholders = [
    'Java Core',
    'Design Patterns',
    'Problem Solving',
    'Architecture',
];

const NewInterview = () => {
    return (
        <Layout pageHeader={<PageHeader
            className={styles.pageHeader}
            title="New Interview"
            onBack={() => window.history.back()}
            extra={[
                <Button type="primary">
                    <Link to={`/interviews`}>
                        <span className="nav-text">Finish</span>
                    </Link>
                </Button>,
            ]}
        >
        </PageHeader>}>
            <Row gutter={16}>
                <Col span={12}>
                    <Card title="Interview Details" bordered={false} headStyle={{textAlign: 'center'}}>
                        <Form
                            labelCol={{span: 8}}
                            wrapperCol={{span: 12}}
                            name="basic"
                            initialValues={{remember: true}}>
                            <Form.Item label="Candidate Name">
                                <Input placeholder="Jon Doe" />
                            </Form.Item>

                            <Form.Item name="date-time-picker" label="Interview Time">
                                <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{width: '100%'}} />
                            </Form.Item>

                            <Form.Item name="time-picker" label="Interview Duration">
                                <TimePicker showTime format="HH:mm" style={{width: '100%'}} />
                            </Form.Item>

                            <Form.Item label="Position">
                                <Input placeholder="Junior Software Developer" />
                            </Form.Item>

                            <Form.Item label="Guide">
                                <Select defaultValue="android">
                                    <Select.Option value="android">Android Developer</Select.Option>
                                    <Select.Option value="java">Java Developer</Select.Option>
                                    <Select.Option value="behavioural">Behavioural</Select.Option>
                                </Select>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Guide Structure" bordered={false} headStyle={{textAlign: 'center'}}>
                        <Form
                            labelCol={{span: 6}}
                            wrapperCol={{span: 16}}
                            name="basic"
                            initialValues={{remember: true}}>
                            <Form.Item label="Intro">
                                <TextArea
                                    placeholder="Take 10 minutes to introduce yourself and make the candidate comfortable." />
                            </Form.Item>

                            <Form.List
                                name="names">

                                {(fields, {add, remove}) => (
                                    <>
                                        {fields.map((field, index) => {
                                            let placeholderIndex = index < questionGroupPlaceholders.length ? index : questionGroupPlaceholders.length - 1
                                            return (
                                                <Form.Item label="Question Group" style={{marginBottom: 0}}>
                                                    <Form.Item
                                                        style={{display: 'inline-block', width: 'calc(60% - 8px)'}}>
                                                        <Input
                                                            placeholder={questionGroupPlaceholders[placeholderIndex]} />
                                                    </Form.Item>
                                                    <Form.Item style={{
                                                        display: 'inline-block',
                                                        width: 'calc(40%  - 18px - 8px)',
                                                        marginLeft: 8
                                                    }}>
                                                        <Button type="dashed" block
                                                                icon={<PlusCircleTwoTone />}>Question</Button>
                                                    </Form.Item>

                                                    <Form.Item
                                                        style={{display: 'inline-block', width: '18px', marginLeft: 8}}>
                                                        <DeleteTwoTone twoToneColor="red"
                                                                       onClick={() => remove(field.name)} />
                                                    </Form.Item>

                                                </Form.Item>
                                            );
                                        })}

                                        <Form.Item
                                            wrapperCol={{offset: 6, span: 16}}>
                                            <Button type="dashed" block icon={<PlusCircleTwoTone />}
                                                    onClick={() => add()}>Group</Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>

                            <Form.Item label="Overall">
                                <TextArea placeholder="Should the candidate proceed to the next stage?" />
                            </Form.Item>

                            <Form.Item
                                wrapperCol={{offset: 6, span: 16}}>
                                <Button type="primary">
                                    <Link to={`/interviews/detail`}>
                                        <span className="nav-text">Preview</span>
                                    </Link>
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Layout>
    )
}

export default NewInterview;