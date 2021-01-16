import { Form, Input, Modal } from "antd";
import React, { useState } from "react";

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

const CategoryDetailsModal = ({visible, onCreate, onCancel, categoryToUpdate}) => {

    const [category, setCategory] = useState('');

    React.useEffect(() => {
        setCategory(categoryToUpdate ? categoryToUpdate : '')
    }, [categoryToUpdate]);

    const onCategoryChange = (e) => {
        setCategory(e.target.value)
    }

    return (
        <Modal destroyOnClose title={categoryToUpdate ? "Update category" : "Add category"}
               visible={visible} closable={false}
               okText={categoryToUpdate ? "Update" : "Add"} canelText="Cancel"
               onOk={() => {
                   onCreate(category)
               }}
               onCancel={() => {
                   onCancel()
               }}>
            <Form {...layout} preserve={false}>
                <Form.Item label="Name">
                    <Input defaultValue={category} onChange = {onCategoryChange}/>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default CategoryDetailsModal