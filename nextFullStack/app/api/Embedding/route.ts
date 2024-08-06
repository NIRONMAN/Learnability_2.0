import { NextRequest, NextResponse } from "next/server";

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

export function POST(req:NextRequest,res:NextResponse){

// Access your API key as an environment variable (see our Getting Started tutorial)

async function run() {
// For embeddings, use the Text Embeddings model
const model = genAI.getGenerativeModel({ model: "text-embedding-004"});

const text = "The quick brown fox jumps over the lazy dog."

const result = await model.embedContent(text);
const embedding = result.embedding;
console.log(embedding.values);
}

run();
}