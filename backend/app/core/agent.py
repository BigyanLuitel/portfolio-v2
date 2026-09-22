import json

from app.core.llm import client, MODEL
from app.core.tools import TOOL_SCHEMAS, TOOL_REGISTRY

SYSTEM_PROMPT = """
You are Bigyan Luitel's portfolio assistant.
Answer questions about his projects and experience using the tools available to you.
If you cannot answer a question using your available tools — because it's out of scope, ambiguous, or not covered by any project/experience data — you MUST call escalate_to_human rather than just saying you don't know or guessing.
"""

def run_agent(user_message: str)-> str:
    messages = [
        {"role":"system", "content":SYSTEM_PROMPT},
        {"role":"user","content":user_message},
    ]
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
        return reply.content