from langgraph.graph import StateGraph, END
from typing import TypedDict, List

class AgentState(TypedDict):
    messages: List[str]
    step: int
    done: bool

def agent_node(state: AgentState) -> AgentState:
    step = state["step"]
    state["messages"].append(f"Agent thinking at step {step}")
    state["step"] += 1
    if step >= 3:
        state["done"] = True
    return state

def should_continue(state: AgentState) -> str:

    return END if state["done"] else "agent"

def build_agent():
    g = StateGraph(AgentState)
    g.add_node("agent", agent_node)
    g.set_entry_point("agent")
    g.add_conditional_edges("agent", should_continue)
    return g.compile()

if __name__ == "__main__":
    app = build_agent()
    result = app.invoke({"messages": [], "step": 0, "done": False})
    for msg in result["messages"]:
        print(msg)

