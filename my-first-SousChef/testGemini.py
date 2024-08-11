import os
import sys
import speech_recognition as sr
from gtts import gTTS
import google.generativeai as genai
from pygame import mixer
from google.generativeai.types.generation_types import StopCandidateException

# Setup your Google AI client with your API key
api_key = 'AIzaSyB6WrNfkM_RD2xny3vMBlT3awIiHk5WeWo'
if not api_key:
    print("GEMINI_API_KEY environment variable not set.")
    sys.exit(1)

genai.configure(api_key=api_key)

# Initialize a conversation history
conversation_history = []

def add_message_to_history(role, content):
    # Map 'assistant' role to 'model' for compatibility with the API
    if role == "assistant":
        role = "model"
    conversation_history.append({"role": role, "parts": [{"text": content}]})

def ask_sous_chef(user_input):
    if not conversation_history:
        add_message_to_history("model", "You are a cheerful, knowledgeable, and helpful cooking assistant. \
                               When providing recipes, you will first ask the user what ingredients they have, \
                               then provide a modified recipe by saying one step at a time, waiting \
                               for a response from the user, and then telling the next step until the end.")

    add_message_to_history("user", user_input)

    generation_config = {
        "temperature": 0.5,
        "top_p": 0.95,
        "top_k": 64,
        "max_output_tokens": 8192,
        "response_mime_type": "text/plain",
    }

    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        generation_config=generation_config,
    )

    chat_session = model.start_chat(history=conversation_history)
    
    try:
        response = chat_session.send_message(user_input)
        assistant_reply = response.text
        add_message_to_history("model", assistant_reply)
        print(f"Assistant reply: {assistant_reply}")  # Log the assistant's reply
        return assistant_reply
    except StopCandidateException as e:
        print(f"Safety filter triggered: {e}")
        return "I'm sorry, but I can't respond to that. Please try something else."

def speak(text):
    tts = gTTS(text=text, lang='en')
    tts.save('response.mp3')
    mixer.init()
    mixer.music.load('response.mp3')
    mixer.music.play()
    while mixer.music.get_busy():
        continue

def listen():
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        print("Listening...")
        audio = recognizer.listen(source)
        try:
            text = recognizer.recognize_google(audio)
            print(f"Recognized: {text}")
            return text
        except sr.UnknownValueError:
            print("Sorry, I did not understand that.")
            return listen()
        except sr.RequestError:
            print("Error with the service; please try again.")
            return ""

def main():
    print("Welcome to SousChef AI! Please speak into your microphone.")
    speak("Welcome to SousChef AI! Please speak into your microphone.")
    sys.stdout.flush()  # Ensure that output is flushed immediately to WebSocket
    while True:
        user_input = listen()
        if user_input.lower() in ["exit", "quit", "bye"]:
            speak("Goodbye!")
            break

        response = ask_sous_chef(user_input)
        print(f"Assistant response: {response}")  # Add logging to check the response
        speak(response)
        sys.stdout.flush()  # Ensure that output is flushed immediately to WebSocket

if __name__ == '__main__':
    main()
