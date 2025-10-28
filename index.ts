import * as dotenv from "dotenv";
dotenv.config();

// [수정] '@langchain/community'의 'fs/text' 경로입니다.
import { TextLoader } from "@langchain/community/document_loaders/fs/text";

// [유지] '@langchain/textsplitters'가 맞습니다.
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

// [유지] '@langchain/openai'가 맞습니다.
import { OpenAIEmbeddings } from "@langchain/openai";

// [유지] '@langchain/community'의 'memory' 경로가 맞습니다.
import { MemoryVectorStore } from "@langchain/community/vectorstores/memory";

async function basicRagPipeline() {
  console.log("RAG 파이프라인 시작...");

  // 1. Load
  const loader = new TextLoader("./sample.txt"); // sample.txt 파일 확인
  const docs = await loader.load();
  console.log("1. 문서 로드 완료.");

  // 2. Split
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 200,
    chunkOverlap: 20,
  });
  const splitDocs = await splitter.splitDocuments(docs);
  console.log("2. 문서 분할 완료.");

  // 3. Embed
  const embeddings = new OpenAIEmbeddings();
  console.log("3. 임베딩 모델 준비 완료.");

  // 4. Store
  const vectorStore = await MemoryVectorStore.fromDocuments(
    splitDocs,
    embeddings
  );
  console.log("4. 인메모리 벡터 DB에 저장 완료.");

  // 5. Retrieve
  const retriever = vectorStore.asRetriever();
  const query = "AI 에이전트가 뭐야?";
  const searchResults = await retriever.invoke(query);
  
  console.log("5. 검색 완료.");
  console.log("\n--- 검색된 관련 문서 ---");
  console.log(searchResults[0].pageContent);
}

basicRagPipeline();