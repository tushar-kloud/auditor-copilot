import axios from "axios";
import {
    UPLOAD_FILE_REQUEST,
    UPLOAD_FILE_SUCCESS,
    UPLOAD_FILE_FAIL,
    GENERATE_INVOICE_REQUEST,
    GENERATE_INVOICE_SUCCESS,
    GENERATE_INVOICE_FAIL,
    RECONCILIATION_REQUEST,
    RECONCILIATION_SUCCESS,
    RECONCILIATION_FAIL,
    UPLOAD_PO_FAIL,
    UPLOAD_PO_REQUEST,
    UPLOAD_PO_SUCCESS,
    UPLOAD_INVOICE_REQUEST,
    UPLOAD_INVOICE_SUCCESS,
    UPLOAD_INVOICE_FAIL
} from '../constants/invoiceConstants';

// const baseUrl = 'https://langflow-v3-large.salmonisland-47da943e.centralindia.azurecontainerapps.io'
const baseUrl = import.meta.env.VITE_AI_PLAYGROUND_BASE_URL
// https://langflow-v3-large.salmonisland-47da943e.centralindia.azurecontainerapps.io/api/v1/run/adda70b1-e24a-4610-926a-ca8b80ed8a02?stream=false
// const flowId = '91a3d1f1-fa91-4aff-a334-140860535fae'

const API_KEY = import.meta.env.VITE_AI_PLAYGROUND_API_KEY

// export const AI_PLAYGROUND_WORKFLOWS = {
//     RAG: {flowId:'e322521c-1cd2-4126-a002-24458d3c6eaf'},
//     INVOICING: {flowId:'1ce871a4-e87b-4e82-beb8-b4ca7791baf6', fileComponentId:'File-EKjxA'},
//     RECONCILING : {flowId: 'f33346c4-5166-4341-83e9-3380fb00f07c',poComponent:'File-hGR2q', invoiceComponent:'File-pZRDa'}

// }

export const AI_PLAYGROUND_WORKFLOWS = {
    AGENT : {flowId:'982dce00-8135-42f0-bec1-4d898b09cf66'},
}



// const WORKFLOWS = {
//     RAG: {flowId:'9e96ec5d-b3bc-4497-9006-97421cd8d7d9'},
//     INVOICING: {flowId:'70fc313b-4f6d-4e9b-b51e-ec803d845bb1', fileComponentId:'File-zeINU'},
//     RECONCILING: {flowId: 'adda70b1-e24a-4610-926a-ca8b80ed8a02', poComponent:'File-eclaI', invoiceComponent:'File-oqmWy'}
// }

export const uploadFileAPI = (flag, file) => async(dispatch) => {
    try{
        // Get the flowId based on the flag
        const flow = AI_PLAYGROUND_WORKFLOWS[flag];
        if (!flow) {
            throw new Error('Invalid flag provided');
        }
        
        const flowId = flow.flowId;
        // console.log('uploading file to: ',flowId);
        
        
        dispatch({type: UPLOAD_FILE_REQUEST});
        
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post(`${baseUrl}/api/v1/files/upload/${flowId}`, formData, {
        // const response = await axios.post("https://aiplayground.salmonisland-47da943e.centralindia.azurecontainerapps.io/api/v1/files/upload/1ce871a4-e87b-4e82-beb8-b4ca7791baf6", formData, {
            headers: {
            'Content-Type': 'multipart/form-data',
            'x-api-key': `${API_KEY}`
            },
            // responseType: 'json'
        });
        
        // console.log('file uploaded: ', response.data);
        dispatch({type: UPLOAD_FILE_SUCCESS, payload: response.data});
    } catch(error) {
        console.log('Error:', error);
        dispatch({
            type: UPLOAD_FILE_FAIL,
            payload: error.response?.data?.message || error.message,
        });
    }
}

export const uploadPOAPI = (file) => async(dispatch) => {
    try{
        dispatch({type: UPLOAD_PO_REQUEST});
        const formData = new FormData();
        formData.append('file', file);
        const response = await axios.post(`${baseUrl}/api/v1/files/upload/${AI_PLAYGROUND_WORKFLOWS.RECONCILING.flowId}`, formData, {
            headers: {
            'Content-Type': 'multipart/form-data',
            'x-api-key': `${API_KEY}`
            }
        });
        
        // console.log('PO file uploaded: ', response.data);
        dispatch({type: UPLOAD_PO_SUCCESS, payload: response.data});
    }catch(error){
        console.log('Error:', error)
        dispatch({type: UPLOAD_PO_FAIL,
            payload: error.response?.data?.message || error.message,
        })
    }
}

export const uploadInvoiceAPI = (file) => async(dispatch) => {
    try{
        dispatch({type: UPLOAD_INVOICE_REQUEST});
        const formData = new FormData();
        formData.append('file', file);
        const response = await axios.post(`${baseUrl}/api/v1/files/upload/${AI_PLAYGROUND_WORKFLOWS.RECONCILING.flowId}`, formData, {
            headers: {
            'Content-Type': 'multipart/form-data',
            'x-api-key': `${API_KEY}`
            }
        });
        
        // console.log('Invoice file uploaded: ', response.data);
        dispatch({type: UPLOAD_INVOICE_SUCCESS, payload: response.data});
    }catch(error){
        console.log('Error:', error)
        dispatch({type: UPLOAD_INVOICE_FAIL,
            payload: error.response?.data?.message || error.message,
        })
    }
}

export const generateInvoiceAPI = (filePath) => async(dispatch) => {
    try{
        dispatch({type: GENERATE_INVOICE_REQUEST})
        // console.log('Making api for generating invoice via file:', filePath);
        const {data} = await axios.post(`${baseUrl}/api/v1/run/${AI_PLAYGROUND_WORKFLOWS.INVOICING.flowId}?stream=false`,{
            output_type: "chat",
            input_type: "chat",
            tweaks: {
                [AI_PLAYGROUND_WORKFLOWS.INVOICING.fileComponentId]: {
                    "path":filePath
                }
            }
        },{
            headers:{
                'x-api-key': `${API_KEY}`
            }
        }
    )

        // console.log('if: ',data.outputs[0].outputs[0].messages[0].message);
        const invoiceData = JSON.parse(data.outputs[0].outputs[0].messages[0].message)
        
        dispatch({type: GENERATE_INVOICE_SUCCESS, payload: invoiceData})
        
        return invoiceData
    }catch(error){
        console.log('Error:', error)
        dispatch({type: GENERATE_INVOICE_FAIL,
            payload: error.response?.data?.message || error.message,
        })
    }
}

export const reconcileAPI = (poFile, invoiceFile) => async(dispatch) => {
    try{
        dispatch({type:RECONCILIATION_REQUEST})
        // console.log('reconciling: ', poFile.file_path, invoiceFile.file_path);
        
        const {data} = await axios.post(
            `${baseUrl}/api/v1/run/${AI_PLAYGROUND_WORKFLOWS.RECONCILING.flowId}?stream=false`,{
                tweaks: {
                    [AI_PLAYGROUND_WORKFLOWS.RECONCILING.poComponent]: {
                        "path":poFile.file_path
                    },
                    [AI_PLAYGROUND_WORKFLOWS.RECONCILING.invoiceComponent]: {
                        "path":invoiceFile.file_path
                    }
                }
            },{
                headers:{
                    // 'Content-Type': 'multipart/form-data',
                    'x-api-key': `${API_KEY}`
                }
            }
        )

        // API logic
        // console.log('Reconciliation data:', data.outputs[0].outputs[0].messages[0].message);
        const reconciliationData = JSON.parse(data.outputs[0].outputs[0].messages[0].message)
        // console.log('recon status:',reconciliationData.status);
        // console.log('descrepancies:',reconciliationData.discrepancies);
        
        
        dispatch({type:RECONCILIATION_SUCCESS, payload: reconciliationData})
    }catch(error){
        console.log('Error:', error)
        dispatch({type:RECONCILIATION_FAIL,
            payload: error.response?.data?.message || error.message,
        })
    }
}