"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
//RAG의 5단계(Load → Split → Embed → Store → Retrieve)
var dotenv = require("dotenv");
dotenv.config(); // .env 파일 로드
var text_1 = require("@langchain/community/document_loaders/fs/text");
var text_splitter_1 = require("langchain/text_splitter");
var openai_1 = require("@langchain/openai");
var memory_1 = require("langchain/vectorstores/memory");
function basicRagPipeline() {
    return __awaiter(this, void 0, void 0, function () {
        var loader, docs, splitter, splitDocs, embeddings, vectorStore, retriever, query, searchResults;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("RAG PipeLine Start");
                    loader = new text_1.TextLoader("./sample.txt");
                    return [4 /*yield*/, loader.load()];
                case 1:
                    docs = _a.sent();
                    console.log("1. Document Load Success");
                    splitter = new text_splitter_1.RecursiveCharacterTextSplitter({
                        chunkSize: 200,
                        chunkOverlap: 20,
                    });
                    return [4 /*yield*/, splitter.splitDocuments(docs)];
                case 2:
                    splitDocs = _a.sent();
                    console.log("2. Document Split Success");
                    embeddings = new openai_1.OpenAIEmbeddings();
                    console.log("3. EMbedding Model Success");
                    return [4 /*yield*/, memory_1.MemoryVectorStore.fromDocuments(splitDocs, embeddings)
                        //벡터 Db를 Retriever로 변환
                    ];
                case 3:
                    vectorStore = _a.sent();
                    retriever = vectorStore.asRetriever();
                    query = "AI 에이전트가 뭐야?";
                    return [4 /*yield*/, retriever.invoke(query)];
                case 4:
                    searchResults = _a.sent();
                    console.log("5. 검색 완료.");
                    console.log("\n--- 검색된 관련 문서 ---");
                    console.log(searchResults[0].pageContent);
                    return [2 /*return*/];
            }
        });
    });
}
basicRagPipeline();
