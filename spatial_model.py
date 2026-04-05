import math

# store node coordinates dynamically
NODE_COORDS = {}

def update_node_location(node_id, lat, lon):
    NODE_COORDS[node_id] = (lat, lon)

def get_neighbors(node_id, k=3):

    if node_id not in NODE_COORDS:
        return []

    x1, y1 = NODE_COORDS[node_id]

    distances = []

    for other_id, (x2, y2) in NODE_COORDS.items():
        if other_id == node_id:
            continue

        dist = math.sqrt((x1 - x2)**2 + (y1 - y2)**2)
        distances.append((other_id, dist))

    distances.sort(key=lambda x: x[1])

    return [node for node, _ in distances[:k]]