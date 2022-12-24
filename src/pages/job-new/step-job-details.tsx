import { FormLabel } from "../../assets/styles/global-styles";
import { Content, FormContainer, NextButton, SecondaryText } from "./styles";
import { Form, FormInstance, Input, Select, Typography } from "antd";
import React from "react";
import styled from "styled-components";
import { JobDetails, TeamMember, UserProfile } from "../../store/models";
import { filterOptionLabel } from "../../utils/filters";
import DatePicker from "../../components/antd/DatePicker";
import { datePickerFormat } from "../../utils/date-fns";

const { Title } = Typography;
const { TextArea } = Input;

const JobForm = styled(Form)`
    width: 600px;
`;

const DeadlineDatePicker = styled(DatePicker)`
    width: 100%;
`;

type Props = {
    job: JobDetails;
    profile: UserProfile;
    teamMembers: TeamMember[];
    form: FormInstance;
    onNext: () => void;
};

const StepJobDetails = ({ job, profile, teamMembers, form, onNext }: Props) => {
    const teamMemberOptions = [
        {
            label: `${profile.name} (you)`,
            value: profile.userId,
        },
        ...teamMembers
            .filter(member => member.userId !== profile.userId)
            .map(member => ({
                label: member.name,
                value: member.userId,
            })),
    ];

    const onNextClicked = () => {
        form.submit();
    };

    return (
        <Content>
            <Title level={4}>Fill out details</Title>
            <SecondaryText>Target the right candidates, write down job detail information</SecondaryText>
            <FormContainer>
                <JobForm
                    name='basic'
                    layout='vertical'
                    form={form}
                    onFinish={onNext}
                    initialValues={{
                        owner: profile.userId,
                        title: job.title,
                        department: job.department,
                        location: job.location,
                        deadline: job.deadline,
                        tags: job.tags,
                        description: job.description,
                    }}
                >
                    <Form.Item
                        name='owner'
                        label={<FormLabel>Owner</FormLabel>}
                        rules={[
                            {
                                required: true,
                                message: "Please select job owner",
                            },
                        ]}
                    >
                        <Select placeholder='Jon Doe' options={teamMemberOptions} filterOption={filterOptionLabel} />
                    </Form.Item>
                    <Form.Item
                        name='title'
                        label={<FormLabel>Title</FormLabel>}
                        rules={[
                            {
                                required: true,
                                message: "Please enter job title",
                            },
                        ]}
                    >
                        <Input placeholder='Sr. Software Engineer' />
                    </Form.Item>
                    <Form.Item
                        name='department'
                        label={<FormLabel>Department</FormLabel>}
                        rules={[
                            {
                                required: true,
                                message: "Please select company department",
                            },
                        ]}
                    >
                        <Input placeholder='Engineering' />
                    </Form.Item>
                    <Form.Item name='location' label={<FormLabel>Location</FormLabel>}>
                        <Input placeholder='Remote (Australia)' />
                    </Form.Item>

                    <Form.Item name='deadline' label={<FormLabel>Deadline</FormLabel>}>
                        <DeadlineDatePicker format={datePickerFormat()} />
                    </Form.Item>
                    <Form.Item name='tags' label={<FormLabel>Tags</FormLabel>}>
                        <Select mode='tags' placeholder='Remote, Mobile, Urgent, etc.' />
                    </Form.Item>
                    <Form.Item name='description' label={<FormLabel>Description</FormLabel>}>
                        <TextArea
                            autoSize={{ minRows: 3, maxRows: 5 }}
                            placeholder='Responsibilities, experience and skills requirements, salary range, etc.'
                        />
                    </Form.Item>
                </JobForm>
                <NextButton type='primary' onClick={onNextClicked}>
                    Next
                </NextButton>
            </FormContainer>
        </Content>
    );
};

export default StepJobDetails;
