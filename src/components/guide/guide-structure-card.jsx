import React, {useState} from 'react';
import styles from "./guide-structure-card.module.css";
import {DeleteTwoTone, PlusCircleTwoTone} from '@ant-design/icons';
import {Button, Card, Form, Input, Popconfirm, Space} from "antd";
import lang from "lodash/lang";
import array from "lodash/array";

const {TextArea} = Input;

const layout = {
    labelCol: {span: 6},
    wrapperCol: {span: 18},
};

const tailLayout = {
    wrapperCol: {offset: 6, span: 18},
};

const GuideStructureCard = (props) => {
    const structure = props.structure
    const [groups, setGroups] = useState(structure.groups ? lang.cloneDeep(structure.groups) : [])

    const onGroupNameChanges = (groupId, groupName) => {
        structure.groups.find(group => group.groupId === groupId).name = groupName
    };

    const onAddGroupClicked = () => {
        const newGroup = {
            groupId: Date.now().toString(),
            questions: []
        }

        structure.groups.push(newGroup)
        setGroups([...groups, newGroup])
    }

    const onRemoveGroupClicked = id => {
        array.remove(structure.groups, group => group.groupId === id)
        setGroups(groups.filter(group => group.groupId !== id))
    }

    const onHeaderChanged = event => {
        structure.header = event.target.value
    }

    const onFooterChanged = event => {
        structure.footer = event.target.value
    }

    return <Card title="Guide Structure" bordered={false} headStyle={{textAlign: 'center'}} style={{width: 700}}>
        <Form {...layout}>
            <Form.Item label="Intro" {...layout}>
                <TextArea
                    className={styles.input}
                    defaultValue={structure.header}
                    onChange={onHeaderChanged}
                    autoSize
                    placeholder="Take 10 minutes to introduce yourself and make the candidate comfortable." />
            </Form.Item>

            <>
                {groups.map((group) => {
                    return <Form.Item label="Question Group" key={group.groupId}>
                        <Space>
                            <Input placeholder='e.g. Software Design Patterns'
                                   className={styles.inputQuestion}
                                   onChange={e => onGroupNameChanges(group.groupId, e.target.value)}
                                   defaultValue={group.name} />
                            <Button type="dashed" block icon={<PlusCircleTwoTone />}
                                    className={styles.addQuestionButton}
                                    onClick={() => {props.onAddQuestionClicked(group)}}>Question</Button>
                            <Popconfirm
                                title="Are you sure you want to delete this group?"
                                onConfirm={() => onRemoveGroupClicked(group.groupId)}
                                okText="Yes"
                                cancelText="No">
                                <DeleteTwoTone twoToneColor="red"  />
                            </Popconfirm>
                        </Space>
                    </Form.Item>;
                })}
            </>

            <Form.Item {...tailLayout}>
                <Button className={styles.addGroupButton} type="dashed" block icon={<PlusCircleTwoTone />}
                        onClick={onAddGroupClicked}>Group</Button>
            </Form.Item>

            <Form.Item label="Overall">
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