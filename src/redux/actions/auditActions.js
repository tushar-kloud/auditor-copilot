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

export const auditAccountVerificationAPI = (data) => async (dispatch, getState) => {
    try {
        dispatch({
            type: AUDIT_ACCOUNT_VERIFICATION_REQUEST,
        });

        // const { auditAccountVerificationReducer } = getState();
        // const { accountVerificationInfo } = auditAccountVerificationReducer;

        // Simulate an API call
        setTimeout(() => {
            dispatch({
                type: AUDIT_ACCOUNT_VERIFICATION_SUCCESS,
                payload: data,
            });
        }, 1000);
    } catch (error) {
        dispatch({
            type: AUDIT_ACCOUNT_VERIFICATION_FAIL,
            payload: error.message,
        });
    }
};

export const auditActivityStatusVerificationAPI = (data) => async (dispatch, getState) => {
    try {
        dispatch({
            type: AUDIT_ACTIVITY_STATUS_VERIFICATION_REQUEST,
        });

        // const { auditActivityStatusVerificationReducer } = getState();
        // const { activityStatusVerificationInfo } = auditActivityStatusVerificationReducer;

        // Simulate an API call
        setTimeout(() => {
            dispatch({
                type: AUDIT_ACTIVITY_STATUS_VERIFICATION_SUCCESS,
                payload: data,
            });
        }, 1000);
    } catch (error) {
        dispatch({
            type: AUDIT_ACTIVITY_STATUS_VERIFICATION_FAIL,
            payload: error.message,
        });
    }
}

export const auditCensoredDetectionAPI = (data) => async (dispatch, getState) => {
    try {
        dispatch({
            type: AUDIT_CENSORED_DETECTION_REQUEST,
        });

        // const { auditCensoredDetectionReducer } = getState();
        // const { censoredDetectionInfo } = auditCensoredDetectionReducer;

        // Simulate an API call
        setTimeout(() => {
            dispatch({
                type: AUDIT_CENSORED_DETECTION_SUCCESS,
                payload: data,
            });
        }, 1000);
    } catch (error) {
        dispatch({
            type: AUDIT_CENSORED_DETECTION_FAIL,
            payload: error.message,
        });
    }
}