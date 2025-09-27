from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

docs = [
    "Python is a high-level programming language known for readability.",
    "LangChain is a framework for building LLM-powered applications.",
    "FAISS is a library for efficient similarity search over dense vectors.",
]

embeddings = OpenAIEmbeddings()
vectorstore = FAISS.from_texts(docs, embeddings)
retriever = vectorstore.as_retriever(search_kwargs={"k": 2})

prompt = ChatPromptTemplate.from_template(
    "Answer based on the context below:\n{context}\n\nQuestion: {question}"
)
llm = ChatOpenAI(model="gpt-3.5-turbo")

rag_chain = (
    {"context": retriever, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

if __name__ == "__main__":
    answer = rag_chain.invoke("What is LangChain used for?")
    print(answer)
