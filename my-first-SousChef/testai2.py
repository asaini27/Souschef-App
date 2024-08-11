import sys
import json
from openai import OpenAI, ChatCompletion

state_file = 'conversation_state.json'
client = OpenAI(api_key="sk-proj-t0t4TlGM4exNKguQHrfZT3BlbkFJvr7GA2vtEQUZ36ZO1BJW")

def load_state():
    try:
        with open(state_file, 'r') as file:
            return json.load(file)
    except FileNotFoundError:
        return []

def save_state(conversation_history):
    with open(state_file, 'w') as file:
        json.dump(conversation_history, file)

def ask_sous_chef(user_input):
    conversation_history = load_state()

    if not conversation_history:
        conversation_history.append({"role": "system", "content": "You are a cheerful, knowledgeable and helpful cooking assistant, When providing recipes you will first ask the user what ingredients they have then provide a modified recipe by saying one step at a time and then waiting for a response from the user and then tell the next step and do the same process till the end."})
        conversation_history.append({"role": "assistant", "content": "Hi, what do you want to cook today?"})

    conversation_history.append({"role": "user", "content": user_input})

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=conversation_history,
        temperature=0.5
    )
    assistant_reply = response.choices[0].message.content
    conversation_history.append({"role": "assistant", "content": assistant_reply})
    save_state(conversation_history)

    return assistant_reply

if __name__ == '__main__':
    user_input = sys.argv[1]
    print(ask_sous_chef(user_input))

