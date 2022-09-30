import { Button, Card } from "antd";
import Title from "antd/lib/typography/Title";
import React, { useCallback, useEffect, useState } from "react";
import AccountLayout from "./account-layout";
import { useMergeLink } from "@mergeapi/react-merge-link";
import { connect } from "react-redux";
import { getLinkToken, swapPublicToken } from "../../store/integration/actions";
import { RootState } from "../../store/state-models";
import { TeamDetails, IntegrationStatus } from "../../store/models";
import { ReactComponent as NoIntegrationImg } from "../../assets/illustrations/integration.svg";
import EmptyState from "../../components/empty-state/empty-state";
import Spinner from "../../components/spinner/spinner";
import { canIntegrateWithATS } from "../../store/user/permissions";

type Props = {
    linkToken?: string;
    loading: boolean;
    teamDetails?: TeamDetails;
    getLinkToken: any;
    swapPublicToken: any;
    canIntegrate: boolean;
};

const TeamIntegration = ({ linkToken, loading, teamDetails, getLinkToken, swapPublicToken, canIntegrate }: Props) => {
    const [openMergeLink, setOpenMergeLink] = useState(false);

    const onSuccess = useCallback((publicToken: string) => {
        swapPublicToken(publicToken);
        // eslint-disable-next-line
    }, []);

    const { open, isReady } = useMergeLink({
        linkToken: linkToken,
        onSuccess,
    });

    const onIntegrationClicked = () => {
        setOpenMergeLink(true);

        if (linkToken && isReady) {
            open();
            setOpenMergeLink(false);
        } else {
            getLinkToken();
        }
    };

    useEffect(() => {
        if (linkToken && isReady && openMergeLink) {
            open();
            setOpenMergeLink(false);
        }
        // eslint-disable-next-line
    }, [linkToken, isReady, openMergeLink]);

    return (
        <AccountLayout>
            <Card>
                <Title level={4} style={{ marginBottom: 20 }}>
                    Integration
                </Title>

                {teamDetails ? (
                    canIntegrate ? (
                        <>
                            {teamDetails.integration?.status &&
                            teamDetails.integration.status === IntegrationStatus.Completed ? (
                                <>
                                    <p>Integration with you ATS is successfully established.</p>
                                    <Button loading={loading} onClick={onIntegrationClicked}>
                                        Manage Integration
                                    </Button>
                                </>
                            ) : (
                                <EmptyState
                                    message='Integrate with your ATS.'
                                    secondMessage='Sync candidates and their assessment results.'
                                    buttonText='Start Integration'
                                    buttonLoading={loading}
                                    onButtonClicked={onIntegrationClicked}
                                    illustration={<NoIntegrationImg width={200} height={200} />}
                                />
                            )}
                        </>
                    ) : (
                        <EmptyState
                            message="You don't have permissions."
                            secondMessage='Only admins can create an integration with ATS.'
                            illustration={<NoIntegrationImg width={200} height={200} />}
                        />
                    )
                ) : (
                    <Spinner />
                )}
            </Card>
        </AccountLayout>
    );
};

const mapDispatch = { getLinkToken, swapPublicToken };

const mapState = (state: RootState) => {
    const integrationState = state.integration;
    const teamState = state.team;

    return {
        linkToken: integrationState.linkToken,
        loading: integrationState.loading,
        teamDetails: teamState.details,
        canIntegrate: canIntegrateWithATS(state),
    };
};

export default connect(mapState, mapDispatch)(TeamIntegration);
