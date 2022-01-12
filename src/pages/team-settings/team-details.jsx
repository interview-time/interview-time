import { Button, Form, Input, Popconfirm, Space } from "antd";
import Text from "antd/lib/typography/Text";
import styles from "./team-settings.module.css";

/**
 *
 * @param {String} teamName
 * @param {boolean} team
 * @param onSaveClicked
 * @param onDeleteClicked
 * @returns {JSX.Element}
 * @constructor
 */
const TeamDetails = ({ teamName, isAdmin, onSaveClicked, onDeleteClicked, onLeaveClicked }) => {

    const team = {
        teamName: teamName
    }

    const onNameChange = (e) => {
        team.teamName = e.target.value
    }

    return <Form
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
                disabled={!isAdmin}
            />
        </Form.Item>
        <div className={styles.divRight}>
            <Space>
                <Popconfirm
                    title="Are you want to delete this team?"
                    onConfirm={onDeleteClicked}
                    okText="Yes"
                    cancelText="No"
                    disabled={!isAdmin}
                >
                    <Button disabled={!isAdmin}>Delete</Button>
                </Popconfirm>
                <Button type="primary" htmlType="submit" disabled={!isAdmin}>Update</Button>
                {!isAdmin && <Popconfirm
                    title="Are you want to leave this team?"
                    onConfirm={onLeaveClicked}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button>Leave</Button>
                </Popconfirm>}
            </Space>
        </div>
    </Form>
}

export default TeamDetails