import React, { useEffect, useState } from "react";
import { filterQuestionsWithAssessment } from "../utils/filters";
import { Difficulty } from "../utils/constants";
import { Bar } from "react-chartjs-2";
import styles from "./charts.module.css";
import { Button, Tooltip } from "antd";
import { InfoCircleOutlined, WarningOutlined } from "@ant-design/icons";

/**
 *
 * @param {InterviewGroup[]} groups
 * @returns {JSX.Element}
 * @constructor
 */
const QuestionDifficultyChart = ({ groups }) => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const easy = {
            label: "Easy",
            color: "#82B2FF",
            value: 0,
        };
        const medium = {
            label: "Medium",
            color: "#5899FF",
            value: 0,
        };
        const hard = {
            label: "Hard",
            color: "#2E7FFF",
            value: 0,
        };
        if (groups && groups.length > 0) {
            groups.forEach(group => {
                filterQuestionsWithAssessment(group).forEach(question => {
                    if (question.difficulty === Difficulty.EASY) {
                        easy.value++;
                    } else if (question.difficulty === Difficulty.MEDIUM) {
                        medium.value++;
                    } else if (question.difficulty === Difficulty.HARD) {
                        hard.value++;
                    }
                });
            });
            setChartData([easy, medium, hard]);
        }

        // eslint-disable-next-line
    }, [groups]);

    const data = {
        labels: chartData.map(item => item.label),
        datasets: [
            {
                data: chartData.map(item => item.value),
                backgroundColor: chartData.map(item => item.color),
            },
        ],
    };
    const options = {
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                usePointStyle: true,
                callbacks: {
                    label: context => ` ${context.parsed.y} questions`,
                    labelPointStyle: () => ({
                        pointStyle: "circle",
                    }),
                },
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
            },
            y: {
                grid: {
                    color: "#f2f2f2",
                    drawBorder: false,
                },
            },
        },
        maintainAspectRatio: false,
    };

    const getInfoData = () => {
        let noValueQuestions = 0;
        chartData.forEach(item => {
            if (item.value === 0) {
                noValueQuestions++;
            }
        });

        let message = "Breakdown of questions used during interview by difficulty.";
        let buttonIcon = <InfoCircleOutlined />;
        let buttonStyle = styles.infoButton;
        if (noValueQuestions === 3) {
            message = "No questions have been asked during this interview.";
            buttonIcon = <WarningOutlined />;
            buttonStyle = styles.infoAlertButton;
        } else if (noValueQuestions === 2) {
            message = "To make a more accurate candidate assessment try to ask 'Easy', 'Medium' and 'Hard' questions.";
            buttonIcon = <WarningOutlined />;
            buttonStyle = styles.infoAlertButton;
        }

        return {
            buttonStyle: buttonStyle,
            buttonIcon: buttonIcon,
            text: message,
        };
    };

    return (
        <div>
            <div className={styles.divSpaceBetween}>
                <div className={styles.chartTitle}>Questions by difficulty</div>
                <div>
                    <Tooltip title={getInfoData().text}>
                        <Button type='text' className={getInfoData().buttonStyle} icon={getInfoData().buttonIcon} />
                    </Tooltip>
                </div>
            </div>
            <div className={styles.divider} />
            <div style={{ padding: 24 }}>
                <Bar data={data} options={options} height={200} />
            </div>
        </div>
    );
};

export default QuestionDifficultyChart;
