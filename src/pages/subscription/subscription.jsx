import React from "react";
import { Col, Row } from "antd";
import { connect } from "react-redux";
import { SubscriptionPlans } from "../../utils/constants";
import LayoutWide from "../../components/layout-wide/layout-wide";
import PricingCard from "../../components/pricing-card/pricing-card";

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

const Subscription = ({ currentPlan }) => {
    return (
        <LayoutWide header='Why go premium?'>
            <Row gutter={[32, 32]}>
                <Col span={24} lg={{ offset: 6, span: 6 }}>
                    <PricingCard
                        name='Starter'
                        title='Free forever'
                        subtitle='For individuals and startups'
                        features={starter}
                        onClick={
                            currentPlan === SubscriptionPlans.Premium
                                ? () => {
                                      console.log("Downgrade to starter");
                                  }
                                : null
                        }
                    />
                </Col>
                <Col span={24} lg={{ span: 6 }}>
                    <PricingCard
                        name='Premium'
                        title='$15 / per member / per month'
                        subtitle='For small and big companies'
                        features={premium}
                        onClick={
                            currentPlan === SubscriptionPlans.Starter
                                ? () => {
                                      console.log("Go to premium");
                                  }
                                : null
                        }
                    />
                </Col>
            </Row>
        </LayoutWide>
    );
};

const mapDispatch = {};

const mapState = state => {
    return {
        currentPlan: state.team.currentPlan,
    };
};

export default connect(mapState, mapDispatch)(Subscription);
