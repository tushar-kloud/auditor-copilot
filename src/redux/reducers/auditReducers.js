import {
    AUDIT_ACCOUNT_VERIFICATION_REQUEST,
    AUDIT_ACCOUNT_VERIFICATION_SUCCESS,
    AUDIT_ACCOUNT_VERIFICATION_FAIL,
    AUDIT_ACTIVITY_STATUS_VERIFICATION_REQUEST,
    AUDIT_ACTIVITY_STATUS_VERIFICATION_SUCCESS,
    AUDIT_ACTIVITY_STATUS_VERIFICATION_FAIL,
    AUDIT_CENSORED_DETECTION_REQUEST,
    AUDIT_CENSORED_DETECTION_SUCCESS,
    AUDIT_CENSORED_DETECTION_FAIL,
} from "../constants/auditConstants";

export const auditAccountVerificationReducer = (state = {}, action) => {
    switch (action.type) {
        case AUDIT_ACCOUNT_VERIFICATION_REQUEST:
            return { loading: true };
        case AUDIT_ACCOUNT_VERIFICATION_SUCCESS:
            return { loading: false, success: true, accountVerificationInfo: action.payload };
        case AUDIT_ACCOUNT_VERIFICATION_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}

export const auditActivityStatusVerificationReducer = (state = {}, action) => {
    switch (action.type) {
        case AUDIT_ACTIVITY_STATUS_VERIFICATION_REQUEST:
            return { loading: true };
        case AUDIT_ACTIVITY_STATUS_VERIFICATION_SUCCESS:
            return { loading: false, success: true, activityStatusVerificationInfo: action.payload };
        case AUDIT_ACTIVITY_STATUS_VERIFICATION_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}

export const auditCensoredDetectionReducer = (state = {}, action) => {
    switch (action.type) {
        case AUDIT_CENSORED_DETECTION_REQUEST:
            return { loading: true };
        case AUDIT_CENSORED_DETECTION_SUCCESS:
            return { loading: false, success: true, censoredDetectionInfo: action.payload };
        case AUDIT_CENSORED_DETECTION_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}