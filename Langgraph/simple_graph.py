from langgraph.graph import StateGraph, END
from typing import TypedDict

class State(TypedDict):
    input: str
    result: str

def preprocess(state: State) -> State:
    state["input"] = state["input"].strip().lower()
    return state

def analyze(state: State) -> State:
    text = state["input"]
    word_count = len(text.split())
    state["result"] = f"Words: {word_count}, Chars: {len(text)}"
    return state

def build_graph():
    g = StateGraph(State)
    g.add_node("preprocess", preprocess)
    g.add_node("analyze", analyze)
    g.set_entry_point("preprocess")
    g.add_edge("preprocess", "analyze")
    g.add_edge("analyze", END)
    return g.compile()
if __name__ == "__main__":
    app = build_graph()
    out = app.invoke({"input": "  Hello World from LangGraph  ", "result": ""})
    print(out["result"])
