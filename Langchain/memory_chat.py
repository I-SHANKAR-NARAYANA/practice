from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory

# reviewed
llm = ChatOpenAI(model="gpt-3.5-turbo")
store = {}


def get_session_history(session_id: str):
    if session_id not in store:
        store[session_id] = InMemoryChatMessageHistory()
    return store[session_id]

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a concise assistant."),
    MessagesPlaceholder(variable_name="history"),
    ("human", "{input}"),
])

chain = RunnableWithMessageHistory(
    prompt | llm,
    get_session_history,
    input_messages_key="input",
    history_messages_key="history",
)

if __name__ == "__main__":
    cfg = {"configurable": {"session_id": "user1"}}
    r1 = chain.invoke({"input": "My name is Alex"}, config=cfg)
    print(r1.content)
    r2 = chain.invoke({"input": "What is my name?"}, config=cfg)
    print(r2.content)
