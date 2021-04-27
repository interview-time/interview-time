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

const DevelopmentSvg = () => (
    <svg width="1em" height="1em" viewBox="0 0 18 15" fill="currentColor">
        <path
            d="M5.45906 13.4491L11.309 0.399051C11.4616 0.0588783 11.8609 -0.0932666 12.2011 0.0592205C12.513 0.199009 12.6668 0.546256 12.5728 0.86518L12.541 0.951283L6.69095 14.0013C6.53846 14.3415 6.13907 14.4936 5.79889 14.3411C5.48706 14.2014 5.33323 13.8541 5.42722 13.5352L5.45906 13.4491L11.309 0.399051L5.45906 13.4491ZM0.197703 6.72291L4.02271 2.89788C4.28631 2.63427 4.7137 2.63427 4.9773 2.89788C5.21694 3.13751 5.23872 3.51251 5.04266 3.77676L4.9773 3.85247L1.6296 7.20018L4.9773 10.5479C5.2409 10.8114 5.2409 11.2388 4.9773 11.5025C4.73766 11.7421 4.36266 11.7639 4.09841 11.5678L4.02271 11.5025L0.197703 7.67746C-0.0419397 7.43779 -0.0637198 7.06284 0.132345 6.7986L0.197703 6.72291L4.02271 2.89788L0.197703 6.72291ZM13.0227 2.89788C13.2623 2.65823 13.6373 2.63644 13.9016 2.83252L13.9773 2.89788L17.8023 6.72291C18.042 6.96249 18.0637 7.33752 17.8676 7.60176L17.8023 7.67746L13.9773 11.5025C13.7137 11.7661 13.2863 11.7661 13.0227 11.5025C12.7831 11.2628 12.7613 10.8878 12.9574 10.6236L13.0227 10.5479L16.3704 7.20018L13.0227 3.85247C12.7591 3.58886 12.7591 3.16148 13.0227 2.89788Z" />
    </svg>
);

export const DevelopmentIcon = props => <Icon component={DevelopmentSvg} {...props} />;

const ManagementSvg = () => (
    <svg width="1em" height="1em" viewBox="0 0 18 18" fill="currentColor">
        <path
            d="M3 10.4992L9.75 10.5C10.5403 10.5 11.1886 11.1116 11.2459 11.888L11.25 12V13.125C11.2493 15.75 8.463 16.5 6.375 16.5C4.3334 16.5 1.62353 15.783 1.50409 13.2972L1.5 13.125V11.9992C1.5 11.2089 2.1123 10.5607 2.88811 10.5034L3 10.4992ZM11.415 10.5H15C15.7903 10.5 16.4386 11.1123 16.4959 11.8881L16.5 12V12.75C16.4993 15.0465 14.3565 15.75 12.75 15.75C12.24 15.75 11.6768 15.678 11.145 15.5085C11.397 15.219 11.6003 14.8883 11.7465 14.5133C12.1537 14.607 12.5363 14.625 12.75 14.625L12.9499 14.6205C13.6889 14.5882 15.2647 14.3479 15.3695 12.9037L15.375 12.75V12C15.375 11.816 15.2416 11.6628 15.0672 11.6311L15 11.625H11.9618C11.8988 11.249 11.7415 10.9074 11.5159 10.6199L11.415 10.5H15H11.415ZM3 11.6242L2.9245 11.6318C2.83122 11.6507 2.7675 11.7014 2.7345 11.7338C2.7021 11.7668 2.65146 11.83 2.6325 11.9235L2.625 11.9992V13.125C2.625 13.8818 2.9625 14.4165 3.68775 14.8065C4.30736 15.1402 5.18963 15.3422 6.13694 15.3713L6.375 15.375L6.61305 15.3713C7.56023 15.3422 8.44193 15.1402 9.06225 14.8065C9.74145 14.4409 10.0812 13.9481 10.121 13.2637L10.125 13.1243V12C10.125 11.816 9.99165 11.6628 9.8172 11.6311L9.75 11.625L3 11.6242ZM6.375 2.25C8.23875 2.25 9.75 3.76125 9.75 5.625C9.75 7.48875 8.23875 9 6.375 9C4.51125 9 3 7.48875 3 5.625C3 3.76125 4.51125 2.25 6.375 2.25ZM13.125 3.75C14.5747 3.75 15.75 4.92525 15.75 6.375C15.75 7.82475 14.5747 9 13.125 9C11.6753 9 10.5 7.82475 10.5 6.375C10.5 4.92525 11.6753 3.75 13.125 3.75ZM6.375 3.375C5.1345 3.375 4.125 4.3845 4.125 5.625C4.125 6.8655 5.1345 7.875 6.375 7.875C7.6155 7.875 8.625 6.8655 8.625 5.625C8.625 4.3845 7.6155 3.375 6.375 3.375ZM13.125 4.875C12.2977 4.875 11.625 5.54775 11.625 6.375C11.625 7.20225 12.2977 7.875 13.125 7.875C13.9523 7.875 14.625 7.20225 14.625 6.375C14.625 5.54775 13.9523 4.875 13.125 4.875Z" />
    </svg>

);

export const ManagementIcon = props => <Icon component={ManagementSvg} {...props} />;

const CustomerServiceSvg = () => (
    <svg width="1em" height="1em" viewBox="0 0 18 18" fill="currentColor">
        <path
            d="M9 13.875C8.68935 13.875 8.4375 14.1268 8.4375 14.4375C8.4375 14.7482 8.68935 15 9 15C9.31065 15 9.5625 14.7482 9.5625 14.4375C9.5625 14.1268 9.31065 13.875 9 13.875ZM13.125 7.5V6.75C13.125 4.47182 11.2782 2.625 9 2.625C6.72182 2.625 4.875 4.47182 4.875 6.75V7.5H6.75C7.16421 7.5 7.5 7.83578 7.5 8.25V11.25C7.5 11.6642 7.16421 12 6.75 12H4.875V12.1875C4.875 13.0807 5.56887 13.8117 6.44696 13.8711L6.5625 13.875L7.40859 13.8748C7.64033 13.2195 8.2653 12.75 9 12.75C9.93195 12.75 10.6875 13.5056 10.6875 14.4375C10.6875 15.3694 9.93195 16.125 9 16.125C8.26507 16.125 7.6398 15.6551 7.40832 14.9994L6.5625 15C5.0593 15 3.83155 13.8207 3.7539 12.3369L3.75 12.1875V6.75C3.75 3.85051 6.10051 1.5 9 1.5C11.8995 1.5 14.25 3.85051 14.25 6.75V10.5C14.25 11.2908 13.6381 11.9387 12.862 11.9959L12.75 12H11.25C10.8654 12 10.5484 11.7105 10.505 11.3375L10.5 11.25V8.25C10.5 7.8654 10.7895 7.54837 11.1625 7.50502L11.25 7.5H13.125ZM6.375 8.625H4.875V10.875H6.375V8.625ZM13.125 8.625H11.625V10.875H12.75C12.9341 10.875 13.0872 10.7423 13.1189 10.5674L13.125 10.5V8.625Z" />
    </svg>
);

export const CustomerServiceIcon = props => <Icon component={CustomerServiceSvg} {...props} />;

const DesignSvg = () => (
    <svg width="1em" height="1em" viewBox="0 0 18 18" fill="currentColor">
        <path
            d="M5.0625 2.95093C3.92342 2.95093 3 3.87434 3 5.01343V12.1876C3 12.4984 3.25184 12.7501 3.5625 12.7501C3.87316 12.7501 4.125 12.4984 4.125 12.1876V5.01343C4.125 4.49566 4.54473 4.07593 5.0625 4.07593H12.1875C12.7053 4.07593 13.125 4.49566 13.125 5.01343V8.4582C13.48 8.30175 13.867 8.23335 14.25 8.2539V5.01343C14.25 3.87434 13.3266 2.95093 12.1875 2.95093H5.0625Z" />
        <path
            d="M15.2297 9.41817L15.133 9.33882L15.1307 9.33709C14.4707 8.83677 13.5055 8.89714 12.9171 9.49587L10.0648 12.3979C9.88815 12.5776 9.7587 12.795 9.68745 13.032L9.24773 14.4963C8.823 14.5608 8.44575 14.555 8.0442 14.4912C8.02613 14.4884 8.01593 14.469 8.02373 14.4525L8.04938 14.3982L8.05163 14.3934C8.10045 14.2898 8.18662 14.1069 8.2146 13.9188C8.2302 13.8138 8.23463 13.6682 8.178 13.5132C8.11718 13.3464 8.00303 13.2165 7.86135 13.1295C7.6188 12.9803 7.31628 12.9689 7.05654 12.9839C6.85087 12.9957 6.59635 13.0307 6.28342 13.0917C5.93696 13.1592 5.6077 13.3143 5.27959 13.4688C4.84698 13.6725 4.41636 13.8753 3.95099 13.8753C3.78377 13.8753 3.62295 13.848 3.47276 13.7974C3.38042 13.7664 3.2788 13.8413 3.30224 13.9358C3.34474 14.1072 3.42352 14.3389 3.59644 14.5173C3.69095 14.6148 3.8177 14.7003 3.9775 14.7414C4.13653 14.7822 4.29062 14.7694 4.42564 14.7297C5.51605 14.4096 6.24038 14.2357 6.71156 14.157C6.81047 14.1405 6.88475 14.2404 6.85439 14.336C6.80683 14.4857 6.73964 14.7693 6.87947 15.0564C7.03115 15.3677 7.32989 15.498 7.58805 15.5512C8.44515 15.7275 9.18465 15.7046 10.0895 15.4671C10.129 15.4607 10.1686 15.4512 10.2076 15.4386L10.2955 15.4101C10.4239 15.373 10.5557 15.3318 10.6919 15.2864C10.7123 15.2796 10.7321 15.2716 10.7513 15.2628L11.7921 14.9262C12.0456 14.8442 12.2744 14.7037 12.4579 14.517L15.3037 11.6217C15.8933 11.0211 15.8908 10.0961 15.3175 9.50262L15.2297 9.41817ZM10.8233 13.3413C10.8423 13.2782 10.8769 13.2198 10.9247 13.1712L13.7769 10.2692C13.949 10.0941 14.2389 10.0841 14.4226 10.247C14.5868 10.3925 14.6094 10.6263 14.4871 10.797L14.4413 10.8509L11.598 13.7437C11.5484 13.7942 11.4861 13.8325 11.4167 13.855L10.5886 14.1228L10.8233 13.3413Z" />
    </svg>
);

export const DesignIcon = props => <Icon component={DesignSvg} {...props} />;

const OtherSvg = () => (
    <svg width="1em" height="1em" viewBox="0 0 18 18" fill="currentColor">
        <path
            d="M8.25036 11.2501C8.25036 10.987 8.29551 10.7346 8.37839 10.5H3.18958C2.25807 10.5 1.50293 11.2552 1.50293 12.1867V12.6199C1.50293 13.2895 1.74182 13.9372 2.17664 14.4463C3.35136 15.822 5.14087 16.5009 7.50027 16.5009C7.79841 16.5009 8.08754 16.49 8.36744 16.4683C8.29154 16.2427 8.25036 16.0012 8.25036 15.7501V15.3492C8.00946 15.367 7.75949 15.3759 7.50027 15.3759C5.44654 15.3759 3.97213 14.8165 3.03216 13.7158C2.77126 13.4102 2.62793 13.0217 2.62793 12.6199V12.1867C2.62793 11.8765 2.87939 11.625 3.18958 11.625H8.25036V11.2501ZM7.50027 1.50354C9.57134 1.50354 11.2503 3.18247 11.2503 5.25354C11.2503 7.32461 9.57134 9.00351 7.50027 9.00351C5.4292 9.00351 3.75027 7.32461 3.75027 5.25354C3.75027 3.18247 5.4292 1.50354 7.50027 1.50354ZM7.50027 2.62854C6.05052 2.62854 4.87527 3.80379 4.87527 5.25354C4.87527 6.70329 6.05052 7.87851 7.50027 7.87851C8.95004 7.87851 10.1253 6.70329 10.1253 5.25354C10.1253 3.80379 8.95004 2.62854 7.50027 2.62854ZM9.00036 11.2501C9.00036 10.4216 9.67191 9.75006 10.5004 9.75006H15.7504C16.5788 9.75006 17.2504 10.4216 17.2504 11.2501V15.7501C17.2504 16.5785 16.5788 17.2501 15.7504 17.2501H10.5004C9.67191 17.2501 9.00036 16.5785 9.00036 15.7501V11.2501ZM10.8754 12.0001C10.6683 12.0001 10.5004 12.168 10.5004 12.3751C10.5004 12.5821 10.6683 12.7501 10.8754 12.7501H15.3754C15.5824 12.7501 15.7504 12.5821 15.7504 12.3751C15.7504 12.168 15.5824 12.0001 15.3754 12.0001H10.8754ZM10.8754 14.2501C10.6683 14.2501 10.5004 14.418 10.5004 14.6251C10.5004 14.8321 10.6683 15.0001 10.8754 15.0001H15.3754C15.5824 15.0001 15.7504 14.8321 15.7504 14.6251C15.7504 14.418 15.5824 14.2501 15.3754 14.2501H10.8754Z" />
    </svg>
);

export const OtherIcon = props => <Icon component={OtherSvg} {...props} />;

const CustomSvg = () => (
    <svg width="1em" height="1em" viewBox="0 0 18 18" fill="currentColor">
        <path
            d="M4.3125 2.25C3.17342 2.25 2.25 3.17342 2.25 4.3125V13.6875C2.25 14.8266 3.17342 15.75 4.3125 15.75H9.01635C8.79398 15.4026 8.61435 15.0251 8.48513 14.625H4.3125C3.79473 14.625 3.375 14.2053 3.375 13.6875V4.3125C3.375 3.79473 3.79473 3.375 4.3125 3.375H13.6875C14.2053 3.375 14.625 3.79473 14.625 4.3125V8.48513C15.0251 8.61435 15.4026 8.79398 15.75 9.01635V4.3125C15.75 3.17342 14.8266 2.25 13.6875 2.25H4.3125Z" />
        <path
            d="M13.4674 8.26186C13.4906 8.20021 13.5033 8.13353 13.5033 8.06378C13.5033 7.75313 13.2514 7.50128 12.9408 7.50128H9.1875C8.87685 7.50128 8.625 7.75313 8.625 8.06378C8.625 8.37443 8.87685 8.62628 9.1875 8.62628H11.2436C11.8225 8.38388 12.4581 8.25001 13.125 8.25001C13.2401 8.25001 13.3543 8.25398 13.4674 8.26186Z" />
        <path
            d="M6.1875 6.37628C5.25552 6.37628 4.5 7.1318 4.5 8.06377C4.5 8.99572 5.25552 9.75128 6.1875 9.75128C7.11948 9.75128 7.875 8.99572 7.875 8.06377C7.875 7.1318 7.11948 6.37628 6.1875 6.37628ZM5.625 8.06377C5.625 7.75312 5.87684 7.50127 6.1875 7.50127C6.49816 7.50127 6.75 7.75312 6.75 8.06377C6.75 8.37442 6.49816 8.62627 6.1875 8.62627C5.87684 8.62627 5.625 8.37442 5.625 8.06377Z" />
        <path
            d="M4.5 12.1875C4.5 11.2556 5.25552 10.5 6.1875 10.5C7.11948 10.5 7.875 11.2556 7.875 12.1875C7.875 13.1194 7.11948 13.875 6.1875 13.875C5.25552 13.875 4.5 13.1194 4.5 12.1875ZM6.1875 11.625C5.87684 11.625 5.625 11.8768 5.625 12.1875C5.625 12.4982 5.87684 12.75 6.1875 12.75C6.49816 12.75 6.75 12.4982 6.75 12.1875C6.75 11.8768 6.49816 11.625 6.1875 11.625Z" />
        <path
            d="M12.941 5.625L5.06641 5.62502C4.75575 5.62502 4.50391 5.37318 4.50391 5.06252C4.50391 4.75186 4.75575 4.50002 5.06641 4.50002L12.941 4.5C13.2517 4.5 13.5035 4.75184 13.5035 5.0625C13.5035 5.37316 13.2517 5.625 12.941 5.625Z" />
        <path
            d="M17.25 13.125C17.25 10.8468 15.4032 9 13.125 9C10.8468 9 9 10.8468 9 13.125C9 15.4032 10.8468 17.25 13.125 17.25C15.4032 17.25 17.25 15.4032 17.25 13.125ZM13.5008 15.3776C13.5008 15.5848 13.333 15.7526 13.1258 15.7526C12.9188 15.7526 12.7508 15.5848 12.7508 15.3776L12.7505 13.5H10.8721C10.665 13.5 10.4971 13.3321 10.4971 13.125C10.4971 12.9179 10.665 12.75 10.8721 12.75H12.7504L12.75 10.8745C12.75 10.6673 12.9179 10.4995 13.125 10.4995C13.3321 10.4995 13.5 10.6673 13.5 10.8745L13.5004 12.75H15.3773C15.5844 12.75 15.7523 12.9179 15.7523 13.125C15.7523 13.3321 15.5844 13.5 15.3773 13.5H13.5005L13.5008 15.3776Z" />
    </svg>
);

export const CustomIcon = props => <Icon component={CustomSvg} {...props} />;

const ArrowRightSvg = () => (
    <svg width="1em" height="1em" viewBox="0 0 18 7" fill="currentColor">
        <path
            d="M13.296 6.6C13.792 5.576 14.256 4.808 14.688 4.296H0.696V3.288H14.688C14.256 2.776 13.792 2.008 13.296 0.983999H14.136C15.144 2.152 16.2 3.016 17.304 3.576V4.008C16.2 4.552 15.144 5.416 14.136 6.6H13.296Z" />
    </svg>

);

export const ArrowRightIcon = props => <Icon component={ArrowRightSvg} {...props} />;

const CandidatesSvg = () => (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
        <path
            d="M15.5 12.25C15.5 11.8358 15.1642 11.5 14.75 11.5H9.75C9.33579 11.5 9 11.8358 9 12.25V12.7495C9 13.75 10.3831 14.5 12.25 14.5C14.1168 14.5 15.5 13.75 15.5 12.7495V12.25ZM14 8.74547C14 7.77863 13.2168 7 12.25 7C11.2832 7 10.5 7.77863 10.5 8.74547C10.5 9.71231 11.2832 10.4961 12.25 10.4961C13.2168 10.4961 14 9.71231 14 8.74547ZM4 4.5C4 3.11929 5.11929 2 6.5 2H18C19.3807 2 20.5 3.11929 20.5 4.5V18.75C20.5 19.1642 20.1642 19.5 19.75 19.5H5.5C5.5 20.0523 5.94772 20.5 6.5 20.5H19.75C20.1642 20.5 20.5 20.8358 20.5 21.25C20.5 21.6642 20.1642 22 19.75 22H6.5C5.11929 22 4 20.8807 4 19.5V4.5ZM5.5 4.5V18H19V4.5C19 3.94772 18.5523 3.5 18 3.5H6.5C5.94772 3.5 5.5 3.94772 5.5 4.5Z" />
    </svg>


);

export const CandidatesIcon = props => <Icon component={CandidatesSvg} {...props} />;