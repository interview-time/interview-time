import { Avatar, Button, Card, Col, Dropdown, Input, List, Menu, Row, Space, Tooltip } from "antd";
import styles from "./question-bank.module.css";
import Text from "antd/lib/typography/Text";
import { getTemplateCategoryIcon, TemplateCategories } from "../../components/utils/constants";
import React, { useState } from "react";
import { EllipsisOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useAuth0 } from "../../react-auth0-spa";
import confirm from "antd/lib/modal/confirm";
import { CustomIcon } from "../../components/utils/icons";

const { Search } = Input;

const NEW_CATEGORY = "NEW_CATEGORY"

const QuestionBankCategories = ({
                                    categories,
                                    questions,
                                    loading,
                                    onCategoryClicked,
                                    onAddCategoryClicked,
                                    onEditCategoryClicked,
                                    onDeleteCategoryClicked
                                }) => {

    const { user } = useAuth0();
    const [categoriesData, setCategoriesData] = useState([]);

    React.useEffect(() => {
        let categoriesData = []
        categoriesData.push(NEW_CATEGORY) // first element is a new template card
        categories.forEach(category => {
            categoriesData.push({
                categoryName: category,
                questions: questions.filter(question => question.category === category)
            })
        })
        setCategoriesData(categoriesData)
    }, [categories, questions]);

    const onSearchChanges = e => {
        onSearchClicked(e.target.value)
    };

    const onSearchClicked = text => {
        let lowerCaseText = text.toLocaleLowerCase();
        let categoriesData = []
        categories.filter((category) => category.toLocaleLowerCase().includes(lowerCaseText)).forEach(category => {
            categoriesData.push({
                categoryName: category,
                questions: questions.filter(question => question.category === category)
            })
        })
        setCategoriesData(categoriesData)
    }

    const showDeleteConfirm = (category) => {
        confirm({
            title: `Delete '${category.title}' Category`,
            icon: <ExclamationCircleOutlined />,
            content: 'Are you sure you want to delete this category?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                onDeleteCategoryClicked(category)
            }
        });
    }

    const getTagsCount = category => {
        let tags = 0
        category.questions.forEach(item => {
            if (item.tags) {
                tags += item.tags.length
            }
        })
        return tags
    };

    const getUserName = () => {
        if (user && user.name) {
            return user.name;
        }
        return 'Unknown User'
    }

    const createMenu = (category) => <Menu>
        <Menu.Item onClick={e => {
            e.domEvent.stopPropagation()
            onEditCategoryClicked(category)
        }}>Edit category</Menu.Item>
        <Menu.Item danger onClick={e => {
            e.domEvent.stopPropagation()
            showDeleteConfirm(category)
        }}>Delete category</Menu.Item>
    </Menu>;

    return (
        <>
            <div>
                <Card className={styles.sticky}>
                    <div className={styles.tabHeader}>
                        <Text>Select category</Text>
                        <div className={styles.space} />
                        <Space>
                            <Search placeholder="Search" allowClear enterButton className={styles.tabHeaderSearch}
                                    onSearch={onSearchClicked}
                                    onChange={onSearchChanges}
                            />
                            <Button type="primary" onClick={onAddCategoryClicked}>Add category</Button>
                        </Space>
                    </div>
                </Card>
                <List
                    className={styles.categories}
                    grid={{
                        gutter: 16,
                        xs: 1,
                        sm: 2,
                        md: 3,
                        lg: 4,
                        xl: 5,
                        xxl: 5,
                    }}
                    dataSource={categoriesData}
                    loading={loading}
                    renderItem={category => <List.Item>
                        <Card hoverable bodyStyle={{ padding: 0, height: 190 }}>
                            {category !== NEW_CATEGORY && <div className={styles.card}
                                                               onClick={() => onCategoryClicked(category)}>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    {getTemplateCategoryIcon("")}
                                    {/*Temporary hard code category*/}
                                    <div style={{ color: TemplateCategories[0].color }}
                                         className={styles.category}>{TemplateCategories[0].titleShort}</div>
                                    <div style={{ flexGrow: 1 }} />
                                    <Dropdown overlay={createMenu(category)}>
                                        <EllipsisOutlined style={{ fontSize: 20 }} onClick={e => e.stopPropagation()} />
                                    </Dropdown>
                                </div>
                                <div className={styles.cardTitle}>{category.categoryName}</div>

                                <Row style={{ marginTop: 12 }}>
                                    <Col span={12}>
                                        <div className={styles.cardMetaTitle}>QUESTIONS</div>
                                        <div className={styles.cardMetaValue}>{category.questions.length}</div>
                                    </Col>
                                    <Col span={12}>
                                        <div className={styles.cardMetaTitle}>TAGS</div>
                                        <div className={styles.cardMetaValue}>{getTagsCount(category)}</div>
                                    </Col>
                                </Row>

                                <Tooltip title="Author">
                                    <Space style={{ marginTop: 12 }}>
                                        <Avatar size={24} src={user ? user.picture : null} />
                                        <span className={styles.author}>{getUserName()}</span>
                                    </Space>
                                </Tooltip>
                            </div>}
                            {category === NEW_CATEGORY && <div className={styles.card} onClick={onAddCategoryClicked}>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <CustomIcon style={{ color: '#1F1F1F', fontSize: 18 }} />
                                    <div className={styles.category}>CUSTOM</div>
                                </div>
                                <div className={styles.cardTitle}>New Category</div>
                                <div className={styles.author}>
                                    Start with a bank of questions, to make sure you’re asking a consistent set of questions.
                                </div>
                                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                    <Button type="link">Add category</Button>
                                </div>
                            </div>}
                        </Card>
                    </List.Item>}
                />
            </div>
        </>
    );
}

export default QuestionBankCategories