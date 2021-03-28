import { Form, Input, Modal } from "antd";
import React, { useState } from "react";
import { personalEvent } from "../../analytics";

const CategoryDetailsModal = ({ visible, onUpdate, onCreate, onCancel, categoryToUpdate }) => {
    const noError = {
        status: '',
        help: '',
    }
    const [category, setCategory] = useState('');
    const [error, setError] = useState(noError);

    React.useEffect(() => {
        setCategory(categoryToUpdate ? categoryToUpdate : '')
        setError(noError)
        // eslint-disable-next-line
    }, [categoryToUpdate]);

    const onCategoryChange = (e) => {
        setError(noError)
        setCategory(e.target.value)
    }

    const onCreateClicked = () => {
        if (category.length === 0) {
            setError({
                status: 'error',
                help: 'Category name is required.',
            })
        } else if (categoryToUpdate) {
            onUpdate(categoryToUpdate, category)
        } else {
            personalEvent('New Category Created');
            onCreate(category)
        }
    }

    const onCancelClicked = () => {
        setError(noError)
        onCancel()
    }

    return (
        <Modal destroyOnClose={true} title={categoryToUpdate ? "Update category" : "Add category"}
               visible={visible} closable={false}
               okText={categoryToUpdate ? "Update" : "Add"} cancelText="Cancel"
               afterClose={()=>{
                   setCategory('')
               }}
               onOk={onCreateClicked}
               onCancel={onCancelClicked}>
            <Form layout="vertical" preserve={false}>
                <Form.Item label="Name" validateStatus={error.status} help={error.help}>
                    <Input defaultValue={category} placeholder="Category name" onChange={onCategoryChange} />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default CategoryDetailsModal