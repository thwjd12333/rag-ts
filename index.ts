import * as dotenv from "dotenv";
dotenv.config();


import {TextLoader} from "langchain/document_loaders/fs/text";
import { RecursiveCharaterTextSplitter} from "langchain/text_splitter";
import {OpenAIEmbeddings} from "@langchain/openai"
import {MemoryVectorStore} from "langchain/vectorsotres/memory";

async function basicRagPipeline() {
    console.log("RAG PipeLine Start");

    const loader =new TextLoader("./sample.txt");
    const docs = await loader.load();

    console.log("1. Document Load Success")

    const splitter = new RecursiveCharaterTextSplitter({
        chunkSize: 200,
        chunkOverlap: 20,
    })

    const splitDocs = await splitter.splitDocuments(docs);
    console.log("2. Document Split Success");

    const embeddings = new OpenAIEmbeddings();
    console.log("3. EMbedding Model Success")

    const vectorStore = await MemoryVectorStore.fromDocuments()
}