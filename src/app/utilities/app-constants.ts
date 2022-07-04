import {environment} from "../../environments/environment";


const AppConstant = Object.freeze({
    KEY_CURRENT_USER: 'current-user',
    GLOBAL_LOADING: 'GLOBAL-LOADING',
    DEFAULT_URLS: {
        API: `${environment.serverURL}/api`,
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
        MOMENT_T_DATE: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
    },
    STORAGE_KEYS: {
        SESSION: 'stk',
        LANGUAGE: 'lang',
    },
    JOB_TYPE: {
        ViecLamTheoChuyenMon: 1,
        ViecLamQuanLy: 2,
        LaoDongPhoThong: 3,
        BanThoiGian: 4,
    },
});

export default AppConstant;

