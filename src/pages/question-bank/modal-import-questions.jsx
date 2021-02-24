import { Alert, Button, Collapse, Space } from "antd";
import React, { useRef, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import styles from "./modal-category-details.module.css";
import Text from "antd/lib/typography/Text";
import { parse as parseCSV } from "csv-string"
import Modal from "antd/lib/modal/Modal";

const { Panel } = Collapse;

const IMAGE_URL = process.env.PUBLIC_URL + '/question-bank/csv-import.png'

const ImportQuestionsModal = ({ visible, onImport, onCancel }) => {

    const fileInput = useRef(null)
    const [data, setData] = useState();

    React.useEffect(() => {
        if (visible) {
            setData(null)
        }
    }, [visible])

    const handleFileInput = (e) => {
        // handle validations
        const file = e.target.files[0];
        if (file) {
            let reader = new FileReader();
            reader.onload = (event) => {
                const parsedCSV = parseCSV(event.target.result)
                setData({
                    file: file.name,
                    questions: parsedCSV
                })
            }
            reader.readAsText(file)
        }
    };

    const onImportClicked = () => {
        if (data && data.questions) {
            onImport(data.questions)
        }
    }

    const onCancelClicked = () => {
        onCancel()
    }

    return (
        <Modal
            title={"Import Questions"}
            visible={visible}
            closable={false}
            destroyOnClose={true}
            onClose={onCancelClicked}
            footer={[
                <div className={styles.footer}>
                    <div className={styles.space} />
                    <Space>
                        <Button onClick={onCancelClicked}>Cancel</Button>
                        <Button type="primary" onClick={onImportClicked}>Import</Button>
                    </Space>
                </div>
            ]}
        >
            <div>
                <Space direction="vertical">
                    <img alt="Intro" src={IMAGE_URL} className={styles.image} />
                    <Alert
                        message="If you want to quickly import your existing questions, upload a .csv file with questions."
                        type="info"
                        showIcon
                        banner
                    />
                    <Collapse>
                        <Panel header="Example of .csv file with questions">
                            <code>What is a Data Structure? </code><br />
                            <code>What are linear and non-linear data Structures?</code><br />
                            <code>How is an Array different from Linked List? </code><br />
                            <code>Which data structures are used for BFS and DFS of a graph? </code><br />
                        </Panel>
                    </Collapse>
                    {data && <div style={{ marginTop: '12px' }}>
                        <Text>We found <Text strong>{data.questions.length}
                        </Text> questions in the <Text strong>{data.file}</Text> file.</Text>
                        <br/>
                        <Text>Click on the 'Import' button to finish.</Text>
                    </div>}
                    <input
                        ref={fileInput}
                        type="file"
                        accept="text/csv"
                        onChange={handleFileInput}
                        style={{ display: 'none' }}
                    />
                    <Button
                        icon={<UploadOutlined />}
                        onClick={() => fileInput.current && fileInput.current.click()}>Select File</Button>
                </Space>
            </div>
        </Modal>
    );
}

export default ImportQuestionsModal