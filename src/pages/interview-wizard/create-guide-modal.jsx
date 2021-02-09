import { Alert, Form, Input, Modal, Select } from "antd";
import React, { useState } from "react";
import { isEmpty } from "../../components/utils/utils";
import { useDispatch } from "react-redux";
import lang from "lodash/lang";
import { questionsToQuestionIds } from "../../components/utils/converters";
import { addGuide } from "../../store/guides/actions";
import { difference, head } from "lodash/array";

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

const categories = [
    { value: 'Behavioral' },
    { value: 'Technical' },
    { value: 'Management' },
];

const CreateGuideModal = ({ visible, interview, guides, guidesLoading, onClose }) => {

    const noError = {
        status: null,
        help: null,
    }

    const [guide] = useState({
        guideId: undefined,
        structure: {
            header: null,
            footer: null,
            groups: [],
        }
    });

    const [guidIds, setGuideIds] = useState([]);
    const [titleError, setTitleError] = useState(noError);
    const [categoryError, setCategoryError] = useState(noError);

    const dispatch = useDispatch();

    React.useEffect(() => {
        if (visible) {
            const guideIdsUpdated = guides.map(guide => guide.guideId)
            const newGuides = difference(guideIdsUpdated, guidIds)
            interview.guideId = head(newGuides)
            onClose()
        }
        // eslint-disable-next-line
    }, [guides]);

    const onTitleChange = e => {
        guide.title = e.target.value;
        setTitleError(noError)
    }

    const onCategoryChange = value => {
        guide.type = value;
        setCategoryError(noError)
    }

    const isDataValid = () => {
        let valid = true;
        if (isEmpty(guide.title)) {
            valid = false;
            setTitleError({
                status: 'error',
                help: "This field is required",
            })
        }

        if (isEmpty(guide.type)) {
            valid = false;
            setCategoryError({
                status: 'error',
                help: "This field is required",
            })
        }

        return valid
    }

    const onCreateClicked = () => {
        if (isDataValid()) {
            setGuideIds(guides.map(guide => guide.guideId))

            const structure = lang.cloneDeep(interview.structure)
            structure.groups.forEach(group => {
                group.questions = questionsToQuestionIds(group.questions)
            })
            guide.structure = structure
            dispatch(addGuide(guide))
        }
    }

    return (
        <Modal title={"Do you want to save this interview as a template?"}
               destroyOnClose={true}
               closable={false}
               confirmLoading={guidesLoading}
               visible={visible}
               okText="Yes"
               canelText="No"
               onOk={onCreateClicked}
               onCancel={() => onClose()}
        >
            <Alert
                message="If you save this interview as a template, you can use it next time you create an interview. Navigate to 'Templates' menu if you want to edit interview templates."
                type="info"
                style={{ marginBottom: 24 }}
                showIcon
            />
            <Form {...layout} preserve={false}>
                <Form.Item label="Title" {...layout}
                           validateStatus={titleError.status}
                           help={titleError.help}>
                    <Input
                        placeholder="Software Developer"
                        onChange={onTitleChange}
                    />
                </Form.Item>
                <Form.Item label="Category" {...layout}
                           validateStatus={categoryError.status}
                           help={categoryError.help}>
                    <Select
                        placeholder="Select category"
                        onSelect={onCategoryChange}
                        options={categories}
                        showSearch
                        filterOption={(inputValue, option) =>
                            option.value.toLocaleLowerCase().includes(inputValue)
                        }
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default CreateGuideModal