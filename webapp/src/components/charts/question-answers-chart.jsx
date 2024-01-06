import React, { useEffect, useState } from "react";
import { filterQuestionsWithAssessment } from "../../utils/filters";
import { QuestionAssessment } from "../../utils/constants";
import { Bar } from "react-chartjs-2";
import styles from "./charts.module.css";
import { Button, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

/**
 *
 * @param {InterviewGroup[]} groups
 * @returns {JSX.Element}
 * @constructor
 */
const QuestionAnswersChart = ({ groups }) => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const unanswered = {
            label: "No Answer",
            color: "#ff4d4f",
            value: 0,
        };
        const poor = {
            label: "Poor",
            color: "#D6BBFD",
            value: 0,
        };
        const good = {
            label: "Good",
            color: "#9F77EB",
            value: 0,
        };
        const excellent = {
            label: "Excellent",
            color: "#6941C7",
            value: 0,
        };
        if (groups && groups.length > 0) {
            groups.forEach(group => {
                filterQuestionsWithAssessment(group).forEach(question => {
                    if (question.assessment === QuestionAssessment.POOR) {
                        poor.value++;
                    } else if (question.assessment === QuestionAssessment.GOOD) {
                        good.value++;
                    } else if (question.assessment === QuestionAssessment.EXCELLENT) {
                        excellent.value++;
                    } else if (question.assessment === QuestionAssessment.UNANSWERED) {
                        unanswered.value++;
                    }
                });
            });
            setChartData([unanswered, poor, good, excellent]);
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
        indexAxis: "y",
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                usePointStyle: true,
                callbacks: {
                    label: context => ` ${context.parsed.x} questions`,
                    labelPointStyle: () => ({
                        pointStyle: "circle",
                    }),
                },
            },
        },
        scales: {
            x: {
                grid: {
                    color: "#f2f2f2",
                    drawBorder: false,
                },
            },
            y: {
                grid: {
                    display: false,
                },
            },
        },
        maintainAspectRatio: false,
    };
    return (
        <div>
            <div className={styles.divSpaceBetween}>
                <div className={styles.chartTitle}>Questions answer rate</div>
                <Tooltip title='Breakdown of questions used during interview by answer.'>
                    <Button type='text' className={styles.infoButton} icon={<InfoCircleOutlined />} />
                </Tooltip>
            </div>
            <div className={styles.divider} />
            <div style={{ padding: 24 }}>
                <Bar data={data} options={options} height={200} />
            </div>
        </div>
    );
};

export default QuestionAnswersChart;
