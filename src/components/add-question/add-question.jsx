import React from "react";
import { connect } from "react-redux";
import { loadCategories, addQuestion } from "../../store/question-bank/actions";
import { Button, Modal, Form, Input, Select } from 'antd';

const AddQuestion = ({ categories, loading, loadCategories, addQuestion }) => {
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [form] = Form.useForm();

    React.useEffect(() => {
        if ((!categories || categories.length === 0) && !loading) {
            loadCategories();
        }
    }, []);

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
                        <Select style={{ width: 120 }}>
                            {categories.map(c => <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>)}
                        </Select>
                    </Form.Item>

                    <Form.Item name="time" label="Time">
                        <Input />
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
    const { categories, loading } = state.questionBank || {};

    return { categories, loading };
};

export default connect(mapStateToProps, { loadCategories, addQuestion })(AddQuestion);