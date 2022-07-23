import { getHost, routeTeamBilling } from "../../utils/route";
import { Button } from "antd";
import React from "react";

type Props = {
    teamId: string;
    priceId: string;
    userEmail: string;
    buttonText: string;
};

const PaymentForm = ({ teamId, priceId, userEmail, buttonText }: Props) => {
    return (
        <form action={`${process.env.REACT_APP_API_URL}/payments/stripe-session`} method='POST'>
            <input type='hidden' name='PriceId' value={priceId} />
            <input type='hidden' name='SuccessUrl' value={`${getHost()}${routeTeamBilling()}`} />
            <input type='hidden' name='CancelUrl' value={`${getHost()}${routeTeamBilling()}`} />
            <input type='hidden' name='Email' value={userEmail} />
            <input type='hidden' name='TeamId' value={teamId} />

            <Button block htmlType='submit' type='primary'>
                {buttonText}
            </Button>
        </form>
    );
};

export default PaymentForm;
