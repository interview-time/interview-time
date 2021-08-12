import { Button, Form, Input, Popconfirm, Space } from "antd";
import Text from "antd/lib/typography/Text";
import styles from "./team-settings.module.css";

const TeamDetails = ({ teamName, onSaveClicked, onDeleteClicked }) => {

    const team = {
        teamName: teamName
    }

    const onNameChange = (e) => {
        team.teamName = e.target.value
    }

    return <Form
        style={{ marginTop: 24 }}
        name="basic"
        layout="vertical"
        onFinish={() => onSaveClicked(team.teamName)}
        initialValues={{
            name: teamName
        }}
    >
        <Form.Item
            name="name"
            label={<Text strong>Name</Text>}
            rules={[
                {
                    required: true,
                    message: "Please enter team name",
                },
            ]}
        >
            <Input
                placeholder="Team name"
                onChange={onNameChange}
            />
        </Form.Item>
        <div className={styles.divRight}>
            <Space>
                <Popconfirm
                    title="Are you want to delete this team?"
                    onConfirm={onDeleteClicked}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button>Delete</Button>
                </Popconfirm>
                <Button type="primary" htmlType="submit">Update</Button>
            </Space>
        </div>
    </Form>
}

export default TeamDetails