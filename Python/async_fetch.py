import asyncio
import random

async def fetch_data(url: str, delay: float) -> dict:
    print(f"Fetching {url}...")
    await asyncio.sleep(delay)
    return {
        "url": url,
        "status": 200,
        "data": f"response_{random.randint(1, 100)}"
    }

async def main():
    urls = [
        ("https://api.example.com/users", 1.2),
        ("https://api.example.com/posts", 0.8),
        ("https://api.example.com/comments", 1.5),
    ]
    tasks = [fetch_data(url, delay) for url, delay in urls]
    results = await asyncio.gather(*tasks)
    for r in results:
        print(f"Got: {r}")
if __name__ == "__main__":
    asyncio.run(main())

