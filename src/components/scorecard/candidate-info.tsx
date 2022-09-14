import { Space } from "antd";
import styles from "../../pages/interview-scorecard/step-assessment/type-interview/interview-sections.module.css";
import { GithubFilled, LinkedinFilled } from "@ant-design/icons";
import { TextNoteIcon } from "../../utils/icons";
import React from "react";
import { Candidate } from "../../store/models";

type Props = {
    candidate?: Candidate;
    className?: string;
};

export const CandidateInfo = ({ candidate, className }: Props) => {
    const iconStyle = { fontSize: 20, color: "#374151" };

    const getUrlPathname = (url: string) => {
        try {
            return new URL(url).pathname;
        } catch (e) {
            return url;
        }
    };

    return (
        <Space className={className} direction='vertical' size={12}>
            {candidate && candidate.linkedIn && (
                <div className={styles.divHorizontal}>
                    <LinkedinFilled style={iconStyle} />
                    <a className={styles.reportLabel} href={candidate.linkedIn} target='_blank' rel='noreferrer'>
                        {getUrlPathname(candidate.linkedIn)}
                    </a>
                </div>
            )}
            {candidate && candidate.gitHub && (
                <div className={styles.divHorizontal}>
                    <GithubFilled style={iconStyle} />
                    <a className={styles.reportLabel} href={candidate.linkedIn} target='_blank' rel='noreferrer'>
                        {getUrlPathname(candidate.gitHub)}
                    </a>
                </div>
            )}
            {candidate && candidate.resumeUrl && (
                <div className={styles.divHorizontal}>
                    <TextNoteIcon style={iconStyle} />
                    <a className={styles.reportLabel} href={candidate.resumeUrl} target='_blank' rel='noreferrer'>
                        resume.pdf
                    </a>
                </div>
            )}
        </Space>
    );
};
