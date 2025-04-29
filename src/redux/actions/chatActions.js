import axios from "axios";

// const baseUrl = 'https://langflow-v3-large.salmonisland-47da943e.centralindia.azurecontainerapps.io'
export const baseUrl = import.meta.env.VITE_AI_PLAYGROUND_BASE_URL;
// https://langflow-v3-large.salmonisland-47da943e.centralindia.azurecontainerapps.io/api/v1/run/adda70b1-e24a-4610-926a-ca8b80ed8a02?stream=false
// const flowId = '91a3d1f1-fa91-4aff-a334-140860535fae'

export const API_KEY = import.meta.env.VITE_AI_PLAYGROUND_API_KEY;


export const AI_PLAYGROUND_WORKFLOWS = {
  // AGENT : {flowId:'982dce00-8135-42f0-bec1-4d898b09cf66'},
  EMBEDDING: { flowId: "d90bc62f-1446-45af-b057-952065d6687f" },
  AGENT: { flowId: "d8f722f8-6d97-49a4-85f7-841559e3eca9" },
};


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

