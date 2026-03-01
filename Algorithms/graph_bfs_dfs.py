from collections import deque
from typing import Dict, List

Graph = Dict[str, List[str]]

def bfs(graph: Graph, start: str) -> List[str]:
    visited = {start}
    queue   = deque([start])
    order   = []
    while queue:
        node = queue.popleft()
        order.append(node)
        for nbr in graph.get(node, []):
            if nbr not in visited:
                visited.add(nbr)
                queue.append(nbr)
    return order

def dfs(graph: Graph, start: str, visited: set = None) -> List[str]:
    if visited is None:
        visited = set()
    visited.add(start)
    result = [start]
    for nbr in graph.get(start, []):
        if nbr not in visited:
            result.extend(dfs(graph, nbr, visited))
    return result

def has_cycle(graph: Graph) -> bool:
    visited, rec_stack = set(), set()
    def _dfs(node):
        visited.add(node); rec_stack.add(node)
        for nbr in graph.get(node, []):
            if nbr not in visited and _dfs(nbr): return True
            if nbr in rec_stack: return True
        rec_stack.discard(node)
        return False
    return any(_dfs(n) for n in graph if n not in visited)

if __name__ == "__main__":
    g = {"A": ["B","C"], "B": ["D","E"], "C": ["F"], "D": [], "E": ["F"], "F": []}
    print("BFS:", bfs(g, "A"))
    print("DFS:", dfs(g, "A"))
    print("Has cycle:", has_cycle(g))
