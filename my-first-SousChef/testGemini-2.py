import os
import sys
import speech_recognition as sr
from gtts import gTTS
import google.generativeai as genai
from pygame import mixer
from pydub import AudioSegment
from pathlib import Path
from openai import OpenAI
import simpleaudio as sa
import mysql.connector

# Initialize OpenAI client
client = OpenAI(api_key='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')

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

def fetch_user_preferences(user_id):
    conn = mysql.connector.connect(
        host='localhost',
        user='your_db_user',
        password='your_db_password',
        database='mysouschefdb1'
    )
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT preferences, food_allergies FROM user WHERE user_id = %s', (user_id,))
    result = cursor.fetchone()
    conn.close()
    return result

def adjust_based_on_preferences(response, preferences):
    # Logic to adjust response based on preferences
    if preferences:
        if preferences.get('preferences'):
            response += f" Based on your preferences: {preferences['preferences']}."
        if preferences.get('food_allergies'):
            response += f" Remember to avoid {preferences['food_allergies']}."
    return response

def ask_sous_chef(user_input, user_id):
    preferences = fetch_user_preferences(user_id)
    
    if not conversation_history:
        add_message_to_history("model", "You are a cheerful, knowledgeable, and helpful cooking assistant. \
                               When providing recipes, you will first ask the user what ingredients they have, \
                               then provide a modified recipe by saying one step at a time, waiting \
                               for a response from the user, and then telling the next step until the end.")
        add_message_to_history("model", "Hi, what do you want to cook today?")

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
    response = chat_session.send_message(user_input)
    assistant_reply = response.text
    assistant_reply = adjust_based_on_preferences(assistant_reply, preferences)
    add_message_to_history("model", assistant_reply)

    print(f"Assistant reply: {assistant_reply}")  # Log the assistant's reply
    return assistant_reply

def speak(text):
    response = client.audio.speech.create(model='tts-1',
                                          voice='echo',
                                          input=text)
    speech_file_mp3 = Path('bot_answer.mp3')
    response.stream_to_file(speech_file_mp3)

    speech_file_wav = speech_file_mp3.with_suffix('.wav')
    AudioSegment.from_mp3(speech_file_mp3).export(speech_file_wav, format='wav')

    wave_obj = sa.WaveObject.from_wave_file(str(speech_file_wav))
    play_obj = wave_obj.play()
    play_obj.wait_done()

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
    user_id = sys.argv[1]
    speak("Welcome to SousChef AI! Please speak into your microphone.")
    while True:
        user_input = listen()
        if user_input.lower() in ["exit", "quit", "bye"]:
            speak("Goodbye!")
            break

        response = ask_sous_chef(user_input, user_id)
        speak(response)

if __name__ == '__main__':
    main()
