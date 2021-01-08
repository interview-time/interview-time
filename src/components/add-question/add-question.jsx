import React from "react";
import { connect } from "react-redux";
import { addQuestion, addCategory } from "../../store/question-bank/actions";
import { Button, Modal, Form, Input, Select, InputNumber, Divider } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const AddQuestion = ({ categories, addQuestion, addCategory }) => {
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [form] = Form.useForm();
    const [newCategory, setNewCategory] = React.useState();

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
                            setIsModalVisible(false);
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
                                required: false,
                                message: 'Category is required.',
                            },
                        ]}>
                        {categories &&
                            <Select style={{ width: 200 }} dropdownRender={menu => (
                                <div>
                                    {menu}
                                    <Divider style={{ margin: '4px 0' }} />
                                    <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                                        <Input style={{ flex: 'auto' }} value={newCategory} onChange={(event) => setNewCategory(event.target.value)} />
                                        <a
                                            style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }}
                                            onClick={() => {
                                                addCategory(newCategory);
                                                setNewCategory('');
                                            }}
                                        >
                                            <PlusOutlined />
                                        </a>
                                    </div>
                                </div>
                            )}>
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

export default connect(mapStateToProps, { addQuestion, addCategory })(AddQuestion);