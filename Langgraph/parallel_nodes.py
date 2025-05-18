from langgraph.graph import StateGraph, END
from typing import TypedDict

class PState(TypedDict):
    text: str
    sentiment: str
    summary: str
    final: str

def sentiment_node(state: PState) -> PState:
    words = state["text"].lower().split()
    pos = sum(1 for w in words if w in ["good", "great", "excellent", "love"])
    state["sentiment"] = "positive" if pos > 0 else "neutral"
    return state

def summary_node(state: PState) -> PState:
    words = state["text"].split()
    state["summary"] = " ".join(words[:5]) + "..."
    return state

def merge_node(state: PState) -> PState:
    state["final"] = f"Sentiment={state['sentiment']} | Summary={state['summary']}"
    return state

def build():
    g = StateGraph(PState)
    g.add_node("sentiment", sentiment_node)
    g.add_node("summary", summary_node)
    g.add_node("merge", merge_node)
    g.set_entry_point("sentiment")
    g.add_edge("sentiment", "summary")
    g.add_edge("summary", "merge")
    g.add_edge("merge", END)
    return g.compile()

if __name__ == "__main__":
    r = build().invoke({"text": "Great product love the quality", "sentiment": "", "summary": "", "final": ""})
    print(r["final"])
