import Icon from "@ant-design/icons";

const TextNoteSvg = () => (
    <svg width='1em' height='1em' viewBox='0 0 24 24' fill='none'>
        <path
            d='M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z'
            stroke='currentColor'
            stroke-width='2'
            stroke-linecap='round'
            stroke-linejoin='round'
        />
    </svg>
);

export const TextNoteIcon = props => <Icon component={TextNoteSvg} {...props} />;

const ProfileSvg = () => (
    <svg width='1em' height='1em' viewBox='0 0 24 24' fill='currentColor'>
        <path d='M17.7507 13.9953C18.9927 13.9953 19.9995 15.0022 19.9995 16.2442V16.8196C19.9995 17.7139 19.6799 18.5787 19.0984 19.2581C17.529 21.0916 15.1419 21.9964 11.9965 21.9964C8.85059 21.9964 6.46458 21.0913 4.89828 19.257C4.31852 18.5781 4 17.7146 4 16.8219V16.2442C4 15.0022 5.00685 13.9953 6.24887 13.9953H17.7507ZM17.7507 15.4953H6.24887C5.83528 15.4953 5.5 15.8306 5.5 16.2442V16.8219C5.5 17.3575 5.69111 17.8756 6.03897 18.283C7.29227 19.7507 9.25815 20.4964 11.9965 20.4964C14.7348 20.4964 16.7024 19.7506 17.9589 18.2827C18.3078 17.8751 18.4995 17.3562 18.4995 16.8196V16.2442C18.4995 15.8306 18.1642 15.4953 17.7507 15.4953ZM11.9965 2C14.7579 2 16.9965 4.23858 16.9965 7C16.9965 9.7614 14.7579 12 11.9965 12C9.23503 12 6.99646 9.7614 6.99646 7C6.99646 4.23858 9.23503 2 11.9965 2ZM11.9965 3.5C10.0635 3.5 8.49646 5.067 8.49646 7C8.49646 8.933 10.0635 10.5 11.9965 10.5C13.9295 10.5 15.4965 8.933 15.4965 7C15.4965 5.067 13.9295 3.5 11.9965 3.5Z' />
    </svg>
);

export const ProfileIcon = props => <Icon component={ProfileSvg} {...props} />;

const ReorderSvg = () => (
    <svg width='1em' height='1em' viewBox='0 0 24 24' fill='currentColor'>
        <path d='M15.5 17C16.3284 17 17 17.6716 17 18.5C17 19.3284 16.3284 20 15.5 20C14.6716 20 14 19.3284 14 18.5C14 17.6716 14.6716 17 15.5 17ZM8.5 17C9.32843 17 10 17.6716 10 18.5C10 19.3284 9.32843 20 8.5 20C7.67157 20 7 19.3284 7 18.5C7 17.6716 7.67157 17 8.5 17ZM15.5 10C16.3284 10 17 10.6716 17 11.5C17 12.3284 16.3284 13 15.5 13C14.6716 13 14 12.3284 14 11.5C14 10.6716 14.6716 10 15.5 10ZM8.5 10C9.32843 10 10 10.6716 10 11.5C10 12.3284 9.32843 13 8.5 13C7.67157 13 7 12.3284 7 11.5C7 10.6716 7.67157 10 8.5 10ZM15.5 3C16.3284 3 17 3.67157 17 4.5C17 5.32843 16.3284 6 15.5 6C14.6716 6 14 5.32843 14 4.5C14 3.67157 14.6716 3 15.5 3ZM8.5 3C9.32843 3 10 3.67157 10 4.5C10 5.32843 9.32843 6 8.5 6C7.67157 6 7 5.32843 7 4.5C7 3.67157 7.67157 3 8.5 3Z' />
    </svg>
);

export const ReorderIcon = props => <Icon component={ReorderSvg} {...props} />;

const CollapseSvg = () => (
    <svg width='1em' height='1em' viewBox='0 0 18 16' fill='currentColor'>
        <path d='M2.63597 9.15448C1.93303 9.84875 1.93303 10.9744 2.63597 11.6686C3.33892 12.3629 4.47861 12.3629 5.18156 11.6686L8.99974 7.89759L12.8183 11.669C13.5213 12.3633 14.661 12.3633 15.3639 11.669C16.0668 10.9748 16.0668 9.84913 15.3639 9.15486L10.2948 4.1483C10.2875 4.14088 10.2801 4.1335 10.2727 4.12617C9.56978 3.4319 8.43008 3.4319 7.72714 4.12617L2.63597 9.15448Z' />
    </svg>
);

export const CollapseIcon = props => <Icon component={CollapseSvg} {...props} />;

const ExpandSvg = () => (
    <svg width='1em' height='1em' viewBox='0 0 18 16' fill='currentColor'>
        <path d='M15.364 6.84552C16.067 6.15125 16.067 5.02563 15.364 4.33136C14.6611 3.63709 13.5214 3.63709 12.8184 4.33136L9.00026 8.10241L5.18169 4.33098C4.47874 3.63671 3.33905 3.63671 2.6361 4.33098C1.93316 5.02525 1.93316 6.15087 2.6361 6.84514L7.70524 11.8517C7.71251 11.8591 7.71985 11.8665 7.72727 11.8738C8.43022 12.5681 9.56992 12.5681 10.2729 11.8738L15.364 6.84552Z' />
    </svg>
);

export const ExpandIcon = props => <Icon component={ExpandSvg} {...props} />;

const StarSvg = () => (
    <svg width='1em' height='1em' viewBox='0 0 20 20' fill='currentColor'>
        <path d='M9.07242 2.7917C9.45235 2.02191 10.55 2.02191 10.9299 2.7917L12.8521 6.68636L17.1501 7.31093C17.9996 7.43436 18.3388 8.47829 17.7241 9.0775L14.614 12.1091L15.3482 16.3897C15.4933 17.2358 14.6053 17.881 13.8454 17.4816L10.0011 15.4605L6.15691 17.4816C5.39708 17.881 4.50902 17.2358 4.65414 16.3897L5.38833 12.1091L2.27826 9.0775C1.66355 8.47829 2.00275 7.43436 2.85227 7.31093L7.15028 6.68636L9.07242 2.7917ZM10.0011 3.33077L8.10278 7.17736C7.95192 7.48307 7.66028 7.69493 7.32292 7.74393L3.07795 8.36079L6.14965 11.3549C6.39375 11.5929 6.50514 11.9357 6.44751 12.2717L5.72238 16.4995L9.51921 14.5034C9.82093 14.3448 10.1814 14.3448 10.4831 14.5034L14.2799 16.4995L13.5549 12.2717C13.4972 11.9357 13.6086 11.5929 13.8527 11.3549L16.9244 8.36079L12.6794 7.74393C12.3421 7.69493 12.0504 7.48307 11.8996 7.17736L10.0011 3.33077Z' />
    </svg>
);

export const StarIcon = props => <Icon component={StarSvg} {...props} />;

const StarEmphasisSvg = () => (
    <svg width='1em' height='1em' viewBox='0 0 20 20' fill='currentColor'>
        <path d='M8.99244 2.62711C9.40506 1.79096 10.5974 1.79096 11.0101 2.62711L12.9114 6.47966L17.163 7.09747C18.0858 7.23153 18.4542 8.36553 17.7865 9.01634L14.7101 12.0152L15.4363 16.2495C15.5939 17.1686 14.6293 17.8694 13.8039 17.4355L10.0013 15.4363L6.19855 17.4355C5.37322 17.8694 4.40861 17.1686 4.56623 16.2495L5.29248 12.0152L2.21602 9.01634C1.54832 8.36553 1.91676 7.23153 2.83951 7.09747L7.09106 6.47966L8.99244 2.62711ZM15.8081 5.98602C15.564 5.74195 15.564 5.34622 15.8081 5.10214L17.6831 3.22714C17.9271 2.98306 18.3229 2.98306 18.5669 3.22714C18.811 3.47122 18.811 3.86695 18.5669 4.11102L16.6919 5.98602C16.4479 6.2301 16.0521 6.2301 15.8081 5.98602ZM1.43306 14.4772C1.18898 14.7212 1.18898 15.117 1.43306 15.361C1.67714 15.6051 2.07286 15.6051 2.31694 15.361L4.19194 13.486C4.43602 13.242 4.43602 12.8462 4.19194 12.6022C3.94786 12.3581 3.55214 12.3581 3.30806 12.6022L1.43306 14.4772ZM1.43312 3.22714C1.67719 2.98306 2.07292 2.98306 2.317 3.22714L4.192 5.10214C4.43607 5.34622 4.43607 5.74194 4.192 5.98602C3.94793 6.2301 3.55219 6.2301 3.30812 5.98602L1.43312 4.11102C1.18904 3.86694 1.18904 3.47122 1.43312 3.22714ZM16.692 12.6022C16.4479 12.3581 16.0522 12.3581 15.8081 12.6022C15.5641 12.8462 15.5641 13.242 15.8081 13.486L17.6831 15.361C17.9272 15.6051 18.3229 15.6051 18.567 15.361C18.8111 15.117 18.8111 14.7212 18.567 14.4772L16.692 12.6022Z' />
    </svg>
);

export const StarEmphasisIcon = props => <Icon component={StarEmphasisSvg} {...props} />;

const StarHalfSvg = () => (
    <svg width='1em' height='1em' viewBox='0 0 20 20' fill='currentColor'>
        <path d='M9.07242 2.7917C9.26242 2.4067 9.632 2.21426 10.0015 2.21436C10.3708 2.21446 10.74 2.40691 10.9299 2.7917L12.8521 6.68636L17.1501 7.31093C17.9996 7.43436 18.3388 8.47828 17.7241 9.0775L14.614 12.1091L15.3482 16.3897C15.4933 17.2358 14.6053 17.881 13.8454 17.4816L10.0015 15.4606L6.15691 17.4816C5.39708 17.881 4.50902 17.2358 4.65414 16.3897L5.38833 12.1091L2.27826 9.0775C1.66355 8.47828 2.00275 7.43436 2.85227 7.31093L7.15028 6.68636L9.07242 2.7917ZM10.0015 14.3844C10.1669 14.3845 10.3324 14.4241 10.4831 14.5034L14.2799 16.4995L13.5549 12.2717C13.4972 11.9357 13.6086 11.5929 13.8527 11.3549L16.9244 8.36078L12.6794 7.74393C12.3421 7.69493 12.0504 7.48307 11.8996 7.17736L10.0015 3.33136V14.3844Z' />
    </svg>
);

export const StarHalfIcon = props => <Icon component={StarHalfSvg} {...props} />;

const StarFilledSvg = () => (
    <svg width='1em' height='1em' viewBox='0 0 20 20' fill='currentColor'>
        <path d='M9.07242 2.7917C9.45235 2.02191 10.55 2.02191 10.9299 2.7917L12.8521 6.68636L17.1501 7.31093C17.9996 7.43436 18.3388 8.47829 17.7241 9.0775L14.614 12.1091L15.3482 16.3897C15.4933 17.2358 14.6053 17.881 13.8454 17.4816L10.0011 15.4605L6.15691 17.4816C5.39708 17.881 4.50902 17.2358 4.65414 16.3897L5.38833 12.1091L2.27826 9.0775C1.66355 8.47829 2.00275 7.43436 2.85227 7.31093L7.15028 6.68636L9.07242 2.7917Z' />
    </svg>
);

export const StarFilledIcon = props => <Icon component={StarFilledSvg} {...props} />;

const UserAddSvg = () => (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
        <path
            d='M18 9V12M18 12V15M18 12H21M18 12H15M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7ZM3 20C3 16.6863 5.68629 14 9 14C12.3137 14 15 16.6863 15 20V21H3V20Z'
            stroke='currentColor'
            stroke-width='2'
            stroke-linecap='round'
            stroke-linejoin='round'
        />
    </svg>
);

export const UserAddIcon = props => <Icon component={UserAddSvg} {...props} />;

const BackSvg = () => (
    <svg width='20' height='20' viewBox='0 0 20 20' fill='none'>
        <path
            d='M12.5 15.8337L6.66667 10.0003L12.5 4.16699'
            stroke='#374151'
            stroke-width='2'
            stroke-linecap='round'
            stroke-linejoin='round'
        />
    </svg>
);

export const BackIcon = props => <Icon component={BackSvg} {...props} />;

const NoteSvg = () => (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
        <path
            fill-rule='evenodd'
            clip-rule='evenodd'
            d='M4.80078 4.7999C4.80078 3.47442 5.8753 2.3999 7.20078 2.3999H12.7037C13.3402 2.3999 13.9507 2.65276 14.4008 3.10285L18.4978 7.1999C18.9479 7.64999 19.2008 8.26044 19.2008 8.89696V19.1999C19.2008 20.5254 18.1263 21.5999 16.8008 21.5999H7.20078C5.8753 21.5999 4.80078 20.5254 4.80078 19.1999V4.7999ZM7.20078 11.9999C7.20078 11.3372 7.73804 10.7999 8.40078 10.7999H15.6008C16.2635 10.7999 16.8008 11.3372 16.8008 11.9999C16.8008 12.6626 16.2635 13.1999 15.6008 13.1999H8.40078C7.73804 13.1999 7.20078 12.6626 7.20078 11.9999ZM8.40078 15.5999C7.73804 15.5999 7.20078 16.1372 7.20078 16.7999C7.20078 17.4626 7.73804 17.9999 8.40078 17.9999H15.6008C16.2635 17.9999 16.8008 17.4626 16.8008 16.7999C16.8008 16.1372 16.2635 15.5999 15.6008 15.5999H8.40078Z'
            fill='currentColor'
        />
    </svg>
);

export const CloseIcon = props => <Icon component={CloseSvg} {...props} />;

const CloseSvg = () => (
    <svg width='20' height='20' viewBox='0 0 20 20' fill='none'>
        <path
            d='M5 15L15 5M5 5L15 15'
            stroke='currentColor'
            stroke-width='2'
            stroke-linecap='round'
            stroke-linejoin='round'
        />
    </svg>
);

export const NoteIcon = props => <Icon component={NoteSvg} {...props} />;

const LightingSvg = () => (
    <svg width='1em' height='1em' viewBox='0 0 24 24' fill='none'>
        <path
            d='M13 10V3L4 14H11L11 21L20 10L13 10Z'
            stroke='currentColor'
            stroke-width='2'
            stroke-linecap='round'
            stroke-linejoin='round'
        />
    </svg>
);

export const LightingIcon = props => <Icon component={LightingSvg} {...props} />;

const CopySvg = () => (
    <svg width='20' height='20' viewBox='0 0 20 20' fill='none'>
        <path
            d='M14.8346 5.83333V15.8333H16.8346V5.83333H14.8346ZM14.168 16.5H5.83464V18.5H14.168V16.5ZM5.16797 15.8333V5.83333H3.16797V15.8333H5.16797ZM5.83464 5.16667H7.5013V3.16667H5.83464V5.16667ZM12.5013 5.16667H14.168V3.16667H12.5013V5.16667ZM5.83464 16.5C5.46645 16.5 5.16797 16.2015 5.16797 15.8333H3.16797C3.16797 17.3061 4.36188 18.5 5.83464 18.5V16.5ZM14.8346 15.8333C14.8346 16.2015 14.5362 16.5 14.168 16.5V18.5C15.6407 18.5 16.8346 17.3061 16.8346 15.8333H14.8346ZM16.8346 5.83333C16.8346 4.36057 15.6407 3.16667 14.168 3.16667V5.16667C14.5362 5.16667 14.8346 5.46514 14.8346 5.83333H16.8346ZM5.16797 5.83333C5.16797 5.46514 5.46645 5.16667 5.83464 5.16667V3.16667C4.36188 3.16667 3.16797 4.36057 3.16797 5.83333H5.16797ZM9.16797 3.5H10.8346V1.5H9.16797V3.5ZM10.8346 4.83333H9.16797V6.83333H10.8346V4.83333ZM9.16797 4.83333C8.79978 4.83333 8.5013 4.53486 8.5013 4.16667H6.5013C6.5013 5.63943 7.69521 6.83333 9.16797 6.83333V4.83333ZM11.5013 4.16667C11.5013 4.53486 11.2028 4.83333 10.8346 4.83333V6.83333C12.3074 6.83333 13.5013 5.63943 13.5013 4.16667H11.5013ZM10.8346 3.5C11.2028 3.5 11.5013 3.79848 11.5013 4.16667H13.5013C13.5013 2.69391 12.3074 1.5 10.8346 1.5V3.5ZM9.16797 1.5C7.69521 1.5 6.5013 2.69391 6.5013 4.16667H8.5013C8.5013 3.79848 8.79978 3.5 9.16797 3.5V1.5Z'
            fill='#FFFFFF'
        />
    </svg>
);

export const CopyIcon = props => <Icon component={CopySvg} {...props} />;

const CheckSvg = () => (
    <svg width='20' height='20' viewBox='0 0 20 20' fill='none'>
        <path
            d='M4.16797 10.833L7.5013 14.1663L15.8346 5.83301'
            stroke='#FFFFFF'
            stroke-width='2'
            stroke-linecap='round'
            stroke-linejoin='round'
        />
    </svg>
);

export const CheckIcon = props => <Icon component={CheckSvg} {...props} />;

const CalendarSvg = () => (
    <svg width='1em' height='1em' viewBox='0 0 24 24' fill='none'>
        <path
            d='M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z'
            stroke='currentColor'
            stroke-width='2'
            stroke-linecap='round'
            stroke-linejoin='round'
        />
    </svg>
);

export const CalendarIcon = props => <Icon component={CalendarSvg} {...props} />;

const TimeSvg = () => (
    <svg width='1em' height='1em' viewBox='0 0 24 24' fill='none'>
        <path
            d='M12 8.5V12.5L15 15.5M21 12.5C21 17.4706 16.9706 21.5 12 21.5C7.02944 21.5 3 17.4706 3 12.5C3 7.52944 7.02944 3.5 12 3.5C16.9706 3.5 21 7.52944 21 12.5Z'
            stroke='currentColor'
            stroke-width='2'
            stroke-linecap='round'
            stroke-linejoin='round'
        />
    </svg>
);

export const TimeIcon = props => <Icon component={TimeSvg} {...props} />;

const IdeaSvg = () => (
    <svg width='21' height='20' viewBox='0 0 21 20' fill='none'>
        <path
            d='M8.33144 15H13.0044M10.6679 1V2M17.0319 3.63604L16.3248 4.34315M19.668 9.99995H18.668M2.66797 9.99995H1.66797M5.01106 4.34315L4.30395 3.63604M7.13238 13.5356C5.17976 11.5829 5.17976 8.41711 7.13238 6.46449C9.085 4.51187 12.2508 4.51187 14.2034 6.46449C16.1561 8.41711 16.1561 11.5829 14.2034 13.5356L13.6564 14.0827C13.0235 14.7155 12.6679 15.5739 12.6679 16.469V17C12.6679 18.1046 11.7725 19 10.6679 19C9.56335 19 8.66792 18.1046 8.66792 17V16.469C8.66792 15.5739 8.31236 14.7155 7.67948 14.0827L7.13238 13.5356Z'
            stroke='#8C2BE3'
            stroke-width='2'
            stroke-linecap='round'
            stroke-linejoin='round'
        />
    </svg>
);

export const IdeaIcon = props => <Icon component={IdeaSvg} {...props} />;

const ArchiveSvg = () => (
    <svg width='21' height='18' viewBox='0 0 21 18' fill='none'>
        <path
            d='M3.33203 5H17.332M3.33203 5C2.22746 5 1.33203 4.10457 1.33203 3C1.33203 1.89543 2.22746 1 3.33203 1H17.332C18.4366 1 19.332 1.89543 19.332 3C19.332 4.10457 18.4366 5 17.332 5M3.33203 5L3.33203 15C3.33203 16.1046 4.22746 17 5.33203 17H15.332C16.4366 17 17.332 16.1046 17.332 15V5M8.33203 9H12.332'
            stroke='#8C2BE3'
            stroke-width='2'
            stroke-linecap='round'
            stroke-linejoin='round'
        />
    </svg>
);

export const ArchiveIcon = props => <Icon component={ArchiveSvg} {...props} />;

const MoreSvg = () => (
    <svg width='20' height='20' viewBox='0 0 20 20' fill='none'>
        <path
            d='M3.875 10H3.88375M10 10H10.0088M16.125 10H16.1338M4.75 10C4.75 10.4832 4.35825 10.875 3.875 10.875C3.39175 10.875 3 10.4832 3 10C3 9.51675 3.39175 9.125 3.875 9.125C4.35825 9.125 4.75 9.51675 4.75 10ZM10.875 10C10.875 10.4832 10.4832 10.875 10 10.875C9.51675 10.875 9.125 10.4832 9.125 10C9.125 9.51675 9.51675 9.125 10 9.125C10.4832 9.125 10.875 9.51675 10.875 10ZM17 10C17 10.4832 16.6082 10.875 16.125 10.875C15.6418 10.875 15.25 10.4832 15.25 10C15.25 9.51675 15.6418 9.125 16.125 9.125C16.6082 9.125 17 9.51675 17 10Z'
            stroke='#374151'
            stroke-width='1.67'
            stroke-linecap='round'
            stroke-linejoin='round'
        />
    </svg>
);

export const MoreIcon = props => <Icon component={MoreSvg} {...props} />;

const MailSvg = () => (
    <svg width='1em' height='1em' viewBox='0 0 24 24' fill='none'>
        <path
            d='M3 8L10.8906 13.2604C11.5624 13.7083 12.4376 13.7083 13.1094 13.2604L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z'
            stroke='currentColor'
            stroke-width='2'
            stroke-linecap='round'
            stroke-linejoin='round'
        />
    </svg>
);

export const MailIcon = props => <Icon component={MailSvg} {...props} />;

const LinkSvg = () => (
    <svg width='1em' height='1em' viewBox='0 0 24 24' fill='none'>
        <path
            d='M13.8284 10.1716C12.2663 8.60948 9.73367 8.60948 8.17157 10.1716L4.17157 14.1716C2.60948 15.7337 2.60948 18.2663 4.17157 19.8284C5.73367 21.3905 8.26633 21.3905 9.82843 19.8284L10.93 18.7269M10.1716 13.8284C11.7337 15.3905 14.2663 15.3905 15.8284 13.8284L19.8284 9.82843C21.3905 8.26633 21.3905 5.73367 19.8284 4.17157C18.2663 2.60948 15.7337 2.60948 14.1716 4.17157L13.072 5.27118'
            stroke='currentColor'
            stroke-width='2'
            stroke-linecap='round'
            stroke-linejoin='round'
        />
    </svg>
);

export const LinkIcon = props => <Icon component={LinkSvg} {...props} />;

const UsersSvg = () => (
    <svg width='1em' height='1em' viewBox='0 0 24 24' fill='none'>
        <path
            d='M12 4.35418C12.7329 3.52375 13.8053 3 15 3C17.2091 3 19 4.79086 19 7C19 9.20914 17.2091 11 15 11C13.8053 11 12.7329 10.4762 12 9.64582M15 21H3V20C3 16.6863 5.68629 14 9 14C12.3137 14 15 16.6863 15 20V21ZM15 21H21V20C21 16.6863 18.3137 14 15 14C13.9071 14 12.8825 14.2922 12 14.8027M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z'
            stroke='currentColor'
            stroke-width='2'
            stroke-linecap='round'
            stroke-linejoin='round'
        />
    </svg>
);

export const UsersIcon = props => <Icon component={UsersSvg} {...props} />;

const NewFileSvg = () => (
    <svg width='1em' height='1em' viewBox='0 0 24 24' fill='none'>
        <path
            d='M9.66797 13H15.668M12.668 10L12.668 16M17.668 21H7.66797C6.5634 21 5.66797 20.1046 5.66797 19V5C5.66797 3.89543 6.5634 3 7.66797 3H13.2538C13.519 3 13.7733 3.10536 13.9609 3.29289L19.3751 8.70711C19.5626 8.89464 19.668 9.149 19.668 9.41421V19C19.668 20.1046 18.7725 21 17.668 21Z'
            stroke='currentColor'
            stroke-width='2'
            stroke-linecap='round'
            stroke-linejoin='round'
        />
    </svg>
);

export const NewFileIcon = props => <Icon component={NewFileSvg} {...props} />;

const DuplicateSvg = () => (
    <svg width='1em' height='1em' viewBox='0 0 24 24' fill='none'>
        <path
            d='M8 16H6C4.89543 16 4 15.1046 4 14V6C4 4.89543 4.89543 4 6 4H14C15.1046 4 16 4.89543 16 6V8M10 20H18C19.1046 20 20 19.1046 20 18V10C20 8.89543 19.1046 8 18 8H10C8.89543 8 8 8.89543 8 10V18C8 19.1046 8.89543 20 10 20Z'
            stroke='currentColor'
            stroke-width='2'
            stroke-linecap='round'
            stroke-linejoin='round'
        />
    </svg>
);

export const DuplicateIcon = props => <Icon component={DuplicateSvg} {...props} />;

const UploadSvg = () => (
    <svg width='1em' height='1em' viewBox='0 0 24 24' fill='none'>
        <path
            d='M4 16L4 17C4 18.6569 5.34315 20 7 20L17 20C18.6569 20 20 18.6569 20 17L20 16M16 8L12 4M12 4L8 8M12 4L12 16'
            stroke='currentColor'
            stroke-width='2'
            stroke-linecap='round'
            stroke-linejoin='round'
        />
    </svg>
);

export const UploadIcon = props => <Icon component={UploadSvg} {...props} />;

const AlertSvg = () => (
    <svg width='40' height='40' viewBox='0 0 20 20' fill='none'>
        <path
            d='M10 8.4326V10.0001M10 13.1352H10.0078M4.56988 16.2703H15.4301C16.6368 16.2703 17.391 14.964 16.7877 13.919L11.3575 4.51375C10.7542 3.46872 9.24582 3.46872 8.64247 4.51375L3.21235 13.919C2.609 14.964 3.36319 16.2703 4.56988 16.2703Z'
            stroke='#8C2BE3'
            stroke-width='1.67'
            stroke-linecap='round'
            stroke-linejoin='round'
        />
    </svg>
);

export const AlertIcon = props => <Icon component={AlertSvg} {...props} />;

const CrossCircleSvg = () => (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
        <path
            fill-rule='evenodd'
            clip-rule='evenodd'
            d='M12 21.75C17.3848 21.75 21.75 17.3848 21.75 12C21.75 6.61522 17.3848 2.25 12 2.25C6.61522 2.25 2.25 6.61522 2.25 12C2.25 17.3848 6.61522 21.75 12 21.75ZM10.4243 8.70071C9.94834 8.22476 9.17667 8.22476 8.70071 8.70071C8.22476 9.17666 8.22476 9.94834 8.70071 10.4243L10.2764 12L8.70071 13.5757C8.22476 14.0517 8.22476 14.8233 8.70071 15.2993C9.17666 15.7752 9.94834 15.7752 10.4243 15.2993L12 13.7236L13.5757 15.2993C14.0517 15.7752 14.8233 15.7752 15.2993 15.2993C15.7752 14.8233 15.7752 14.0517 15.2993 13.5757L13.7236 12L15.2993 10.4243C15.7752 9.94834 15.7752 9.17666 15.2993 8.70071C14.8233 8.22476 14.0517 8.22476 13.5757 8.70071L12 10.2764L10.4243 8.70071Z'
            fill='currentColor'
        />
    </svg>
);

export const CrossCircleIcon = props => <Icon component={CrossCircleSvg} {...props} />;

const TemplateIconSvg = () => (
    <svg width='64' height='64' viewBox='0 0 64 64' fill='none'>
        <path
            d='M0 32C0 5.648 5.648 0 32 0C58.352 0 64 5.648 64 32C64 58.352 58.352 64 32 64C5.648 64 0 58.352 0 32Z'
            fill='currentColor'
        />
    </svg>
);

export const TemplateIcon = props => <Icon component={TemplateIconSvg} {...props} />;

const CheckFilledIconSvg = () => (
    <svg width='26' height='26' viewBox='0 0 26 26' fill='none'>
        <path
            fill-rule='evenodd'
            clip-rule='evenodd'
            d='M13 26C20.1797 26 26 20.1797 26 13C26 5.8203 20.1797 0 13 0C5.8203 0 0 5.8203 0 13C0 20.1797 5.8203 26 13 26ZM12.8355 16.2959L17.8779 11.0959L16.4421 9.70358L12.0894 14.1923L9.5295 11.7554L8.15054 13.204L11.4281 16.324L12.1458 17.0072L12.8355 16.2959Z'
            fill='#54BD95'
        />
    </svg>
);

export const CheckFilledIcon = props => <Icon component={CheckFilledIconSvg} {...props} />;

const UncheckFilledIconSvg = () => (
    <svg width='26' height='26' viewBox='0 0 26 26' fill='none'>
        <path
            fill-rule='evenodd'
            clip-rule='evenodd'
            d='M13 26C20.1797 26 26 20.1797 26 13C26 5.8203 20.1797 0 13 0C5.8203 0 0 5.8203 0 13C0 20.1797 5.8203 26 13 26ZM8 14H11.9394H18V12H11.9394H8V14Z'
            fill='#6B7280'
        />
    </svg>
);

export const UncheckFilledIcon = props => <Icon component={UncheckFilledIconSvg} {...props} />;

const RedFlagIconSvg = () => (
    <svg width='1em' height='1em' viewBox='0 0 24 24' fill='none'>
        <path
            fill-rule='evenodd'
            clip-rule='evenodd'
            d='M2.90002 6.15C2.90002 3.99609 4.64611 2.25 6.80002 2.25H19.8C20.2924 2.25 20.7426 2.5282 20.9628 2.96862C21.183 3.40904 21.1355 3.93608 20.84 4.33L17.525 8.75L20.84 13.17C21.1355 13.5639 21.183 14.091 20.9628 14.5314C20.7426 14.9718 20.2924 15.25 19.8 15.25H6.80002C6.08205 15.25 5.50002 15.832 5.50002 16.55V20.45C5.50002 21.168 4.91799 21.75 4.20002 21.75C3.48205 21.75 2.90002 21.168 2.90002 20.45V6.15Z'
            fill='currentColor'
        />
    </svg>
);

export const RedFlagIcon = props => <Icon component={RedFlagIconSvg} {...props} />;

const LightingFilledIconSvg = () => (
    <svg width='1em' height='1em' viewBox='0 0 24 24' fill='none'>
        <path
            fill-rule='evenodd'
            clip-rule='evenodd'
            d='M13.5609 1.25482C14.0604 1.41228 14.4001 1.87554 14.4001 2.39931V8.3993L19.2001 8.39931C19.6476 8.39931 20.0578 8.64825 20.2645 9.04513C20.4711 9.44201 20.4398 9.92089 20.1832 10.2875L11.7832 22.2875C11.4828 22.7165 10.9389 22.9013 10.4393 22.7438C9.9398 22.5863 9.6001 22.1231 9.6001 21.5993L9.6001 15.5993H4.8001C4.35265 15.5993 3.94236 15.3504 3.73573 14.9535C3.52909 14.5566 3.56043 14.0777 3.81702 13.7111L12.217 1.71115C12.5174 1.28207 13.0613 1.09736 13.5609 1.25482Z'
            fill='currentColor'
        />
    </svg>
);

export const LightingFilledIcon = props => <Icon component={LightingFilledIconSvg} {...props} />;

const DownloadFileOutlinedIconSvg = () => (
    <svg width='14' height='16' viewBox='0 0 14 16' fill='none'>
        <path
            d='M7.00011 6.44444V11.1111M7.00011 11.1111L4.66677 8.77778M7.00011 11.1111L9.33344 8.77778M10.889 15H3.11122C2.25211 15 1.55566 14.3036 1.55566 13.4444V2.55556C1.55566 1.69645 2.25211 1 3.11122 1H7.45572C7.662 1 7.85983 1.08194 8.00569 1.22781L12.2167 5.43886C12.3626 5.58472 12.4446 5.78255 12.4446 5.98883V13.4444C12.4446 14.3036 11.7481 15 10.889 15Z'
            stroke='currentColor'
            stroke-width='1.67'
            stroke-linecap='round'
            stroke-linejoin='round'
        />
    </svg>
);

export const DownloadFileOutlinedIcon = props => <Icon component={DownloadFileOutlinedIconSvg} {...props} />;

const DownloadFileIconSvg = () => (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
        <path
            fill-rule='evenodd'
            clip-rule='evenodd'
            d='M7.1998 2.39844C5.87432 2.39844 4.7998 3.47296 4.7998 4.79844V19.1984C4.7998 20.5239 5.87432 21.5984 7.1998 21.5984H16.7998C18.1253 21.5984 19.1998 20.5239 19.1998 19.1984V8.89549C19.1998 8.25897 18.9469 7.64853 18.4969 7.19844L14.3998 3.10138C13.9497 2.65129 13.3393 2.39844 12.7027 2.39844H7.1998ZM13.1998 9.59844C13.1998 8.9357 12.6625 8.39844 11.9998 8.39844C11.3371 8.39844 10.7998 8.9357 10.7998 9.59844V13.9014L9.24833 12.3499C8.7797 11.8813 8.01991 11.8813 7.55128 12.3499C7.08265 12.8185 7.08265 13.5783 7.55128 14.047L11.1513 17.647C11.6199 18.1156 12.3797 18.1156 12.8483 17.647L16.4483 14.047C16.917 13.5783 16.917 12.8185 16.4483 12.3499C15.9797 11.8813 15.2199 11.8813 14.7513 12.3499L13.1998 13.9014V9.59844Z'
            fill='currentColor'
        />
    </svg>
);

export const DownloadFileIcon = props => <Icon component={DownloadFileIconSvg} {...props} />;
