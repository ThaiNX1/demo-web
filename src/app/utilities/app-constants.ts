import { environment } from '../../environments/environment';

const AppConstant = Object.freeze({
    KEY_CURRENT_USER: 'current-user',
    GLOBAL_LOADING: 'GLOBAL-LOADING',
    DEFAULT_URLS: {
        API: `${environment.serverURL}/api`,
        URL: `${environment.serverURL}`
    },
    CALENDAR_KO: {
        dateFormat: 'dd/mm/yy',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: true,
        yearSuffix: '',
    },
    PATTERNS: {
        EMAIL: /^(([^<>()?\[\]\.,;:\s@\"]+(\.[^<>()?\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()?[\]\.,;:\s@\"]+\.)+[^<>()?[\]\.,;:\s@\"]{2,})$/,
        USERNAME: /^[a-zA-Z0-9_@.]*$/,
        NO_SP_CHAR: '[^<>{}]*',
        PHONE: /^[0-9-]*$/,
        NUMBER: /^[0-9]*$/,
        POSITIVE_NUMBER: /^[+]?([.]\d+|\d+[.]?\d*)$/,
        ALLOWED_INPUT: /^[0-9a-zA-Z._%+-@]*$/,
        SCRIPT_PATTERN: /^((?!<|>|{|\})[\s\S])*?$/,
        COLOR_PATTERN: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
        COLOR_RGB_PATTERN: /^RGB\(\s*(?:(\d{1,3})\s*,?){3}\)$/,
        SPECIAL_CHARS_NOT_ALLOW_RENAME:
            /^((?!\\|\/|:|\*|\?|"|<|>|\||\{|})[\s\S])*?$/,
        PASSWORD: /^(?=.*[a-z])(?=.*[0-9]).{8,}$/, // at least 8 characters, including numbers and characters
        URL_PATTERN:
            /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?/,
    },
    FORMAT_DATE: {
        MOMENT_LONG_DATE: 'MM/DD/YYYY HH:mm:ss',
        MOMENT_SHORT_DATE: 'MM/DD/YYYY',
        DATE_PIPE_LONG_DATE: 'MM/dd/YYYY HH:mm:ss',
        DATE_PIPE_SHORT_DATE: 'MM/dd/YYYY',
        TIME_FORMAT: 'HH:mm:ss',
        SCHEDULE_MEETING_DATE: 'MM/DD/YYYY HH:mm',
        MOMENT_T_DATE: 'yyyy-MM-DDTHH:mm:ss.SSS',
        T_DATE: 'YYYY-MM-DD[T]HH:mm:ss',
        VN_DATE_PIPE_SHORT_DATE: 'DD/MM/YYYY',
        NORMAL_DATE: 'YYYY/MM/DD',
    },
    STORAGE_KEYS: {
        SESSION: 'stk',
        LANGUAGE: 'lang',
        USER: 'user',
    },
    ACCOUNT_TYPE: {
        DEBIT: 'debit',
        DEBIT_1: 'debit1',
        DEBIT_2: 'debit2',
        CREDIT: 'credit',
        CREDIT_1: 'credit1',
        CREDIT_2: 'credit2'
    }
});

export default AppConstant;
