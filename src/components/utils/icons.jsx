import Icon from '@ant-design/icons';

const QuestionBankSvg = () => (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
        <path
            d="M10.9998 8.01752C10.9905 8.42363 10.6584 8.74999 10.25 8.74999C9.5 8.74999 9.5 7.9989 9.5 7.9989V7.99777L9.50001 7.99539L9.50006 7.99017C9.50032 7.9755 9.50072 7.96084 9.50144 7.94618C9.50262 7.92198 9.50473 7.89159 9.50846 7.8559C9.51591 7.78477 9.52996 7.69092 9.55665 7.58186C9.60973 7.36492 9.71565 7.07652 9.92848 6.78906C10.3825 6.17582 11.1982 5.72727 12.513 5.7501C13.4627 5.76659 14.3059 6.16497 14.834 6.82047C15.371 7.48704 15.5517 8.3902 15.1964 9.27853C14.8342 10.1839 14.0149 10.5437 13.5442 10.7503L13.4932 10.7728C13.2147 10.8957 13.0813 10.9599 13.0013 11.024L13 11.0251V11.7492C13.0001 12.1634 12.6643 12.4999 12.2501 12.5C11.8359 12.5 11.5001 12.1643 11.5 11.7501V11C11.5 10.4769 11.752 10.1029 12.0633 9.85345C12.3134 9.65303 12.6276 9.51483 12.8491 9.4174L12.8875 9.40049C13.4292 9.16137 13.6868 9.01346 13.8036 8.72145C13.9483 8.35977 13.8789 8.02596 13.6659 7.76153C13.4439 7.48604 13.0371 7.25943 12.487 7.24988C11.5518 7.23364 11.2425 7.53509 11.134 7.68162C11.0656 7.77404 11.0309 7.86797 11.0137 7.93838C11.0052 7.973 11.0017 7.99908 11.0003 8.01197L10.9998 8.01752Z" />
        <path
            d="M12.25 15.5C12.8023 15.5 13.25 15.0523 13.25 14.5C13.25 13.9477 12.8023 13.5 12.25 13.5C11.6977 13.5 11.25 13.9477 11.25 14.5C11.25 15.0523 11.6977 15.5 12.25 15.5Z" />
        <path
            d="M4 4.5C4 3.11929 5.11929 2 6.5 2H18C19.3807 2 20.5 3.11929 20.5 4.5V18.75C20.5 19.1642 20.1642 19.5 19.75 19.5H5.5C5.5 20.0523 5.94772 20.5 6.5 20.5H19.75C20.1642 20.5 20.5 20.8358 20.5 21.25C20.5 21.6642 20.1642 22 19.75 22H6.5C5.11929 22 4 20.8807 4 19.5V4.5ZM5.5 4.5V18H19V4.5C19 3.94772 18.5523 3.5 18 3.5H6.5C5.94772 3.5 5.5 3.94772 5.5 4.5Z" />
    </svg>
);

export const QuestionBankIcon = props => <Icon component={QuestionBankSvg} {...props} />;

const GuideSvg = () => (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
        <path
            d="M17.7499 2.00096C18.9407 2.00096 19.9155 2.92612 19.9947 4.09691L19.9999 4.25096V19.749C19.9999 20.9399 19.0747 21.9147 17.9039 21.9938L17.7499 21.999H6.25C5.05914 21.999 4.08436 21.0739 4.00519 19.9031L4 19.749V4.25096C4 3.0601 4.92516 2.08532 6.09595 2.00615L6.25 2.00096H17.7499ZM17.7499 3.50096H6.25C5.8703 3.50096 5.55651 3.78312 5.50685 4.14919L5.5 4.25096V19.749C5.5 20.1287 5.78215 20.4425 6.14823 20.4922L6.25 20.499H17.7499C18.1296 20.499 18.4434 20.2169 18.493 19.8508L18.4999 19.749V4.25096C18.4999 3.87127 18.2177 3.55747 17.8516 3.50781L17.7499 3.50096ZM12.2481 12.9973C12.6623 12.9973 12.9981 13.3331 12.9981 13.7473C12.9981 14.127 12.7159 14.4408 12.3498 14.4904L12.2481 14.4973H7.74994C7.33572 14.4973 6.99994 14.1615 6.99994 13.7473C6.99994 13.3676 7.28209 13.0538 7.64817 13.0041L7.74994 12.9973H12.2481ZM16.2499 9.99864C16.6642 9.99864 16.9999 10.3344 16.9999 10.7486C16.9999 11.1283 16.7178 11.4421 16.3517 11.4918L16.2499 11.4986H7.74994C7.33572 11.4986 6.99994 11.1629 6.99994 10.7486C6.99994 10.3689 7.28209 10.0552 7.64817 10.0055L7.74994 9.99864H16.2499ZM16.2499 6.99999C16.6642 6.99999 16.9999 7.33578 16.9999 7.74999C16.9999 8.12969 16.7178 8.44349 16.3517 8.49315L16.2499 8.49999H7.74994C7.33572 8.49999 6.99994 8.16421 6.99994 7.74999C6.99994 7.3703 7.28209 7.0565 7.64817 7.00684L7.74994 6.99999H16.2499Z"
        />
    </svg>
);

export const GuideIcon = props => <Icon component={GuideSvg} {...props} />;

const InterviewSvg = () => (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
        <path
            d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 16.6944 7.30558 20.5 12 20.5C16.6944 20.5 20.5 16.6944 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5ZM10.75 13.4393L15.2197 8.96967C15.5126 8.67678 15.9874 8.67678 16.2803 8.96967C16.5466 9.23594 16.5708 9.6526 16.3529 9.94621L16.2803 10.0303L11.2803 15.0303C11.0141 15.2966 10.5974 15.3208 10.3038 15.1029L10.2197 15.0303L7.71967 12.5303C7.42678 12.2374 7.42678 11.7626 7.71967 11.4697C7.98594 11.2034 8.4026 11.1792 8.69621 11.3971L8.78033 11.4697L10.75 13.4393L15.2197 8.96967L10.75 13.4393Z"
        />
    </svg>
);

export const InterviewIcon = props => <Icon component={InterviewSvg} {...props} />;

const ReorderSvg = () => (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
        <path
            d="M15.5 17C16.3284 17 17 17.6716 17 18.5C17 19.3284 16.3284 20 15.5 20C14.6716 20 14 19.3284 14 18.5C14 17.6716 14.6716 17 15.5 17ZM8.5 17C9.32843 17 10 17.6716 10 18.5C10 19.3284 9.32843 20 8.5 20C7.67157 20 7 19.3284 7 18.5C7 17.6716 7.67157 17 8.5 17ZM15.5 10C16.3284 10 17 10.6716 17 11.5C17 12.3284 16.3284 13 15.5 13C14.6716 13 14 12.3284 14 11.5C14 10.6716 14.6716 10 15.5 10ZM8.5 10C9.32843 10 10 10.6716 10 11.5C10 12.3284 9.32843 13 8.5 13C7.67157 13 7 12.3284 7 11.5C7 10.6716 7.67157 10 8.5 10ZM15.5 3C16.3284 3 17 3.67157 17 4.5C17 5.32843 16.3284 6 15.5 6C14.6716 6 14 5.32843 14 4.5C14 3.67157 14.6716 3 15.5 3ZM8.5 3C9.32843 3 10 3.67157 10 4.5C10 5.32843 9.32843 6 8.5 6C7.67157 6 7 5.32843 7 4.5C7 3.67157 7.67157 3 8.5 3Z" />
    </svg>
);

export const ReorderIcon = props => <Icon component={ReorderSvg} {...props} />;

const ProfileSvg = () => (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
        <path
            d="M15.5859 14.0977C16.6484 14.4648 17.6055 14.9766 18.457 15.6328C19.3086 16.2891 20.0352 17.0547 20.6367 17.9297C21.2383 18.8047 21.6992 19.7539 22.0195 20.7773C22.3398 21.8008 22.5 22.875 22.5 24H21C21 22.7187 20.7734 21.5313 20.3203 20.4375C19.8672 19.3437 19.2344 18.3906 18.4219 17.5781C17.6094 16.7656 16.6602 16.1367 15.5742 15.6914C14.4883 15.2461 13.2969 15.0156 12 15C11.1641 15 10.3594 15.1055 9.58594 15.3164C8.8125 15.5273 8.09375 15.8242 7.42969 16.207C6.76562 16.5898 6.16016 17.0547 5.61328 17.6016C5.06641 18.1484 4.60156 18.7539 4.21875 19.418C3.83594 20.082 3.53516 20.8047 3.31641 21.5859C3.09766 22.3672 2.99219 23.1719 3 24H1.5C1.5 22.875 1.66406 21.8008 1.99219 20.7773C2.32031 19.7539 2.78516 18.8086 3.38672 17.9414C3.98828 17.0742 4.71484 16.3164 5.56641 15.668C6.41797 15.0195 7.375 14.5 8.4375 14.1094C7.82812 13.7812 7.28125 13.3828 6.79688 12.9141C6.3125 12.4453 5.90234 11.9258 5.56641 11.3555C5.23047 10.7852 4.96875 10.1719 4.78125 9.51562C4.59375 8.85938 4.5 8.1875 4.5 7.5C4.5 6.46094 4.69531 5.48828 5.08594 4.58203C5.47656 3.67578 6.01172 2.87891 6.69141 2.19141C7.37109 1.50391 8.16406 0.96875 9.07031 0.585938C9.97656 0.203125 10.9531 0.0078125 12 0C13.0391 0 14.0117 0.195313 14.918 0.585938C15.8242 0.976562 16.6211 1.51172 17.3086 2.19141C17.9961 2.87109 18.5312 3.66406 18.9141 4.57031C19.2969 5.47656 19.4922 6.45312 19.5 7.5C19.5 8.1875 19.4102 8.85547 19.2305 9.50391C19.0508 10.1523 18.7891 10.7617 18.4453 11.332C18.1016 11.9023 17.6914 12.4219 17.2148 12.8906C16.7383 13.3594 16.1953 13.7617 15.5859 14.0977ZM6 7.5C6 8.32812 6.15625 9.10547 6.46875 9.83203C6.78125 10.5586 7.21094 11.1914 7.75781 11.7305C8.30469 12.2695 8.94141 12.6992 9.66797 13.0195C10.3945 13.3398 11.1719 13.5 12 13.5C12.8281 13.5 13.6055 13.3437 14.332 13.0312C15.0586 12.7188 15.6914 12.2891 16.2305 11.7422C16.7695 11.1953 17.1992 10.5586 17.5195 9.83203C17.8398 9.10547 18 8.32812 18 7.5C18 6.67188 17.8437 5.89453 17.5312 5.16797C17.2188 4.44141 16.7891 3.80859 16.2422 3.26953C15.6953 2.73047 15.0586 2.30078 14.332 1.98047C13.6055 1.66016 12.8281 1.5 12 1.5C11.1719 1.5 10.3945 1.65625 9.66797 1.96875C8.94141 2.28125 8.30859 2.71094 7.76953 3.25781C7.23047 3.80469 6.80078 4.44141 6.48047 5.16797C6.16016 5.89453 6 6.67188 6 7.5Z" />
    </svg>

);

export const ProfileIcon = props => <Icon component={ProfileSvg} {...props} />;
