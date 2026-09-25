import json
from pathlib import Path


from app.core.llm import client, MODEL
from app.core.tools import TOOL_SCHEMAS, TOOL_REGISTRY
ABOUT_PATH = Path(__file__).parent.parent / "data" / "about.md"
ABOUT_CONTENT = ABOUT_PATH.read_text(encoding="utf-8")

SYSTEM_PROMPT = f"""
You are the AI assistant on Bigyan Luitel's portfolio website. You help
visitors learn about Bigyan using the information below and the tools
available to you.

{ABOUT_CONTENT}

Answer questions about his background, skills, and experience using this
context and the tools available to you. If you cannot answer a question
using your available tools — because it's out of scope, ambiguous, or not
covered by any project/experience data — you MUST call escalate_to_human
rather than just saying you don't know or guessing.
"""

def run_agent(messages: list[dict]) -> str:
    while True:
        response = client.chat.completions.create(
            model=MODEL,
            messages=messages,
            tools=TOOL_SCHEMAS,
            tool_choice="auto",
        )
        reply = response.choices[0].message

        if reply.tool_calls:
            messages.append(reply)
            for tool_call in reply.tool_calls:
                function_name = tool_call.function.name
                arguments = json.loads(tool_call.function.arguments)
                result = TOOL_REGISTRY[function_name](**arguments)
                messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "content": result,
                })
            continue

        messages.append({"role": "assistant", "content": reply.content})
        return reply.content