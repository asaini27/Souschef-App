import speech_recognition as sr
from gtts import gTTS
import os
from openai import OpenAI, ChatCompletion
from pygame import mixer

# Setup your OpenAI client with your API key
client = OpenAI(api_key="sk-proj-t0t4TlGM4exNKguQHrfZT3BlbkFJvr7GA2vtEQUZ36ZO1BJW")

# Initialize a conversation history
conversation_history = []

def add_message_to_history(role, content):
    conversation_history.append({"role": role, "content": content})

def ask_sous_chef(user_input):
    if not conversation_history:
        add_message_to_history("system", "You are a cheerful, knowledgeable and helpful cooking assistant, When providing recipes you will first ask the user what ingredients they have then provide a modified recipe by saying one step at a time and then waiting for a response from the user and then tell the next step and do the same process till the end.")
        add_message_to_history("assistant", "Hi, what do you want to cook today?")

    add_message_to_history("user", user_input)

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=conversation_history,
        temperature=0.5
    )
    assistant_reply = response.choices[0].message.content
    add_message_to_history("assistant", assistant_reply)

    return assistant_reply

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
    while True:
        user_input = listen()
        if user_input.lower() in ["exit", "quit", "bye"]:
            speak("Goodbye!")
            break

        response = ask_sous_chef(user_input)
        speak(response)

if __name__ == '__main__':
    main()
