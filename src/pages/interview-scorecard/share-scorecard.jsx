import React, { useState, useEffect } from "react";
import { CheckIcon, CopyIcon, LinkIcon } from "../../components/utils/icons";
import { Button, Input, Modal, Switch } from "antd";
import Text from "antd/lib/typography/Text";
import { CopyToClipboard } from "react-copy-to-clipboard";
import copy from "copy-to-clipboard";
import { connect } from "react-redux";
import { shareScorecard, unshareScorecard } from "../../store/interviews/actions";
import { selectInterview } from "../../store/interviews/selector";
import { getHost } from "../../components/utils/route";
import styles from "./interview-scorecard.module.css";

const ShareScorecard = ({
    interviewId,
    visible,
    onClose,
    token,
    isShared,
    shareScorecard,
    unshareScorecard,
    generatingLink,
}) => {
    const [copied, setCopied] = useState(false);
    const [isSharedSwitch, setIsSharedSwitch] = useState(isShared);
    const [requestLink, setRequestLink] = useState(false);

    useEffect(() => {
        let timeoutId;

        if (copied) {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
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
            copy(getSharedURL());
            setCopied(true);
            setRequestLink(false);            
        }
    }, [token, generatingLink, requestLink]);

    const createLinkAndCopy = () => {
        setRequestLink(true);
        shareScorecard(interviewId);
    };

    const getSharedURL = () => (token ? encodeURI(`${getHost()}/public/scorecard/${token}`) : null);

    return (
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

const mapStateToProps = (state, ownProps) => {
    const interview = selectInterview(state, ownProps.interviewId);

    return {
        token: interview?.token,
        isShared: interview?.isShared,
        generatingLink: state.interviews.generatingLink,
    };
};

export default connect(mapStateToProps, mapDispatch)(ShareScorecard);
