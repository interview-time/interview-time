import { getAccessTokenSilently } from "../react-auth0-spa";
import axios, { AxiosRequestConfig } from "axios";
import { config } from "../store/common";
import { UploadRequestOption as RcCustomRequestOptions } from "rc-upload/lib/interface";
import { log } from "./log";
import { v4 as uuidv4 } from "uuid";
import { getApiUrl } from "./route";

export const generateInterviewChallengeToken = (
    teamId: string,
    challengeId: string,
    interviewId: string,
    onSuccess: (token: string) => void,
    onError: (token: Error) => void
) => {
    const url = `${getApiUrl()}/team/${teamId}/challenge/${challengeId}/interview/${interviewId}/token`;
    getAccessTokenSilently()
        .then(token => axios.get(url, config(token)))
        .then(res => onSuccess(res.data))
        .catch((error: Error) => onError(error));
};

export const uploadChallengeFile = (teamId: string, challengeId: string) => {
    return async (options: RcCustomRequestOptions<string>) => {
        const { file, onSuccess, onError, onProgress } = options;

        log(file);
        let filename = uuidv4();

        if (file instanceof File) {
            const fileExtension = file.name.split(".").pop();
            if (fileExtension) {
                filename += `.${fileExtension}`;
            }
        }

        const axiosConfig: AxiosRequestConfig = {
            onUploadProgress: (event: any) => {
                // @ts-ignore
                onProgress?.({ percent: (event.loaded / event.total) * 100 });
            },
        };

        const url = `${getApiUrl()}/team/${teamId}/challenge/${challengeId}/filename/${filename}/upload`;

        getAccessTokenSilently()
            .then(token => axios.get(url, config(token)))
            .then(res => axios.put(res.data.url, file, axiosConfig))
            .then(() => onSuccess?.(filename))
            .catch((error: Error) => onError?.(error));
    };
};

export const downloadChallengeFile = (
    teamId: string,
    challengeId: string,
    filename: string,
    onSuccess: (token: string) => void,
    onError: (token: Error) => void
) => {
    const url = `${getApiUrl()}/team/${teamId}/challenge/${challengeId}/filename/${filename}/download`;
    getAccessTokenSilently()
        .then(token => axios.get(url, config(token)))
        .then(res => onSuccess(res.data.url))
        .catch((error: Error) => onError(error));
};
