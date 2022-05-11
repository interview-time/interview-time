import React, { useState, useEffect } from "react";
import { CheckIcon, CopyIcon } from "../../components/utils/icons";
import { Button, Input, Modal, Switch } from "antd";
import Text from "antd/lib/typography/Text";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { connect } from "react-redux";
import { shareScorecard, unshareScorecard } from "../../store/interviews/actions";
import { selectInterview } from "../../store/interviews/selector";
import Spinner from "../../components/spinner/spinner";
import { getHost } from "../../components/utils/route";
import styles from "./interview-scorecard.module.css";

const ShareScorecard = ({ interviewId, visible, onClose, token, isShared, shareScorecard, unshareScorecard }) => {
    const [copied, setCopied] = useState(false);
    const [isSharedSwitch, setIsSharedSwitch] = useState(isShared);

    useEffect(() => {
        if (!token && visible) {
            shareScorecard(interviewId);
            setIsSharedSwitch(true);
        }
    }, [token, visible, shareScorecard, interviewId]);

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
            {token ? (
                <div>
                    <Text className={styles.shareLinkRow}>Anyone with with the link can view the scorecard</Text>
                    <div className={styles.shareLinkRow}>
                        <Input className={styles.shareTokenInput} style={{ marginRight: 12 }} value={getSharedURL()} />

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
                </div>
            ) : (
                <Spinner />
            )}
        </Modal>
    );
};

const mapDispatch = { shareScorecard, unshareScorecard };

const mapStateToProps = (state, ownProps) => {
    const interview = selectInterview(state, ownProps.interviewId);

    return {
        token: interview?.token,
        isShared: interview?.isShared,
    };
};

export default connect(mapStateToProps, mapDispatch)(ShareScorecard);
