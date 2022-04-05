import React, { useEffect, useState } from "react";
import { filterQuestionsWithAssessment } from "../utils/filters";
import { Difficulty } from "../utils/constants";
import { Pie } from "react-chartjs-2";
import styles from "./charts.module.css";
import { Button, Tooltip } from "antd";
import { InfoCircleOutlined, WarningOutlined } from "@ant-design/icons";

/**
 *
 * @param {InterviewGroup[]} groups
 * @returns {JSX.Element}
 * @constructor
 */
const CompetenceAreaChart = ({ groups }) => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const easy = {
            label: "Easy",
            color: "#22C55E",
            value: 0,
        };
        const medium = {
            label: "Medium",
            color: "#FFC300",
            value: 0,
        };
        const hard = {
            label: "Hard",
            color: "#ff4d4f",
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
            setChartData(
                groups.map((group, index) => ({
                    label: group.name,
                    color: chartColor(index),
                    value: filterQuestionsWithAssessment(group).length,
                }))
            );
        }

        // eslint-disable-next-line
    }, [groups]);

    const COLORS = ["#FC728C", "#FEBB6B", "#8A77FB", "#08B92F", "#3E3B67", "#A247D8", "#587FC4"];

    function chartColor(index) {
        return COLORS[index % COLORS.length];
    }

    const getInfoData = () => {
        let noValueQuestions = 0;
        chartData.forEach(item => {
            if (item.value === 0) {
                noValueQuestions++;
            }
        });

        let message = "Breakdown of questions used during interview by competence area.";
        let buttonIcon = <InfoCircleOutlined />;
        let buttonStyle = styles.infoButton;
        if (noValueQuestions === groups.length) {
            message = "No questions have been asked during this interview.";
            buttonIcon = <WarningOutlined />;
            buttonStyle = styles.infoAlertButton;
        } else if (noValueQuestions === groups.length - 1) {
            message =
                "To make a more accurate candidate assessment try to ask questions from more than one competence area.";
            buttonIcon = <WarningOutlined />;
            buttonStyle = styles.infoAlertButton;
        }

        return {
            buttonStyle: buttonStyle,
            buttonIcon: buttonIcon,
            text: message,
        };
    };

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
                position: "right",
                labels: {
                    usePointStyle: true,
                    padding: 16,
                },
            },
            tooltip: {
                usePointStyle: true,
                callbacks: {
                    title: context => `${context[0].label}`,
                    label: context => ` ${context.parsed} questions`,
                    labelPointStyle: () => ({
                        pointStyle: "circle",
                    }),
                },
            },
        },
        maintainAspectRatio: false,
    };
    return (
        <div>
            <div className={styles.divSpaceBetween}>
                <div className={styles.chartTitle}>Questions by area</div>
                <Tooltip title={getInfoData().text}>
                    <Button type='text' className={getInfoData().buttonStyle} icon={getInfoData().buttonIcon} />
                </Tooltip>
            </div>
            <div className={styles.divider} />
            <div style={{ padding: 24 }}>
                <Pie data={data} options={options} height={200} />
            </div>
        </div>
    );
};

export default CompetenceAreaChart;
