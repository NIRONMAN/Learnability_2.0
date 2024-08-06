import os
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from llama_parse import LlamaParse
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_pinecone.vectorstores import PineconeVectorStore
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_google_genai import GoogleGenerativeAI
import nest_asyncio
from flask_cors import CORS
from pinecone import Pinecone, ServerlessSpec

load_dotenv()
nest_asyncio.apply()


app = Flask(__name__)
CORS(app)  
# Initialize Llama Parse
parsing_instruction_manga = """The provided document is a PDF format. It will have diagrams, screenshots, images, tables, equations and text so parse accordingly."""
llama_parse = LlamaParse(result_type="markdown", parsing_instruction=parsing_instruction_manga)

# Initialize embeddings
embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=os.getenv("GOOGLE_API_KEY"))

# Initialize Pinecone
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

# Initialize LLM
llm = GoogleGenerativeAI(model="gemini-pro", google_api_key=os.getenv("GOOGLE_API_KEY"))

def parse_document(file_path):
    parsed_data = llama_parse.load_data(file_path)
    content = "".join(page.text for page in parsed_data)
    return content

def create_chunks(content):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=300, chunk_overlap=50)
    chunks = text_splitter.split_text(content)
    return chunks

def get_or_create_vectorstore(index_name):
    if index_name not in pc.list_indexes().names():
        pc.create_index(
            name=index_name,
            dimension=768,  # Adjust dimension based on your embedding model
            metric='cosine',
            spec=ServerlessSpec
        )
    return PineconeVectorStore(index_name=index_name, embedding=embeddings)

def store_embeddings(chunks, vectorstore):
    vectorstore.add_texts(chunks)
    return vectorstore

def create_query_chain(vectorstore):
    retriever = vectorstore.as_retriever(k=3)
    
    template = """Answer the question based only on the following context:
    {context}
    
    Question: {question}
    """
    prompt = ChatPromptTemplate.from_template(template)
    
    chain = (
        {"context": retriever, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )
    
    return chain

def process_document(file_path):
    content = parse_document(file_path)
    chunks = create_chunks(content)
    return chunks

def query_document(vectorstore, question):
    chain = create_query_chain(vectorstore)
    answer = chain.invoke(question)
    return answer

@app.route("/process", methods=['POST'])
def process_document_route():
    file_path = request.json.get('file_path', "./Unit 5 Notes_Ensemble Techniques.pdf")
    index_name = request.json.get('index_name', "test")
    
    chunks = process_document(file_path)
    vectorstore = get_or_create_vectorstore(index_name)
    store_embeddings(chunks, vectorstore)
    
    return jsonify({"message": "Document processed and stored successfully", "index_name": index_name})

@app.route("/query", methods=['POST'])
def query_route():
    body=request.json
    index_name = body["data"]["newIndex"]
    question = body["data"]["question"]
    print("index",index_name)
    print("question",question)
    print("body",type(body))
    vectorstore = get_or_create_vectorstore(index_name)
    answer = query_document(vectorstore, question)
    return jsonify({"answer": answer})

if __name__ == '__main__':
    app.run(debug=True)