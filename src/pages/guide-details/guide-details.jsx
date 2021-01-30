import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { connect } from "react-redux";
import { addGuide, deleteGuide, loadGuides, updateGuide } from "../../store/guides/actions";
import styles from "./guide-details.module.css";
import Layout from "../../components/layout/layout";
import {
    Button,
    Card,
    Col,
    Drawer,
    Form,
    Input,
    message,
    Modal,
    PageHeader,
    Popconfirm,
    Row,
    Select,
    Tabs
} from 'antd';
import Text from "antd/es/typography/Text";
import GuideStructureCard from "../../components/guide/guide-structure-card";
import GuideQuestionGroup from "../../components/guide/guide-question-group";
import GuideInterviewDetailsCard from "../../components/guide/guide-interview-details-card";
import Arrays from "lodash";
import lang from "lodash/lang";

const { TabPane } = Tabs;
const { TextArea } = Input;

const categories = [
    { value: 'Behavioral' },
    { value: 'Technical' },
    { value: 'Management' },
];

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};

const tailLayout = {
    wrapperCol: { offset: 6, span: 18 },
};

const STEP_DETAILS = 1
const STEP_STRUCTURE = 2
const STEP_QUESTIONS = 3

const TAB_DETAILS = "details"
const TAB_STRUCTURE = "structure"

const GuideDetails = ({ guides, loading, loadGuides, addGuide, deleteGuide, updateGuide }) => {

    const emptyGuide = {
        guideId: undefined,
        structure: {
            groups: []
        }
    }

    const [step, setStep] = useState(STEP_DETAILS);
    const [guide, setGuide] = useState(emptyGuide);
    const [selectedGroup, setSelectedGroup] = useState({
        group: {},
        questions: []
    });
    const [preview, setPreview] = useState({
        placement: 'right',
        visible: false
    });
    const history = useHistory();
    const { id } = useParams();

    const isNewGuideFlow = () => !id;

    React.useEffect(() => {
        if (!isNewGuideFlow() && !guide.guideId && !loading) {
            const guide = guides.find(guide => guide.guideId === id);
            if (guide) {
                setGuide(lang.cloneDeep(guide))
            }
        }
        // eslint-disable-next-line 
    }, [guides, id]);

    React.useEffect(() => {
        if (!isNewGuideFlow() && guides.length === 0 && !loading) {
            loadGuides();
        }
        // eslint-disable-next-line
    }, []);

    const isDetailsStep = () => step === STEP_DETAILS

    const isStructureStep = () => step === STEP_STRUCTURE

    const isQuestionsStep = () => step === STEP_QUESTIONS

    const onBackClicked = () => {
        Modal.confirm({
            title: "If you have unsaved changes, they will be lost. Are you sure that you want to exit?",
            okText: "Yes",
            cancelText: "No",
            onOk() {
                history.push("/guides");
            }
        })
    }

    const onTabClicked = (key) => {
        if (key === TAB_DETAILS) {
            setStep(STEP_DETAILS)
        } else if (key === TAB_STRUCTURE) {
            setStep(STEP_STRUCTURE)
        }
    }

    const getActiveTab = () => {
        if (isDetailsStep()) {
            return TAB_DETAILS
        } else if (isStructureStep()) {
            return TAB_STRUCTURE
        }
    }

    const onDeleteClicked = () => {
        deleteGuide(guide.guideId);
        history.push("/guides");
        message.success(`Guide '${guide.title}' removed.`);
    }

    const onSaveClicked = () => {
        const emptyGroupName = Arrays.find(guide.structure.groups, (group) => {
            return !group.name || group.name.length === 0
        })

        if (!guide.title || guide.title.length === 0) {
            Modal.warn({
                title: "Please provide 'Title'.",
            })
        } else if (!guide.type || guide.type.length === 0) {
            Modal.warn({
                title: "Please provide 'Category'.",
            })
        } else if (emptyGroupName) {
            Modal.warn({
                title: "Please provide 'Question Group' name.",
            })
        } else {
            if (isNewGuideFlow()) {
                addGuide(guide);
                message.success(`Guide '${guide.title}' created.`);
            } else {
                updateGuide(guide);
                message.success(`Guide '${guide.title}' updated.`);
            }
            history.push("/guides");
        }
    }

    const onTitleChange = e => {
        guide.title = e.target.value
    };

    const onTypeChange = value => {
        guide.type = value
    };

    const onDescriptionChange = e => {
        guide.description = e.target.value
    };

    const onGroupQuestionsChange = (groupQuestions) => {
        setSelectedGroup({
            ...selectedGroup,
            questions: groupQuestions
        })
    }

    const onAddQuestionDiscard = () => {
        setStep(STEP_STRUCTURE)
        setSelectedGroup({
            group: {},
            questions: []
        })
    }
    const onAddQuestionConfirmed = () => {
        const updatedGuide = lang.cloneDeep(guide)
        updatedGuide.structure.groups
            .find(group => group.groupId === selectedGroup.group.groupId)
            .questions = lang.cloneDeep(selectedGroup.questions.map(question => question.questionId))

        setStep(STEP_STRUCTURE)
        setGuide(updatedGuide)
    }

    const onAddQuestionClicked = (group) => {
        setStep(STEP_QUESTIONS)
        setSelectedGroup({
            ...selectedGroup,
            group: group
        })
    }

    const onGroupNameChanges = (groupId, groupName) => {
        guide.structure.groups.find(group => group.groupId === groupId).name = groupName
    };

    const onAddGroupClicked = () => {
        const newGroup = {
            groupId: Date.now().toString(),
            questions: []
        }

        let newGuide = lang.cloneDeep(guide)
        newGuide.structure.groups.push(newGroup)
        setGuide(newGuide)
    }

    const onRemoveGroupClicked = id => {
        let newGuide = lang.cloneDeep(guide)
        newGuide.structure.groups = newGuide.structure.groups.filter(group => group.groupId !== id)
        setGuide(newGuide)
    }

    const onHeaderChanged = event => {
        guide.structure.header = event.target.value
    }

    const onFooterChanged = event => {
        guide.structure.footer = event.target.value
    }

    const onPreviewClosed = () => {
        setPreview({
            ...preview,
            visible: false
        })
    };

    const onPreviewClicked = () => {
        setPreview({
            ...preview,
            visible: true
        })
    }

    const createDetailsCard = <Col className={styles.detailsCard}>
        <Card key={guide.guideId} title="Guide Details" bordered={false} headStyle={{ textAlign: 'center' }}>
            <Form
                name="details"
                {...layout}>
                <Form.Item label="Title">
                    <Input
                        placeholder="Software Developer"
                        onChange={onTitleChange}
                        defaultValue={guide.title}
                        className={styles.input}
                    />
                </Form.Item>
                <Form.Item label="Category">
                    <Select
                        placeholder="Select category"
                        defaultValue={guide.type}
                        onSelect={onTypeChange}
                        className={styles.input}
                        options={categories}
                        showSearch
                        filterOption={(inputValue, option) =>
                            option.value.toLocaleLowerCase().includes(inputValue)
                        }
                    />
                </Form.Item>
                <Form.Item label="Description">
                    <TextArea
                        placeholder="Guide description"
                        defaultValue={guide.description}
                        onChange={onDescriptionChange}
                        className={styles.textArea}
                        autoSize
                    />
                </Form.Item>
                {!isNewGuideFlow() && <Form.Item {...tailLayout}>
                    <Popconfirm
                        title="Are you sure you want to delete this guide?"
                        onConfirm={onDeleteClicked}
                        okText="Yes"
                        cancelText="No">
                        <Button type="default" danger>Delete</Button>
                    </Popconfirm>
                </Form.Item>}
            </Form>
        </Card>
    </Col>

    return <Layout pageHeader={
        <>
            {(isDetailsStep() || isStructureStep()) && <PageHeader
                className={styles.pageHeader}
                onBack={() => onBackClicked()}
                title={isNewGuideFlow() ? "New Interview Guide" : "Edit Interview Guide"}
                extra={[
                    <Button type="default" onClick={onPreviewClicked}>
                        <span className="nav-text">Preview</span>
                    </Button>,
                    <Button type="primary" onClick={onSaveClicked}>Save</Button>
                ]}
                footer={
                    <Tabs defaultActiveKey={getActiveTab} onChange={onTabClicked}>
                        <TabPane tab="Details" key={TAB_DETAILS} />
                        <TabPane tab="Structure" key={TAB_STRUCTURE} />
                    </Tabs>
                }
            >
                {isDetailsStep() && <Text>
                    Enter interview guide detail information so you can easily discover it among other
                    guides.</Text>}
                {isStructureStep() && <Text>
                    Stay organized and structure the interview guide. <Text strong>Grouping</Text> questions helps
                    to evaluate skills in a particular area and make a more granular assessment. Click on the <Text
                    strong>preview</Text> button to see the changes.</Text>}
            </PageHeader>
            }
            {isQuestionsStep() && <PageHeader
                className={styles.pageHeader}
                onBack={onAddQuestionDiscard}
                title="Add questions to question group"
                extra={[
                    <Button type="default" onClick={onAddQuestionDiscard}>
                        <span className="nav-text">Discard</span>
                    </Button>,
                    <Button type="primary" onClick={onAddQuestionConfirmed}>
                        <span className="nav-text">Done</span>
                    </Button>
                ]}>
                <Text>Click + button to add questions from your question bank to the question group.</Text>
            </PageHeader>}
        </>
    }>
        <Row gutter={16} justify="center">
            {isDetailsStep() && createDetailsCard}
            {isStructureStep() && <Col>
                <GuideStructureCard
                    structure={guide.structure}
                    onAddQuestionClicked={onAddQuestionClicked}
                    onHeaderChanged={onHeaderChanged}
                    onFooterChanged={onFooterChanged}
                    onAddGroupClicked={onAddGroupClicked}
                    onRemoveGroupClicked={onRemoveGroupClicked}
                    onGroupNameChanges={onGroupNameChanges} />
            </Col>}
            <Drawer
                title="Interview Experience"
                width="90%"
                closable={true}
                destroyOnClose={true}
                onClose={onPreviewClosed}
                drawerStyle={{ backgroundColor: "#F0F2F5" }}
                placement={preview.placement}
                visible={preview.visible}
                key={preview.placement}>
                <GuideInterviewDetailsCard guide={guide} />
            </Drawer>
            {isQuestionsStep() && <Col span={24}>
                <GuideQuestionGroup
                    group={selectedGroup.group}
                    onGroupQuestionsChange={onGroupQuestionsChange} />
            </Col>}
        </Row>
    </Layout>
}

const mapStateToProps = state => {
    const { guides, loading } = state.guides || {};

    return { guides, loading };
};

export default connect(mapStateToProps, { loadGuides, addGuide, deleteGuide, updateGuide })(GuideDetails);