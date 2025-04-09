// import axios from "axios";
// import file from './DummyText.txt';

// const baseUrl = 'https://langflow-v3-large.salmonisland-47da943e.centralindia.azurecontainerapps.io'
// // const flowId = '91a3d1f1-fa91-4aff-a334-140860535fae'

// const WORKFLOWS = {
//     RAG: {flowId:'d7af9af5-efbc-46c1-924e-25397792d27a'},
//     INVOICING: {flowId:'e7fe8081-0b38-4985-820f-244a02347ccc', fileComponentId:'File-5LGLh'}
// }

// // export const generateInvoiceAPI = async() =>{
// //     try{
// //         const aiPlaygroundClient = new LangflowClient({baseUrl})
// //         const flow = aiPlaygroundClient.flow(flowId)
// //         const input = 'Hello from the IMS system!'
// //         const response = await aiPlaygroundClient.flow(flowId).run(input)
// //         console.log('response:', response);
        
// //     }
// //     catch(error){
// //         console.log('Error:', error)
// //     } 
// // }

// export const uploadFileAPI = async (flowId, file) => {
//     try{
//         const response = await axios.post(`${baseUrl}/api/v1/files/upload/${flowId}`,{
//             file: file
//         })
//         console.log('file uploaded: ', response);
        
//     }catch(error){
//         console.log('Error:', error)
//     }
// }

// export const generateInvoiceAPI = async (filePath) => {
//     try{
//         // e7fe8081-0b38-4985-820f-244a02347ccc/2025-03-19_16-43-05_TLE-EIS-2425-776-Kloudineer (1) (1).pdf
//         const filePath = "e7fe8081-0b38-4985-820f-244a02347ccc/2025-03-19_11-57-16_TLE-EIS-2425-776-Kloudineer (1) (1).pdf"
//         console.log('Making api for generating invoice');
//         const {data} = await axios.post(`${baseUrl}/api/v1/run/${WORKFLOWS.INVOICING.flowId}?stream=false`,{
//             // input_value: "What is inside the file.",
//             output_type: "chat",
//             input_type: "chat",
//             tweaks: {
//                 [WORKFLOWS.INVOICING.fileComponentId]: {
//                     "path":filePath
//                 }
//             }
//         })
//         const invoiceData = data.outputs[0].outputs[0].results.message.text
//         console.log('origin id: ',invoiceData);
        
//         // console.log('Invoice Data: ',data.outputs[0].outputs[0].results.message.text);
        
//         return invoiceData
//     }catch(error){
//         console.log('Error:', error)
//     }
// }

// // export const generateInvoiceAPI = async () => {
// //   try {
// //     // console.log('Making api call with file');
    
// //     const response = await axios.post(
// //       `${baseUrl}/api/v1/run/91a3d1f1-fa91-4aff-a334-140860535fae?stream=false`,
// //       {
// //         input_value: "What is inside the file.",
// //         output_type: "chat",
// //         input_type: "chat",
// //         tweaks: {
// //           "File-wE29p": {
// //             path: '3ef4d04e-845f-4d0f-a246-bb536372648f/2025-03-19_10-06-56_Second_dummy_text.txt',
// //             concurrency_multithreading: 1,
// //             delete_server_file_after_processing: true,
// //             ignore_unspecified_files: false,
// //             ignore_unsupported_extensions: true,
// //             silent_errors: false,
// //             use_multithreading: true,
// //           },
// //         },
// //       },
// //       {
// //         header: {
// //           "Content-Type": "application/json",
// //         },
// //       }
// //     );
// //     console.log(response);
// //   } catch (error) {
// //     console.log("Error:", error);
// //   }
// // };
