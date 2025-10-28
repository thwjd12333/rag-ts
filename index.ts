import * as dotenv from "dotenv";
dotenv.config();

// [유지] Node.js 'fs' 모듈 (TextLoader 대체)
import { readFileSync } from "fs"; 
import { Document } from "@langchain/core/documents"; 

// [유지] '@langchain/textsplitters' (이것은 해결됨)
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

// [유지] '@langchain/openai' (이것은 해결됨)
import { OpenAIEmbeddings } from "@langchain/openai";

// [대체] MemoryVectorStore 대신 HNSWLib를 사용합니다.
// (import 경로가 '@langchain/community'입니다.)
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";

// (package.json의 "type": "module"과
// tsconfig.json의 "module": "NodeNext" 설정은 그대로 유지합니다.)

async function basicRagPipeline() {
  console.log("RAG 파이프라인 시작...");

  // 1. Load (불러오기) - [유지] (fs 모듈 사용)
  const fileContents = readFileSync("./sample.txt", "utf8");
  const docs = [
    new Document({
      pageContent: fileContents,
      metadata: { source: "./sample.txt" },
    }),
  ];
  console.log("1. 문서 로드 완료 (fs 모듈 사용).");

  // 2. Split (자르기) - [유지]
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 200,
    chunkOverlap: 20,
  });
  const splitDocs = await splitter.splitDocuments(docs);
  console.log("2. 문서 분할 완료.");

  // 3. Embed (임베딩) - [유지]
  const embeddings = new OpenAIEmbeddings();
  console.log("3. 임베딩 모델 준비 완료.");

  // 4. Store (저장) - [수정됨]
  // MemoryVectorStore.fromDocuments -> HNSWLib.fromDocuments
  const vectorStore = await HNSWLib.fromDocuments(
    splitDocs,
    embeddings
  );
  console.log("4. HNSWLib 인메모리 벡터 DB에 저장 완료.");

  // 5. Retrieve (검색) - [유지]
  const retriever = vectorStore.asRetriever();
  const query = "AI 에이전트가 뭐야?";
  const searchResults = await retriever.invoke(query);
  
  console.log("5. 검색 완료.");
  console.log("\n--- 검색된 관련 문서 ---");
  console.log(searchResults[0]?.pageContent ?? "검색 결과 없음");
}

basicRagPipeline();