import React from 'react';
import styles from "./guide-structure-card.module.css";
import { DeleteTwoTone, DownOutlined, PlusCircleTwoTone } from '@ant-design/icons';
import { Button, Card, Dropdown, Form, Input, Menu, Popconfirm, Space } from "antd";
import Text from "antd/lib/typography/Text";
import { Link } from "react-router-dom";

const { TextArea } = Input;

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};

const tailLayout = {
    wrapperCol: { offset: 6, span: 18 },
};

const GuideStructureCard = ({
                                guides,
                                structure,
                                onHeaderChanged,
                                onFooterChanged,
                                onGuideChange,
                                onAddGroupClicked,
                                onRemoveGroupClicked,
                                onGroupNameChanges,
                                onAddQuestionClicked
                            }) => {

    const menu = <Menu>
        {guides && guides.map(guide => {
            return <Menu.Item onClick={() => {
                onGuideChange(guide)
            }}>{guide.title}</Menu.Item>
        })}
    </Menu>;

    return <Card title={guides ? "Interview Structure" : "Guide Structure"} bordered={false}
                 headStyle={{ textAlign: 'center' }} style={{ width: 700 }}>
        <Form {...layout}>
            {guides && <Form.Item {...tailLayout}>
                <Text>Don't start from scratch, </Text>
                <Dropdown overlay={menu}>
                    <Link className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                        select guide <DownOutlined />
                    </Link>
                </Dropdown>
            </Form.Item>}
            <Form.Item label="Intro" {...layout}>
                <TextArea
                    className={styles.input}
                    defaultValue={structure.header}
                    onChange={onHeaderChanged}
                    autoSize
                    placeholder="Take 10 minutes to introduce yourself and make the candidate comfortable." />
            </Form.Item>

            <>
                {structure.groups.map((group) => {
                    return <Form.Item label="Question Group" key={group.groupId}>
                        <Space>
                            <Input placeholder='e.g. Software Design Patterns'
                                   className={styles.inputQuestion}
                                   onChange={e => onGroupNameChanges(group.groupId, e.target.value)}
                                   defaultValue={group.name} />
                            <Button type="dashed" block icon={<PlusCircleTwoTone />}
                                    className={styles.addQuestionButton}
                                    onClick={() => {
                                        onAddQuestionClicked(group)
                                    }}>Question</Button>
                            <Popconfirm
                                title="Are you sure you want to delete this group?"
                                onConfirm={() => onRemoveGroupClicked(group.groupId)}
                                okText="Yes"
                                cancelText="No">
                                <DeleteTwoTone twoToneColor="red" />
                            </Popconfirm>
                        </Space>
                    </Form.Item>;
                })}
            </>

            <Form.Item {...tailLayout}>
                <Button className={styles.addGroupButton} type="dashed" block icon={<PlusCircleTwoTone />}
                        onClick={onAddGroupClicked}>Group</Button>
            </Form.Item>

            <Form.Item label="Overall" key={structure.footer}>
                <TextArea
                    className={styles.input}
                    defaultValue={structure.footer}
                    onChange={onFooterChanged}
                    autoSize
                    placeholder="Should the candidate proceed to the next stage?" />
            </Form.Item>
        </Form>
    </Card>
}

export default GuideStructureCard