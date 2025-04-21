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
  UPLOAD_INVOICE_FAIL,
} from "../constants/invoiceConstants";

// const baseUrl = 'https://langflow-v3-large.salmonisland-47da943e.centralindia.azurecontainerapps.io'
const baseUrl = import.meta.env.VITE_AI_PLAYGROUND_BASE_URL;
// https://langflow-v3-large.salmonisland-47da943e.centralindia.azurecontainerapps.io/api/v1/run/adda70b1-e24a-4610-926a-ca8b80ed8a02?stream=false
// const flowId = '91a3d1f1-fa91-4aff-a334-140860535fae'

const API_KEY = import.meta.env.VITE_AI_PLAYGROUND_API_KEY;

// export const AI_PLAYGROUND_WORKFLOWS = {
//     RAG: {flowId:'e322521c-1cd2-4126-a002-24458d3c6eaf'},
//     INVOICING: {flowId:'1ce871a4-e87b-4e82-beb8-b4ca7791baf6', fileComponentId:'File-EKjxA'},
//     RECONCILING : {flowId: 'f33346c4-5166-4341-83e9-3380fb00f07c',poComponent:'File-hGR2q', invoiceComponent:'File-pZRDa'}

// }

export const AI_PLAYGROUND_WORKFLOWS = {
  // AGENT : {flowId:'982dce00-8135-42f0-bec1-4d898b09cf66'},
  EMBEDDING: { flowId: "d90bc62f-1446-45af-b057-952065d6687f" },
  AGENT: { flowId: "d8f722f8-6d97-49a4-85f7-841559e3eca9" },
};

// const WORKFLOWS = {
//     RAG: {flowId:'9e96ec5d-b3bc-4497-9006-97421cd8d7d9'},
//     INVOICING: {flowId:'70fc313b-4f6d-4e9b-b51e-ec803d845bb1', fileComponentId:'File-zeINU'},
//     RECONCILING: {flowId: 'adda70b1-e24a-4610-926a-ca8b80ed8a02', poComponent:'File-eclaI', invoiceComponent:'File-oqmWy'}
// }

// export const uploadFileAPI = (file) => async(dispatch) => {
//     try{
//         // Get the flowId based on the flag
//         const flow = AI_PLAYGROUND_WORKFLOWS['AGENT'];
//         if (!flow) {
//             throw new Error('Invalid flag provided');
//         }

//         const flowId = flow.flowId;
//         // console.log('uploading file to: ',flowId);

//         dispatch({type: UPLOAD_FILE_REQUEST});

//         console.log('uploading file api called');
//         const formData = new FormData();
//         formData.append('file', file);

//         const response = await axios.post(`${baseUrl}/api/v1/files/upload/${flowId}`, formData, {
//         // const response = await axios.post("https://aiplayground.salmonisland-47da943e.centralindia.azurecontainerapps.io/api/v1/files/upload/1ce871a4-e87b-4e82-beb8-b4ca7791baf6", formData, {
//             headers: {
//             'Content-Type': 'multipart/form-data',
//             'x-api-key': `${API_KEY}`
//             },
//             // responseType: 'json'
//         });

//         // console.log('file uploaded: ', response.data);
//         dispatch({type: UPLOAD_FILE_SUCCESS, payload: response.data});
//     } catch(error) {
//         console.log('Error:', error);
//         dispatch({
//             type: UPLOAD_FILE_FAIL,
//             payload: error.response?.data?.message || error.message,
//         });
//     }
// }

export const uploadFileAPI = async (file) => {
  try {
    // Get the flowId based on the flag
    const flow = AI_PLAYGROUND_WORKFLOWS["AGENT"];
    if (!flow) {
      throw new Error("Invalid flag provided");
    }

    const flowId = flow.flowId;
    // console.log('uploading file to: ',flowId);

    // dispatch({type: UPLOAD_FILE_REQUEST});

    console.log("uploading file api called");
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      `${baseUrl}/api/v1/files/upload/${flowId}`,
      formData,
      {
        // const response = await axios.post("https://aiplayground.salmonisland-47da943e.centralindia.azurecontainerapps.io/api/v1/files/upload/1ce871a4-e87b-4e82-beb8-b4ca7791baf6", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-api-key": `${API_KEY}`,
        },
        // responseType: 'json'
      }
    );

    const embeddingResponse = await fileIngestionAPI(response.data.file_path);
    console.log("Embedding response: ", embeddingResponse);
    return response.data;

    // console.log('file uploaded: ', response.data);
    // dispatch({type: UPLOAD_FILE_SUCCESS, payload: response.data});
  } catch (error) {
    console.log("Error:", error);
    return error;
    // dispatch({
    //     type: UPLOAD_FILE_FAIL,
    //     payload: error.response?.data?.message || error.message,
    // });
  }
};

export const fileIngestionAPI = async (filePath) => {
  try {
    const flow = AI_PLAYGROUND_WORKFLOWS["EMBEDDING"];
    if (!flow) {
      throw new Error("Invalid flag provided");
    }

    const flowId = flow.flowId;

    const response = await axios.post(
      `${baseUrl}/api/v1/run/${flowId}?stream=false`,
      {
        output_type: "text",
        input_type: "text",
        tweaks: {
          "File-YlTBO": {
            concurrency_multithreading: 4,
            delete_server_file_after_processing: true,
            ignore_unspecified_files: false,
            ignore_unsupported_extensions: true,
            path: `${filePath}`,
            silent_errors: false,
            use_multithreading: false,
          },
          "AstraDBGraph-G7Z3b": {
            api_endpoint:
              "https://ffb79266-f4ad-46b4-a2b0-0ece99e40c48-us-east-2.apps.astra.datastax.com",
            batch_size: null,
            bulk_delete_concurrency: null,
            bulk_insert_batch_concurrency: null,
            bulk_insert_overwrite_concurrency: null,
            collection_indexing_policy: "",
            collection_name: "graph_rag",
            keyspace: "",
            metadata_incoming_links_key: "",
            metadata_indexing_exclude: "",
            metadata_indexing_include: "",
            metric: "cosine",
            number_of_results: 4,
            pre_delete_collection: false,
            search_filter: {},
            search_query: "",
            search_score_threshold: 0,
            search_type: "MMR (Max Marginal Relevance) Graph Traversal",
            setup_mode: "Sync",
            should_cache_vector_store: true,
            token:
              "AstraCS:yNimqLgxEautZaNTBskyHLTK:f6c0dd7abf584ecf7c171e61768cb5626536d552d52b03250aa39406bc3265a9",
          },
          // "Chroma-H2OEq": {
          //   allow_duplicates: false,
          //   chroma_server_cors_allow_origins: "",
          //   chroma_server_grpc_port: null,
          //   chroma_server_host: "",
          //   chroma_server_http_port: null,
          //   chroma_server_ssl_enabled: false,
          //   collection_name: "auditor-rag-session",
          //   limit: null,
          //   number_of_results: 10,
          //   persist_directory: "auditor-copilot",
          //   search_query: "",
          //   search_type: "Similarity",
          //   should_cache_vector_store: true,
          // },
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": `${API_KEY}`,
        },
      }
    );

    return `Embedding created successfully for file: ${filePath}`;
  } catch (error) {
    console.log("Error:", error);
    return error;
  }
};

// {
//     "output_type": "text",
//     "input_type": "text",
//     "tweaks": {
//   "SplitText-dVZsu": {
//     "chunk_overlap": 200,
//     "chunk_size": 1000,
//     "separator": "\n",
//     "text_key": "text"
//   },
//   "File-YlTBO": {
//     "concurrency_multithreading": 4,
//     "delete_server_file_after_processing": true,
//     "ignore_unspecified_files": false,
//     "ignore_unsupported_extensions": true,
//     "path": "d90bc62f-1446-45af-b057-952065d6687f/2025-04-11_11-32-46_Luther.txt",
//     "silent_errors": false,
//     "use_multithreading": false
//   },
//   "Chroma-H2OEq": {
//     "allow_duplicates": false,
//     "chroma_server_cors_allow_origins": "",
//     "chroma_server_grpc_port": null,
//     "chroma_server_host": "",
//     "chroma_server_http_port": null,
//     "chroma_server_ssl_enabled": false,
//     "collection_name": "auditor-rag-session",
//     "limit": null,
//     "number_of_results": 10,
//     "persist_directory": "auditor12342",
//     "search_query": "",
//     "search_type": "Similarity",
//     "should_cache_vector_store": true
//   },
//   "AmazonBedrockEmbeddings-UpOIE": {
//     "aws_access_key_id": "AKIAZPFUTTLDJH6CGKGZ",
//     "aws_secret_access_key": "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",
//     "aws_session_token": "",
//     "credentials_profile_name": "",
//     "endpoint_url": "",
//     "model_id": "amazon.titan-embed-text-v1",
//     "region_name": "us-east-1"
//   }
// }
// }
