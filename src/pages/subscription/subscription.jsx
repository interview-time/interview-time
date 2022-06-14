import React from "react";
import { Col, Row, Button } from "antd";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { BackIcon, TeamCircleIcon } from "../../utils/icons";
import { SubscriptionPlans } from "../../utils/constants";
import LayoutWide from "../../components/layout-wide/layout-wide";
import PricingCard from "../../components/pricing-card/pricing-card";
import Spinner from "../../components/spinner/spinner";
import Feature from "../../components/feature/feature";
import styles from "./subscription.module.css";

const starter = [
    { name: "Centralized workspace", available: true },
    { name: "Library templates", available: true },
    { name: "Team templates", available: true },
    { name: "Candidate scorecards & reports", available: true },
    { name: "Candidate comparison", available: true },
    { name: "Interview insights", available: true },
    { name: "Workflow integrations", available: false },
    { name: "Limited to 2 members", available: false },
];

const premium = [
    { name: "Centralized workspace", available: true },
    { name: "Library templates", available: true },
    { name: "Team templates", available: true },
    { name: "Candidate scorecards & reports", available: true },
    { name: "Candidate comparison", available: true },
    { name: "Interview insights", available: true },
    { name: "Workflow integrations", available: true },
    { name: "Unlimited members", available: true },
];

const Subscription = ({ currentPlan, loading, email, teamId }) => {
    const history = useHistory();

    if (loading) {
        return <Spinner />;
    }

    return (
        <LayoutWide>
            <div className={styles.header}>
                <Button className={styles.backButton} icon={<BackIcon />} size='large' onClick={() => history.goBack()} />
                <h1>Why go premium?</h1>
            </div>

            <Row gutter={[32, 32]}>
                <Col span={24} lg={{ offset: 5, span: 5 }} className={styles.feature}>
                    <Feature
                        icon={<TeamCircleIcon />}
                        title='Unlimited Team Members'
                        description='Grow your team of interviewers to scale hiring process'
                    />
                </Col>
                <Col span={24} lg={{ span: 4 }} className={styles.feature}>
                    <Feature
                        icon={<TeamCircleIcon />}
                        title='Integrations'
                        description='Connect with applicant tracking systems (ATS) to stremline hiring workflow'
                    />
                </Col>
                <Col span={24} lg={{ span: 5 }} className={styles.feature}>
                    <Feature icon={<TeamCircleIcon />} title='Support' description='Dedicated email and chat support' />
                </Col>
            </Row>
            <Row gutter={[32, 32]}>
                <Col
                    span={24}
                    md={12}
                    lg={{ offset: 3, span: 9 }}
                    xl={{ offset: 4, span: 8 }}
                    xxl={{ offset: 6, span: 6 }}
                >
                    <PricingCard
                        key={SubscriptionPlans.Starter}
                        plan={SubscriptionPlans.Starter}
                        title='Free forever'
                        subtitle='For individuals and startups'
                        features={starter}
                        currentPlan={currentPlan}
                        email={email}
                        teamId={teamId}
                    />
                </Col>
                <Col span={24} md={12} lg={9} xl={8} xxl={6}>
                    <PricingCard
                        key={SubscriptionPlans.Premium}
                        plan={SubscriptionPlans.Premium}
                        title='$15 / per member / per month'
                        subtitle='For small and big companies'
                        features={premium}
                        priceId={process.env.REACT_APP_PREMIUM_PRICE_ID}
                        currentPlan={currentPlan}
                        email={email}
                        teamId={teamId}
                    />
                </Col>
            </Row>
        </LayoutWide>
    );
};

const mapState = state => {
    return {
        currentPlan: state.team.details?.plan,
        loading: state.team.loading,
        email: state.user.profile.email,
        teamId: state.user.profile.currentTeamId,
    };
};

export default connect(mapState, null)(Subscription);
