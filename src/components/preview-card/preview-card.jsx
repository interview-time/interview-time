import React from "react";
import { Modal } from "antd";
import { useHistory } from "react-router-dom";
import { TemplatePreviewCard } from "../../pages/interview-scorecard/interview-sections";
import LibraryCard from "../library-card/library-card";
import {
    routeTemplateDetails,
    routeInterviewAddFromLibrary,
    routeInterviewAddFromTemplate, routeTemplateAddFromLibrary,
} from "../utils/route";

const PreviewCard = ({ template }) => {
    const [previewModalVisible, setPreviewModalVisible] = React.useState(false);
    const history = useHistory();

    const onPreviewClosed = () => {
        setPreviewModalVisible(false);
    };

    const onPreview = () => {
        setPreviewModalVisible(true);
    };

    const onEditClicked = (template) => {
        setPreviewModalVisible(false);
        onEdit(template.templateId);
    };

    const onEdit = (templateId) => {
        history.push(routeTemplateDetails(templateId));
    };

    const onCreateInterviewClicked = (template) => {
        setPreviewModalVisible(false);
        if (template.templateId) {
            history.push(routeInterviewAddFromTemplate(template.templateId));
        } else if (template.libraryId) {
            history.push(routeInterviewAddFromLibrary(template.libraryId));
        }
    };

    const onCreateTemplateClicked = (template) => {
        history.push(routeTemplateAddFromLibrary(template.libraryId));
    }

    var totalquestions = 0;

    template.structure?.groups?.forEach((group) => (totalquestions += group.questions.length));

    return (
        <>
            <LibraryCard
                key={template.id}
                name={template.title}
                image={template.image}
                totalQuestions={totalquestions}
                onClick={() => onPreview()}
            />

            <Modal
                title={null}
                footer={null}
                closable={false}
                destroyOnClose={true}
                width={1000}
                style={{ top: "5%" }}
                bodyStyle={{ backgroundColor: "#EEF0F2F5" }}
                onCancel={onPreviewClosed}
                visible={previewModalVisible}
            >
                <TemplatePreviewCard
                    template={template}
                    onCloseClicked={onPreviewClosed}
                    onEditClicked={() => onEditClicked(template)}
                    onCreateInterviewClicked={() => onCreateInterviewClicked(template)}
                    onCreateTemplateClicked={() => onCreateTemplateClicked(template)}
                />
            </Modal>
        </>
    );
};

export default PreviewCard;
