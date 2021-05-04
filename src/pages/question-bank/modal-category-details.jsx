import { Form, Input, Modal } from "antd";
import React, { useState } from "react";
import { personalEvent } from "../../analytics";
import { cloneDeep } from "lodash/lang";

/**
 *
 * @param visible
 * @param onUpdate
 * @param onCreate
 * @param onCancel
 * @param {Category} categoryToUpdate
 * @returns {JSX.Element}
 * @constructor
 */
const CategoryDetailsModal = ({ visible, onUpdate, onCreate, onCancel, categoryToUpdate }) => {
    const noError = {
        status: '',
        help: '',
    }

    /**
     * @type {Category}
     */
    const emptyCategory= {

    }

    const [category, setCategory] = useState(emptyCategory);
    const [error, setError] = useState(noError);

    React.useEffect(() => {
        if(categoryToUpdate) {
            setCategory(cloneDeep(categoryToUpdate))
        } else {
            setCategory(emptyCategory)
        }
        setError(noError)
        // eslint-disable-next-line
    }, [categoryToUpdate]);

    const onCategoryChange = (e) => {
        setError(noError)
        setCategory({
            ...category,
            categoryName: e.target.value
        })
    }

    const onCreateClicked = () => {
        if (category.categoryName.length === 0) {
            setError({
                status: 'error',
                help: 'Category name is required.',
            })
        } else if (categoryToUpdate) {
            onUpdate(category)
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
        <Modal title={categoryToUpdate ? "Update category" : "Add category"}
               visible={visible}
               closable={false}
               destroyOnClose={true}
               okText={categoryToUpdate ? "Update" : "Add"}
               cancelText="Cancel"
               onOk={onCreateClicked}
               onCancel={onCancelClicked}>
            <Form layout="vertical" preserve={false}>
                <Form.Item label="Name" validateStatus={error.status} help={error.help}>
                    <Input defaultValue={category.categoryName} placeholder="Category name" onChange={onCategoryChange} />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default CategoryDetailsModal