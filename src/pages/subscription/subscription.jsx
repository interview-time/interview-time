import React from "react";
import { Col, Row } from "antd";
import { connect } from "react-redux";
import { SubscriptionPlans } from "../../utils/constants";
import LayoutWide from "../../components/layout-wide/layout-wide";
import PricingCard from "../../components/pricing-card/pricing-card";
import Spinner from "../../components/spinner/spinner";

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
    { name: "Limited to 2 members", available: true },
];

const Subscription = ({ currentPlan, loading, email }) => {
    if (loading) {
        return <Spinner />;
    }
    return (
        <LayoutWide header='Why go premium?'>
            <Row gutter={[32, 32]}>
                <Col span={24} lg={{ offset: 6, span: 6 }}>
                    <PricingCard
                        key={SubscriptionPlans.Starter}
                        plan={SubscriptionPlans.Starter}
                        title='Free forever'
                        subtitle='For individuals and startups'
                        features={starter}
                        currentPlan={currentPlan}
                        email={email}
                    />
                </Col>
                <Col span={24} lg={{ span: 6 }}>
                    <PricingCard
                        key={SubscriptionPlans.Premium}
                        plan={SubscriptionPlans.Premium}
                        title='$15 / per member / per month'
                        subtitle='For small and big companies'
                        features={premium}
                        priceId={process.env.REACT_APP_PREMIUM_PRICE_ID}
                        currentPlan={currentPlan}
                        email={email}
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
    };
};

export default connect(mapState, null)(Subscription);
