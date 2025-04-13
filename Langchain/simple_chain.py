from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_openai import ChatOpenAI

# Simple LLM chain using LCEL (LangChain Expression Language)
llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0)

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant that explains concepts simply."),
    ("user", "{topic}")
])

chain = prompt | llm | StrOutputParser()

def explain(topic: str) -> str:
    return chain.invoke({"topic": f"Explain {topic} in 2 sentences."})

if __name__ == "__main__":
    topics = ["recursion", "REST APIs", "neural networks"]
    for t in topics:
        print(f"\n{t}:")
        print(explain(t))
