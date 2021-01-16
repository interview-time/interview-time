import { Form, Input, Modal } from "antd";

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

const AddCategoryModal = ({visible, onCreate, onCancel}) => {
    const [form] = Form.useForm();

    return (
        <Modal destroyOnClose title="Add category" visible={visible}
               okText="Add" canelText="Cancel"
               onOk={() => {
                   onCreate(form.getFieldValue('name'))
               }}
               onCancel={() => {
                   onCancel()
               }}>
            <Form {...layout} form={form} preserve={false} name="category">
                <Form.Item label="Name" name="name">
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default AddCategoryModal