import React from "react";
import { connect } from "react-redux";
import { addQuestion } from "../../store/question-bank/actions";
import { Button, Modal, Form, Input, Select, InputNumber } from 'antd';
import { getCategories } from "../../store/question-bank/selector";

const AddQuestion = ({ categories, addQuestion }) => {
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [form] = Form.useForm();

    return (
        <>
            <Button type="primary" onClick={() => setIsModalVisible(true)}>Add Question</Button>

            <Modal title="Add Question"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={() => {
                    form
                        .validateFields()
                        .then((values) => {
                            form.resetFields();
                            addQuestion(values);
                        })
                        .catch((info) => {
                            console.log('Validate Failed:', info);
                        });
                }}>

                <Form
                    form={form}
                    layout="vertical"
                    name="add-question"
                >
                    <Form.Item name="category" label="Category"
                        rules={[
                            {
                                required: true,
                                message: 'Category is required.',
                            },
                        ]}>
                        {categories &&
                            <Select style={{ width: 120 }}>
                                {categories.map(c => <Select.Option key={c} value={c}>{c}</Select.Option>)}
                            </Select>}
                    </Form.Item>

                    <Form.Item name="time" label="Time">
                        <InputNumber />
                    </Form.Item>

                    <Form.Item name="question" label="Question"
                        rules={[
                            {
                                required: true,
                                message: 'Question is required.',
                            },
                        ]}>
                        <Input type="textarea" />
                    </Form.Item>

                </Form>
            </Modal>
        </>);
};

const mapStateToProps = state => {
    const { categories } = state.questionBank || {};

    return {
        categories
    };
};

export default connect(mapStateToProps, { addQuestion })(AddQuestion);