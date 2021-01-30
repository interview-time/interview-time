import { Avatar, Button, Card, Col, Input, List, Row, Space, Statistic } from "antd";
import styles from "./question-bank.module.css";
import Text from "antd/lib/typography/Text";
import { getAvatarColor, getAvatarText } from "../utils/constants";
import React, { useState } from "react";

const { Meta } = Card;
const { Search } = Input;

const QuestionBankPersonalCategories = ({
                                            categories,
                                            questions,
                                            loading,
                                            onCategoryClicked,
                                            onAddCategoryClicked,
                                        }) => {

    const [categoriesData, setCategoriesData] = useState([]);

    React.useEffect(() => {
        let categoriesData = []
        categories.forEach(category => {
            categoriesData.push({
                categoryName: category,
                questions: questions.filter(question => question.category === category)
            })
        })
        setCategoriesData(categoriesData)
    }, [categories, questions]);

    const onCategorySearchChanges = e => {
        onCategorySearchClicked(e.target.value)
    };

    const onCategorySearchClicked = text => {
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

    const getTagsCount = category => {
        let tags = 0
        category.questions.forEach(item => {
            if (item.tags) {
                tags += item.tags.length
            }
        })
        return tags
    };

    return (
        <>
            <div>
                <Card>
                    <div className={styles.tabHeader}>
                        <Text>Select category</Text>
                        <div className={styles.space} />
                        <Space>
                            <Search placeholder="Search" allowClear enterButton className={styles.tabHeaderSearch}
                                    onSearch={onCategorySearchClicked}
                                    onChange={onCategorySearchChanges}
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
                        sm: 1,
                        md: 2,
                        lg: 3,
                        xl: 4,
                        xxl: 4,
                    }}
                    dataSource={categoriesData}
                    loading={loading}
                    renderItem={category => <List.Item>
                        <Card hoverable onClick={() => onCategoryClicked(category)}>
                            <Meta title={category.categoryName} avatar={
                                <Avatar size="large" style={{
                                    backgroundColor: getAvatarColor(category.categoryName),
                                    verticalAlign: 'middle',
                                }}>{getAvatarText(category.categoryName)}</Avatar>}
                            />
                            <Row span={24}>
                                <Col span={12}>
                                    <Statistic title="Questions"
                                               value={category.questions.length}
                                               valueStyle={{ fontSize: "large" }} />
                                </Col>
                                <Col span={12}>
                                    <Statistic title="Tags"
                                               value={getTagsCount(category)}
                                               valueStyle={{ fontSize: "large" }} />
                                </Col>
                            </Row>
                        </Card>
                    </List.Item>}
                />
            </div>
        </>
    );
}

export default QuestionBankPersonalCategories