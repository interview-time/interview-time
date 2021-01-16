import { Form, Input, Modal } from "antd";
import React, { useState } from "react";

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

const CategoryDetailsModal = ({visible, onCreate, onCancel, categoryToUpdate}) => {
    const noError = {
        status: '',
        help: '',
    }
    const [category, setCategory] = useState('');
    const [error, setError] = useState(noError);

    React.useEffect(() => {
        setCategory(categoryToUpdate ? categoryToUpdate : '')
        setError(noError)
    }, [categoryToUpdate]);

    const onCategoryChange = (e) => {
        setError(noError)
        setCategory(e.target.value)
    }

    const onCreateClicked = () => {
        if(category.length === 0) {
            setError({
                status: 'error',
                help: 'Category name is required.',
            })
        } else{
            onCreate(category)
        }
    }

    const onCancelClicked = () => {
        setError(noError)
        onCancel()
    }

    return (
        <Modal destroyOnClose title={categoryToUpdate ? "Update category" : "Add category"}
               visible={visible} closable={false}
               okText={categoryToUpdate ? "Update" : "Add"} canelText="Cancel"
               onOk={onCreateClicked}
               onCancel={onCancelClicked}>
            <Form {...layout} preserve={false}>
                <Form.Item label="Name" validateStatus={error.status} help={error.help}>
                    <Input defaultValue={category} onChange = {onCategoryChange}/>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default CategoryDetailsModal