import React, { useEffect, useState } from "react";
import { CheckIcon, CopyIcon, LinkIcon } from "../../utils/icons";
import { Button, Input, Modal, Switch, Typography } from "antd";
import { CopyToClipboard } from "react-copy-to-clipboard";
import copy from "copy-to-clipboard";
import { connect } from "react-redux";
import { shareScorecard, unshareScorecard } from "../../store/interviews/actions";
import { getHost } from "../../utils/route";
import styles from "./share-report-modal.module.css";
import { selectInterview } from "../../store/interviews/selector";
import { ApiRequestStatus, RootState } from "../../store/state-models";

const { Text } = Typography;
type Props = {
    interviewId: string;
    token?: string;
    visible: boolean;
    isShared?: boolean;
    generatingLink: boolean;
    onClose: () => void;
    shareScorecard: Function;
    unshareScorecard: Function;
};

const ShareReportModal = ({
    interviewId,
    visible,
    onClose,
    token,
    isShared,
    generatingLink,
    shareScorecard,
    unshareScorecard,
}: Props) => {
    const [copied, setCopied] = useState(false);
    const [isSharedSwitch, setIsSharedSwitch] = useState(isShared);
    const [requestLink, setRequestLink] = useState(false);

    const getSharedURL = () => (token ? encodeURI(`${getHost()}/public/scorecard/${token}`) : "");

    useEffect(() => {
        let timeoutId: NodeJS.Timeout | undefined = undefined;

        if (copied) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(function () {
                setCopied(false);
            }, 1000);
        }

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [copied]);

    useEffect(() => {
        if (token && !generatingLink && isShared && requestLink) {
            setIsSharedSwitch(true);
            copy(encodeURI(`${getHost()}/public/scorecard/${token}`));
            setCopied(true);
            setRequestLink(false);
        }
    }, [token, generatingLink, requestLink, isShared]);

    const createLinkAndCopy = () => {
        setRequestLink(true);
        shareScorecard(interviewId);
    };
    return (
        /* @ts-ignore */
        <Modal
            destroyOnClose={true}
            title='Share your scorecard'
            visible={visible}
            closable={true}
            footer={null}
            width={600}
            onCancel={() => onClose()}
        >
            <div>
                <div className={styles.shareLinkRow}>
                    <Text>Anyone with with the link can view the scorecard</Text>
                    {!isSharedSwitch && (
                        <Button icon={<LinkIcon />} type='primary' onClick={createLinkAndCopy} loading={generatingLink}>
                            Create and copy link
                        </Button>
                    )}
                </div>
                {isSharedSwitch && (
                    <>
                        <div className={styles.shareLinkRow}>
                            <Input
                                className={styles.shareTokenInput}
                                style={{ marginRight: 12 }}
                                value={getSharedURL()}
                            />

                            <CopyToClipboard text={getSharedURL()} onCopy={() => setCopied(true)}>
                                <Button icon={copied ? <CheckIcon /> : <CopyIcon />} type='primary'>
                                    {copied ? "Copied" : "Copy link"}
                                </Button>
                            </CopyToClipboard>
                        </div>
                        <div className={styles.shareLinkFineprint}>
                            <Text type='secondary'>
                                This link is active. If you disable it, anyone with the link will lose access to the
                                scorecard.
                            </Text>
                            <Switch
                                defaultChecked={isSharedSwitch}
                                onChange={checked => {
                                    setIsSharedSwitch(checked);
                                    if (checked) {
                                        shareScorecard(interviewId);
                                    } else {
                                        unshareScorecard(interviewId);
                                    }
                                }}
                            />
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
};

const mapDispatch = { shareScorecard, unshareScorecard };

const mapStateToProps = (state: RootState, ownProps: any) => {
    const interview = selectInterview(state, ownProps.interviewId);

    return {
        token: interview?.token,
        isShared: interview?.isShared,
        generatingLink: state.interviews.apiResults.ShareScorecard.status === ApiRequestStatus.InProgress,
    };
};

export default connect(mapStateToProps, mapDispatch)(ShareReportModal);
