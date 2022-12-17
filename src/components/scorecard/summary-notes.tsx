import { Col, Row, Typography, Input } from "antd";
import Card from "../card/card";
import styles from "./summary-notes.module.css";
import { Status } from "../../utils/constants";
import { RedFlagsTags } from "../tags/red-flags-tags";
import { defaultTo } from "lodash";
import { Interview } from "../../store/models";

const { TextArea } = Input;
const { Title, Paragraph } = Typography;

type Props = {
    interview: Readonly<Interview>;
    onNotesChange?: (text: string) => void;
    onRedFlagsChange?: (flags: string[]) => void;
};

export const SummaryNotesCard = ({ interview, onNotesChange, onRedFlagsChange }: Props) => {
    const notesEditable = onNotesChange != null;

    return (
        <Row gutter={24}>
            <Col span={16}>
                <Card withPadding={false} className={styles.notesCard}>
                    <Title level={4} className={styles.notesTitle}>
                        Summary notes
                    </Title>
                    <div className={styles.divider} />
                    {!notesEditable && (
                        <Paragraph className={styles.notesTextArea}>
                            {interview.notes ? interview.notes : "No summary was left"}
                        </Paragraph>
                    )}
                    {notesEditable && (
                        <TextArea
                            {...(interview.status === Status.SUBMITTED ? { readonly: "true" } : {})}
                            className={styles.notesTextArea}
                            placeholder='No summary was left, you can still add notes now'
                            bordered={false}
                            autoSize={{ minRows: 1 }}
                            onChange={e => onNotesChange(e.target.value)}
                            defaultValue={interview.notes}
                        />
                    )}
                </Card>
            </Col>
            <Col span={8}>
                <Card withPadding={false} className={styles.notesCard}>
                    <Title level={4} className={styles.notesTitle}>
                        Red flags
                    </Title>
                    <div className={styles.divider} />
                    {(!interview.redFlags || interview.redFlags.length === 0) && (
                        <Paragraph className={styles.notesTextArea}>No red flags</Paragraph>
                    )}
                    {interview.redFlags && interview.redFlags.length > 0 && (
                        <div className={styles.redFlagsHolder}>
                            {/* @ts-ignore */}
                            <RedFlagsTags flags={defaultTo(interview.redFlags, [])} onChange={onRedFlagsChange} />
                        </div>
                    )}
                </Card>
            </Col>
        </Row>
    );
};
