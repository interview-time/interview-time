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
            d="M12.5 2.75C12.5 2.33579 12.1642 2 11.75 2C11.3358 2 11 2.33579 11 2.75V3H5.25C3.45507 3 2 4.45507 2 6.25V15.75C2 17.5449 3.45507 19 5.25 19H7.64847L6.17333 20.7699C5.90813 21.0881 5.95109 21.561 6.26928 21.8262C6.58747 22.0914 7.0604 22.0485 7.32559 21.7303L9.60114 19H12.0292C12.0098 18.8348 12 18.668 12 18.5V18C12 17.8288 12.0172 17.6616 12.05 17.5H5.25C4.2835 17.5 3.5 16.7165 3.5 15.75V6.25C3.5 5.2835 4.2835 4.5 5.25 4.5H18.75C19.7165 4.5 20.5 5.2835 20.5 6.25V9.95487C21.2672 10.6415 21.75 11.6394 21.75 12.75C21.75 12.834 21.7472 12.9174 21.7418 13H22V6.25C22 4.45507 20.5449 3 18.75 3H12.5V2.75ZM20.7388 13C20.7462 12.9177 20.75 12.8343 20.75 12.75C20.75 12.3405 20.6605 11.9519 20.5 11.6028C20.0652 10.6568 19.1093 10 18 10C16.4812 10 15.25 11.2312 15.25 12.75C15.25 14.2688 16.4812 15.5 18 15.5C19.4345 15.5 20.6125 14.4016 20.7388 13ZM21.5 16.5C21.6385 16.5 21.7725 16.5188 21.8998 16.5539C22.5341 16.7289 23 17.31 23 18V18.5C23 20.4714 21.1405 22.5 18 22.5C15.125 22.5 13.3236 20.8 13.0395 19C13.0133 18.8338 13 18.6667 13 18.5V18C13 17.8247 13.0301 17.6564 13.0854 17.5C13.2913 16.9174 13.8469 16.5 14.5 16.5H21.5ZM6 7.75C6 7.33579 6.33579 7 6.75 7H10.75C11.1642 7 11.5 7.33579 11.5 7.75C11.5 8.16421 11.1642 8.5 10.75 8.5H6.75C6.33579 8.5 6 8.16421 6 7.75ZM6.75 10C6.33579 10 6 10.3358 6 10.75C6 11.1642 6.33579 11.5 6.75 11.5H13.25C13.6642 11.5 14 11.1642 14 10.75C14 10.3358 13.6642 10 13.25 10H6.75ZM6 13.75C6 13.3358 6.33579 13 6.75 13H12.25C12.6642 13 13 13.3358 13 13.75C13 14.1642 12.6642 14.5 12.25 14.5H6.75C6.33579 14.5 6 14.1642 6 13.75Z" />
    </svg>
);

export const InterviewIcon = props => <Icon component={InterviewSvg} {...props} />;

const ProfileSvg = () => (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
        <path
            d="M17.7507 13.9953C18.9927 13.9953 19.9995 15.0022 19.9995 16.2442V16.8196C19.9995 17.7139 19.6799 18.5787 19.0984 19.2581C17.529 21.0916 15.1419 21.9964 11.9965 21.9964C8.85059 21.9964 6.46458 21.0913 4.89828 19.257C4.31852 18.5781 4 17.7146 4 16.8219V16.2442C4 15.0022 5.00685 13.9953 6.24887 13.9953H17.7507ZM17.7507 15.4953H6.24887C5.83528 15.4953 5.5 15.8306 5.5 16.2442V16.8219C5.5 17.3575 5.69111 17.8756 6.03897 18.283C7.29227 19.7507 9.25815 20.4964 11.9965 20.4964C14.7348 20.4964 16.7024 19.7506 17.9589 18.2827C18.3078 17.8751 18.4995 17.3562 18.4995 16.8196V16.2442C18.4995 15.8306 18.1642 15.4953 17.7507 15.4953ZM11.9965 2C14.7579 2 16.9965 4.23858 16.9965 7C16.9965 9.7614 14.7579 12 11.9965 12C9.23503 12 6.99646 9.7614 6.99646 7C6.99646 4.23858 9.23503 2 11.9965 2ZM11.9965 3.5C10.0635 3.5 8.49646 5.067 8.49646 7C8.49646 8.933 10.0635 10.5 11.9965 10.5C13.9295 10.5 15.4965 8.933 15.4965 7C15.4965 5.067 13.9295 3.5 11.9965 3.5Z" />
    </svg>
);

export const ProfileIcon = props => <Icon component={ProfileSvg} {...props} />;

const SignOutSvg = () => (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
        <path
            d="M8.50215 11.5C9.05562 11.5 9.5043 11.9487 9.5043 12.5022C9.5043 13.0556 9.05562 13.5043 8.50215 13.5043C7.94868 13.5043 7.5 13.0556 7.5 12.5022C7.5 11.9487 7.94868 11.5 8.50215 11.5Z"
            fill="currentColor" />
        <path
            d="M12 4.35418V10.5L12.0005 11.005L19.442 11.004L17.7196 9.28026C17.4534 9.01395 17.4292 8.59728 17.6471 8.3037L17.7198 8.2196C17.9861 7.95338 18.4027 7.92924 18.6963 8.14715L18.7804 8.21978L21.777 11.2174C22.043 11.4835 22.0674 11.8997 21.85 12.1933L21.7775 12.2774L18.7809 15.2808C18.4884 15.5741 18.0135 15.5746 17.7203 15.282C17.4537 15.0161 17.429 14.5994 17.6465 14.3056L17.7191 14.2214L19.432 12.504L12.0005 12.505L12 19.25C12 19.7164 11.5788 20.0697 11.1196 19.9886L2.61955 18.4873C2.26121 18.424 2 18.1126 2 17.7487V5.75002C2 5.38271 2.26601 5.06945 2.62847 5.00993L11.1285 3.6141C11.5851 3.53911 12 3.89145 12 4.35418ZM10.5 5.23739L3.5 6.3869V17.1196L10.5 18.3559V5.23739Z"
            fill="currentColor" />
        <path
            d="M13 18.5013L13.7652 18.5015L13.867 18.4946C14.2335 18.4448 14.5158 18.1304 14.5152 17.7502L14.508 13.5H13V18.5013Z"
            fill="currentColor" />
        <path
            d="M13.002 9.99999L13 8.72535V5L13.7453 5.00001C14.1245 5.00001 14.4381 5.28153 14.4883 5.64712L14.4953 5.74877L14.502 9.99999H13.002Z"
            fill="currentColor" />
    </svg>

);

export const SignOutIcon = props => <Icon component={SignOutSvg} {...props} />;

const CommunitySvg = () => (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
        <path
            d="M10.9455 2.04712L10.9504 2.05443C11.2954 2.01845 11.6455 2 12 2C17.5229 2 22 6.47715 22 12C22 17.5228 17.5229 22 12 22C8.79072 22 5.93454 20.4882 4.10476 18.1379L4.1022 18.1374L4.10267 18.1353C2.78484 16.4414 2 14.3123 2 12C2 6.83804 5.91117 2.58957 10.9317 2.05639L10.9455 2.04712ZM12 3.5C11.9468 3.5 11.8937 3.50049 11.8407 3.50146C11.9633 3.74566 12.0949 4.0343 12.2144 4.35179C12.5613 5.27352 12.8802 6.6329 12.3143 7.83787C11.7917 8.95068 10.8896 9.23859 10.2242 9.41051L10.1396 9.43235C9.48319 9.60154 9.23081 9.6666 9.04671 9.9461C8.87773 10.2026 8.90333 10.5284 9.10809 11.1957C9.12249 11.2426 9.13806 11.2922 9.1543 11.3439C9.2354 11.6023 9.33317 11.9138 9.38413 12.2067C9.44753 12.5711 9.46544 13.0344 9.23208 13.4822C9.00059 13.9264 8.69375 14.2292 8.3312 14.4267C7.99066 14.6123 7.63794 14.6826 7.37405 14.7294L7.28108 14.7458C6.76621 14.8364 6.51992 14.8798 6.28005 15.1368C6.09385 15.3362 5.97367 15.6885 5.90349 16.2149C5.87492 16.4291 5.85774 16.6415 5.83998 16.8611L5.83044 16.9782C5.81046 17.2205 5.78569 17.4994 5.73121 17.7388L5.73091 17.7402C7.28488 19.4364 9.51823 20.5 12 20.5C13.577 20.5 15.0537 20.0705 16.3196 19.3222C16.2212 19.222 16.1145 19.1044 16.0092 18.9718C15.6697 18.5444 15.2244 17.8081 15.3788 16.939C15.453 16.5211 15.677 16.1712 15.8935 15.9029C16.1141 15.6295 16.3803 15.3769 16.6131 15.1626C16.6684 15.1117 16.7214 15.0633 16.7722 15.0169C16.9504 14.8542 17.1019 14.7159 17.2315 14.5802C17.4042 14.3991 17.4418 14.3175 17.4438 14.3133C17.5117 14.0886 17.4285 13.9294 17.3377 13.8592C17.2921 13.824 17.231 13.7984 17.1479 13.7978C17.0641 13.7971 16.9282 13.8222 16.7468 13.9372C16.5371 14.07 16.232 14.152 15.911 14.0228C15.6437 13.9151 15.4955 13.709 15.4244 13.5914C15.2805 13.3535 15.1996 13.0452 15.147 12.8191C15.1064 12.6447 15.0676 12.4467 15.0323 12.2661C15.0181 12.1938 15.0045 12.1242 14.9916 12.0601C14.941 11.8103 14.8984 11.6318 14.8575 11.5209C14.8569 11.5195 14.8518 11.5073 14.8382 11.4825C14.8235 11.4555 14.8027 11.421 14.7742 11.3777C14.7162 11.2894 14.6404 11.1857 14.5465 11.0613C14.5124 11.0161 14.4757 10.968 14.4373 10.9176C14.2762 10.7064 14.0843 10.4548 13.921 10.206C13.7252 9.90761 13.5039 9.51768 13.4339 9.10184C13.3969 8.88146 13.3974 8.62694 13.4889 8.36839C13.5825 8.10363 13.7535 7.88589 13.9755 7.7194C14.4589 7.35683 15.169 6.54683 15.7988 5.76036C16.0864 5.40123 16.3434 5.06476 16.5347 4.80938C15.2224 3.98001 13.6673 3.5 12 3.5ZM17.7274 5.71921C17.5298 5.98266 17.2658 6.32814 16.9696 6.69797C16.3679 7.44937 15.5703 8.38281 14.9201 8.88539C14.9455 8.98427 15.0204 9.14727 15.1751 9.38298C15.3062 9.58278 15.456 9.77946 15.6141 9.98695C15.6567 10.0428 15.7002 10.0999 15.7438 10.1576C15.9162 10.386 16.155 10.7047 16.2646 11.0014C16.3508 11.2349 16.4127 11.52 16.4618 11.7628C16.4791 11.8485 16.4951 11.9304 16.5105 12.0092C16.536 12.1396 16.5599 12.2616 16.5854 12.3786C17.1871 12.2069 17.7871 12.3106 18.2553 12.6726C18.8639 13.1432 19.118 13.9589 18.8797 14.7472C18.7704 15.1089 18.5157 15.4071 18.3165 15.6159C18.1475 15.7929 17.945 15.9777 17.7613 16.1452C17.7158 16.1867 17.6712 16.2274 17.6289 16.2663C17.3989 16.478 17.2055 16.6656 17.061 16.8447C16.9124 17.0289 16.8659 17.144 16.8557 17.2014C16.8168 17.4199 16.9232 17.7109 17.1837 18.0388C17.3018 18.1875 17.4276 18.3128 17.5252 18.4015C17.5367 18.4119 17.5478 18.4218 17.5583 18.431C19.36 16.8724 20.5 14.5693 20.5 12C20.5 9.512 19.4311 7.27366 17.7274 5.71921ZM3.5 12C3.5 13.3984 3.83767 14.7178 4.43592 15.8814C4.52081 15.324 4.69795 14.6334 5.18354 14.1132C5.78336 13.4706 6.51915 13.3501 6.98167 13.2744C7.02795 13.2668 7.07176 13.2596 7.11215 13.2525C7.35983 13.2085 7.50307 13.1697 7.61359 13.1095C7.70209 13.0613 7.8014 12.9818 7.90187 12.789C7.91674 12.7605 7.94419 12.6815 7.90633 12.4638C7.87391 12.2775 7.81312 12.0826 7.73358 11.8276C7.71482 11.7674 7.69481 11.7033 7.67409 11.6357C7.48894 11.0324 7.19301 10.0335 7.79404 9.12099C8.31568 8.32904 9.1547 8.12658 9.68731 7.99806C9.74506 7.98412 9.7992 7.97106 9.84895 7.9582C10.4119 7.81276 10.7323 7.67794 10.9566 7.20026C11.252 6.57127 11.1249 5.71532 10.8105 4.88019C10.6615 4.48421 10.4866 4.13625 10.3481 3.88653C10.3046 3.80813 10.2652 3.74015 10.2317 3.68419C6.38598 4.49793 3.5 7.91193 3.5 12Z" />
    </svg>
);

export const CommunityIcon = props => <Icon component={CommunitySvg} {...props} />;

const NewsSvg = () => (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
        <path
            d="M21.9068 5.62236C21.9686 5.83039 22 6.04627 22 6.26329V17.7387C22 18.9813 20.9926 19.9887 19.75 19.9887C19.5329 19.9887 19.317 19.9573 19.1089 19.8954L13.595 18.2558C12.9378 19.6008 11.5584 20.4994 10 20.4994C7.8578 20.4994 6.10892 18.8155 6.0049 16.6991L6 16.4994L5.999 15.9987L3.60891 15.288C2.65446 15.0043 2 14.127 2 13.1313V10.8693C2 9.87356 2.65455 8.99622 3.60908 8.71256L19.1091 4.1065C20.3002 3.75253 21.5528 4.4312 21.9068 5.62236ZM7.499 16.4447L7.5 16.4994C7.5 17.8801 8.61929 18.9994 10 18.9994C10.8852 18.9994 11.6783 18.5352 12.1238 17.82L7.499 16.4447ZM19.5364 5.54436L4.03636 10.1504C3.71818 10.245 3.5 10.5374 3.5 10.8693V13.1313C3.5 13.4632 3.71815 13.7556 4.0363 13.8502L19.5363 18.4576C19.6057 18.4782 19.6776 18.4887 19.75 18.4887C20.1642 18.4887 20.5 18.1529 20.5 17.7387V6.26329C20.5 6.19095 20.4895 6.11899 20.4689 6.04964C20.3509 5.65259 19.9334 5.42637 19.5364 5.54436Z" />
    </svg>
);

export const NewsIcon = props => <Icon component={NewsSvg} {...props} />;

const FakeSvg = () => (
    <svg width="1em" height="1em" viewBox="0 0 24 24" />
);

export const FakeIcon = props => <Icon component={FakeSvg} {...props} />;

const FeedbackSvg = () => (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
        <path
            d="M10.75 14C11.9926 14 13 15.0074 13 16.25V17.752L12.9921 17.8604C12.6814 19.9866 10.7715 21.009 7.56679 21.009C4.37361 21.009 2.4333 19.9983 2.01446 17.8966L2 17.75V16.25C2 15.0074 3.00736 14 4.25 14H10.75ZM10.75 15.5H4.25C3.83579 15.5 3.5 15.8358 3.5 16.25V17.6704C3.77979 18.8708 5.05063 19.509 7.56679 19.509C10.0829 19.509 11.2966 18.8777 11.5 17.6932V16.25C11.5 15.8358 11.1642 15.5 10.75 15.5ZM7.5 6C9.433 6 11 7.567 11 9.5C11 11.433 9.433 13 7.5 13C5.567 13 4 11.433 4 9.5C4 7.567 5.567 6 7.5 6ZM19.75 2C20.9926 2 22 3.00736 22 4.25V7.75C22 8.99264 20.9926 10 19.75 10H18.2951L16.1286 12.1414C15.6375 12.6266 14.846 12.6219 14.3608 12.1308C14.1296 11.8968 14 11.5812 14 11.2526L13.9994 9.9862C12.8747 9.86155 12 8.90792 12 7.75V4.25C12 3.00736 13.0074 2 14.25 2H19.75ZM7.5 7.5C6.39543 7.5 5.5 8.39543 5.5 9.5C5.5 10.6046 6.39543 11.5 7.5 11.5C8.60457 11.5 9.5 10.6046 9.5 9.5C9.5 8.39543 8.60457 7.5 7.5 7.5ZM19.75 3.5H14.25C13.8358 3.5 13.5 3.83579 13.5 4.25V7.75C13.5 8.16421 13.8358 8.5 14.25 8.5H15.4986L15.4997 10.6539L17.6789 8.5H19.75C20.1642 8.5 20.5 8.16421 20.5 7.75V4.25C20.5 3.83579 20.1642 3.5 19.75 3.5Z" />
    </svg>
);

export const FeedbackIcon = props => <Icon component={FeedbackSvg} {...props} />;