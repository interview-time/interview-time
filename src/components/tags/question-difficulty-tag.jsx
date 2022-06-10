import React from "react";
import styles from "./question-difficulty-tag.module.css";
import { Difficulty } from "../../utils/constants";
import { Dropdown, Menu, Tooltip } from "antd";
import Text from "antd/lib/typography/Text";

/**
 *
 * @param {Difficulty} string
 * @param {Function} onChange
 * @param {boolean} editable
 * @returns {JSX.Element}
 * @constructor
 */
const QuestionDifficultyTag = ({ difficulty: difficultyParam, onChange, editable = false }) => {
    const [difficulty, setDifficulty] = React.useState(difficultyParam ? difficultyParam : Difficulty.DEFAULT);

    const getDotStyle = difficulty => {
        switch (difficulty) {
            case Difficulty.EASY:
                return styles.dotEasy;
            case Difficulty.MEDIUM:
                return styles.dotMedium;
            case Difficulty.HARD:
                return styles.dotHard;
            default:
                return styles.dotEasy;
        }
    };

    const onDifficultyChange = difficulty => {
        setDifficulty(difficulty);
        onChange(difficulty);
    };

    const menu = (
        <Menu>
            <Text type='secondary' className={styles.menuHeader}>
                Question difficulty
            </Text>
            <Menu.Divider />
            <Menu.Item onClick={() => onDifficultyChange(Difficulty.EASY)}>
                <span className={getDotStyle(Difficulty.EASY)} />
                <Text className={styles.menuItem}>{Difficulty.EASY}</Text>
            </Menu.Item>
            <Menu.Item onClick={() => onDifficultyChange(Difficulty.MEDIUM)}>
                <span className={getDotStyle(Difficulty.MEDIUM)} />
                <Text className={styles.menuItem}>{Difficulty.MEDIUM}</Text>
            </Menu.Item>
            <Menu.Item onClick={() => onDifficultyChange(Difficulty.HARD)}>
                <span className={getDotStyle(Difficulty.HARD)} />
                <Text className={styles.menuItem}>{Difficulty.HARD}</Text>
            </Menu.Item>
        </Menu>
    );

    return editable ? (
        <Dropdown overlay={menu}>
            <div className={styles.dotHolder}>
                <span className={getDotStyle(difficulty)} />
            </div>
        </Dropdown>
    ) : (
        <Tooltip title={`${difficulty} question`}>
            <div className={styles.dotHolder}>
                <span className={getDotStyle(difficulty)} />
            </div>
        </Tooltip>
    );
};

export default QuestionDifficultyTag;
