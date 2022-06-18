import { loadTeam } from "../../store/team/actions";
import { selectActiveTeam } from "../../store/user/selector";
import { connect } from "react-redux";
import React, { useEffect } from "react";
import AccountLayout from "./account-layout";
import Spinner from "../../components/spinner/spinner";
import Title from "antd/lib/typography/Title";
import Card from "../../components/card/card";
import { Button, Col, Modal, Row } from "antd";
import Text from "antd/lib/typography/Text";
import styles from "./team-billing.module.css";
import { CheckFilledIcon, UncheckFilledIcon } from "../../utils/icons";
import { SubscriptionPlans } from "../../utils/constants";
import { selectTeamPlanName, selectTeamPrice } from "../../store/team/selector";
import PaymentForm from "../../components/stripe/payment-form";
import IllustrationSection from "./illustration-section";
import { isTeamAdmin } from "../../store/user/permissions";
import CancelImage from "../../assets/cancel.svg";
import FeedbackModal from "../feedback/modal-feedback";

/**
 *
 * @param {string} userEmail
 * @param {Team} team
 * @param {TeamDetails|undefined} teamDetails
 * @param loadTeam
 * @returns {JSX.Element}
 * @constructor
 */
const TeamBilling = ({ userEmail, team, teamDetails, loadTeam }) => {
    const [feedbackVisible, setFeedbackVisible] = React.useState(false);

    useEffect(() => {
        loadTeam(team.teamId);

        // eslint-disable-next-line
    }, [team]);

    const isAdmin = isTeamAdmin(team);

    const isStarterPlan = () => teamDetails.plan === SubscriptionPlans.Starter;

    const isPremiumPlan = () => teamDetails.plan === SubscriptionPlans.Premium;

    const PaidFeatureIcon = () => (isPremiumPlan() ? <CheckFilledIcon /> : <UncheckFilledIcon />);

    const onDecreaseSeatsClicked = () => {
        setFeedbackVisible(true);
    };

    const onFeedbackClose = () => {
        setFeedbackVisible(false);
    };

    const onChangePlanClicked = () => {
        Modal.error({
            title: "Error",
            content: "Only the team administrator has permission to change the team plan.",
        });
    };

    return (
        <AccountLayout>
            {teamDetails ? (
                <>
                    <Card>
                        <Title level={4} style={{ marginBottom: 20 }}>
                            Billing
                        </Title>
                        <Row justify='space-between'>
                            <Col span={6}>
                                <Title level={5} className={styles.noMargin}>
                                    Current Plan
                                </Title>
                                <Text>{selectTeamPlanName(teamDetails)}</Text>
                            </Col>
                            <Col span={6}>
                                <div className={styles.priceHolder}>
                                    <Title level={2} className={styles.noMargin}>
                                        {teamDetails.seats}
                                    </Title>
                                    <Text className={styles.priceLabel}>seats</Text>
                                </div>
                            </Col>
                            <Col span={6}>
                                {isStarterPlan() && (
                                    <Title level={2} className={styles.noMargin}>
                                        {selectTeamPrice(teamDetails)}
                                    </Title>
                                )}
                                {isPremiumPlan() && (
                                    <div className={styles.priceHolder}>
                                        <Title level={2} className={styles.noMargin}>
                                            {selectTeamPrice(teamDetails)}
                                        </Title>
                                        <Text className={styles.priceLabel}>$ per month</Text>
                                    </div>
                                )}
                            </Col>
                            <Col span={6}>
                                <div className={styles.buttonHolder}>
                                    {isAdmin && (
                                        <PaymentForm
                                            buttonText={isStarterPlan() ? "Go Premium" : "Buy More Seats"}
                                            priceId={process.env.REACT_APP_PREMIUM_PRICE_ID}
                                            userEmail={userEmail}
                                            teamId={teamDetails.teamId}
                                        />
                                    )}
                                    {!isAdmin && (
                                        <Button type='primary' onClick={onChangePlanClicked}>
                                            {isStarterPlan() ? "Go Premium" : "Buy More Seats"}
                                        </Button>
                                    )}
                                </div>
                            </Col>
                        </Row>
                        <Row justify='space-between' className={styles.featuresRow}>
                            <Col>
                                <div className={styles.featureItem}>
                                    <CheckFilledIcon />
                                    <Text className={styles.featureText}>Centralized workspace</Text>
                                </div>
                                <div className={styles.featureItem}>
                                    <CheckFilledIcon />
                                    <Text className={styles.featureText}>Library templates</Text>
                                </div>
                                <div className={styles.featureItem}>
                                    <CheckFilledIcon />
                                    <Text className={styles.featureText}>Team templates</Text>
                                </div>
                            </Col>
                            <Col>
                                <div className={styles.featureItem}>
                                    <CheckFilledIcon />
                                    <Text className={styles.featureText}>Interview insights</Text>
                                </div>
                                <div className={styles.featureItem}>
                                    <CheckFilledIcon />
                                    <Text className={styles.featureText}>Candidate comparison</Text>
                                </div>
                                <div className={styles.featureItem}>
                                    <CheckFilledIcon />
                                    <Text className={styles.featureText}>Candidate scorecards & reports</Text>
                                </div>
                            </Col>
                            <Col>
                                <div className={styles.featureItem}>
                                    {PaidFeatureIcon()}
                                    <Text className={styles.featureText}>Workflow integrations</Text>
                                </div>
                                <div className={styles.featureItem}>
                                    {PaidFeatureIcon()}
                                    <Text className={styles.featureText}>Limited to 2 members</Text>
                                </div>
                                <div className={styles.featureItem}>
                                    {PaidFeatureIcon()}
                                    <Text className={styles.featureText}>Dedicated support</Text>
                                </div>
                            </Col>
                        </Row>
                        {isPremiumPlan() && isAdmin && (
                            <IllustrationSection
                                title='Want to cancel plan or decrease number of seats?'
                                description={
                                    <span>
                                        If you cancel the premium plan or decrease the number of seats, all extra
                                        members of your team will be transferred into <b>view-only</b> mode.
                                    </span>
                                }
                                buttonText='Decrease Seats'
                                buttonType='outlined'
                                onButtonClicked={onDecreaseSeatsClicked}
                                illustration={<img src={CancelImage} alt='Cancel' />}
                                style={{ marginTop: 32 }}
                            />
                        )}
                    </Card>
                    <FeedbackModal
                        title='Cancel plan or decrease number of seats'
                        description='Please specify if you want to cancel plan or decrease number of seats. This request may take up to 24 hours to complete.'
                        visible={feedbackVisible}
                        onClose={onFeedbackClose}
                    />
                </>
            ) : (
                <Spinner />
            )}
        </AccountLayout>
    );
};

const mapDispatch = { loadTeam };

const mapState = state => {
    const userState = state.user || {};

    return {
        email: userState.profile.email,
        team: selectActiveTeam(userState.profile),
        teamDetails: state.team.details,
    };
};

export default connect(mapState, mapDispatch)(TeamBilling);
