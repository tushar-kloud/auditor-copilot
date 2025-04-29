import axios from "axios";
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
import { API_KEY, baseUrl } from "./chatActions";
import { preview_sunfeast_facebook_verification_data, preview_sunfeast_youtube_verification_data, preview_twitter_active_status_data, preview_twitter_bingo_censor_data } from "./dummyContants";

const AUDIT_WORKFLOWS = [
  {
    id: "account-status-verification",
    platforms: {
      youtube: "40c029f7-8077-45f7-96a5-8214b22acdbc",
      facebook: "e70800f0-f453-4a26-8dfa-3353afee39da",
    },
  },
  {
    id: "activity-status-verification",
    platforms: {
      twitter: "b261de63-8dda-432a-82c6-365c3b6f0ad1",
    },
  },
  {
    id: "censored-detection",
    platforms: {
      twitter: "8455e324-b3d8-4139-9225-cc0321885ac4",
    },
  },
];

export const auditAccountVerificationAPI =
  (platform, brandname) => async (dispatch) => {
    try {
      dispatch({
        type: AUDIT_ACCOUNT_VERIFICATION_REQUEST,
      });

      const platform_name = platform.toLowerCase();

      // console.log("analyzing platform:", platform_name);
      // console.log("analyzing brand:", brandname);

      const flowId = AUDIT_WORKFLOWS.find(
        (workflow) => workflow.id === "account-status-verification"
      ).platforms[platform_name];
      // console.log("flowId:", flowId);

      // console.log("verifying brand:", brandname);

      // const { data } = await axios.post(
      //   `${baseUrl}/api/v1/run/${flowId}?stream=false`,
      //   {
      //     input_value: brandname,
      //     output_type: "chat",
      //     input_type: "text",
      //   },
      //   {
      //     headers: {
      //       // "Content-Type": "application/json",
      //       "x-api-key": `${API_KEY}`,
      //     },
      //   }
      // );
      let preview_data = "";
      if (platform_name == "youtube") {
        preview_data = preview_sunfeast_youtube_verification_data;
      } else if (platform_name == "facebook") {
        preview_data = preview_sunfeast_facebook_verification_data;
      }

      const final_value =
        preview_data?.outputs?.[0]?.outputs?.[1]?.results?.message?.data?.text;

      // console.log("detailed results: ", final_value.platform);

      // Simulate an API call
      dispatch({
        type: AUDIT_ACCOUNT_VERIFICATION_SUCCESS,
        payload: JSON.parse(JSON.stringify(final_value)),
      });
    } catch (error) {
      dispatch({
        type: AUDIT_ACCOUNT_VERIFICATION_FAIL,
        payload: error.message,
      });
    }
  };

export const auditActivityStatusVerificationAPI =
  (platform, url) => async (dispatch) => {
    try {
      dispatch({
        type: AUDIT_ACTIVITY_STATUS_VERIFICATION_REQUEST,
      });

      const platform_name = platform.toLowerCase();

      // console.log("analyzing platform:", platform_name);
      // console.log("analyzing url:", url);

      const flowId = AUDIT_WORKFLOWS.find(
        (workflow) => workflow.id === "activity-status-verification"
      ).platforms[platform_name];
      // console.log("flowId:", flowId);

      const preview_data = preview_twitter_active_status_data;
      // console.log("preview data: ", preview_data);
      
      const final_value =
        preview_data?.outputs?.[0]?.outputs?.[0]?.results?.message?.data?.text;

      // console.log("detailed results: ", final_value);

      // Simulate an API call
      
        dispatch({
          type: AUDIT_ACTIVITY_STATUS_VERIFICATION_SUCCESS,
          payload: final_value,
        });
      
    } catch (error) {
      dispatch({
        type: AUDIT_ACTIVITY_STATUS_VERIFICATION_FAIL,
        payload: error.message,
      });
    }
  };

export const auditCensoredDetectionAPI =
  (platform, url) => async (dispatch) => {
    try {
      dispatch({
        type: AUDIT_CENSORED_DETECTION_REQUEST,
      });

      const platform_name = platform.toLowerCase();

      // console.log("analyzing platform:", platform_name);
      // console.log("analyzing url:", url);

      const flowId = AUDIT_WORKFLOWS.find(
        (workflow) => workflow.id === "censored-detection"
      ).platforms[platform_name];
      // console.log("flowId:", flowId);

      const preview_data = preview_twitter_bingo_censor_data;
      // console.log("preview data: ", preview_data);
      const final_value =
        preview_data?.outputs?.[0]?.outputs?.[0]?.results?.message?.data?.text;

      // console.log("detailed results: ", final_value);

      // Simulate an API call

        dispatch({
          type: AUDIT_CENSORED_DETECTION_SUCCESS,
          payload: final_value,
        });

    } catch (error) {
      dispatch({
        type: AUDIT_CENSORED_DETECTION_FAIL,
        payload: error.message,
      });
    }
  };
