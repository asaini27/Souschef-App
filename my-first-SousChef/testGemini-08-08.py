import os
import sys
import google.generativeai as genai
from google.cloud import texttospeech
from google.cloud import speech
import simpleaudio as sa
import speech_recognition as sr

# Setup your Google AI client with your API key
api_key = 'AIzaSyB6WrNfkM_RD2xny3vMBlT3awIiHk5WeWo'
if not api_key:
    print("GEMINI_API_KEY environment variable not set.")
    sys.exit(1)

genai.configure(api_key=api_key)

# Initialize Google Text-to-Speech and Speech-to-Text clients
tts_client = texttospeech.TextToSpeechClient()
stt_client = speech.SpeechClient()

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
    add_message_to_history("model", assistant_reply)

    print(f"Assistant reply: {assistant_reply}")  # Log the assistant's reply
    return assistant_reply

def generate_speech(text):
    input_text = texttospeech.SynthesisInput(text=text)
    voice = texttospeech.VoiceSelectionParams(language_code="en-US", name="en-US-Wavenet-D")
    audio_config = texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.LINEAR16)

    response = tts_client.synthesize_speech(input=input_text, voice=voice, audio_config=audio_config)
    
    speech_file = "output.wav"
    with open(speech_file, "wb") as out:
        out.write(response.audio_content)
        print(f'Audio content written to file {speech_file}')
    
    return speech_file

def transcribe_audio(audio_file):
    with open(audio_file, "rb") as f:
        audio_data = f.read()

    audio = speech.RecognitionAudio(content=audio_data)
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=44100,  # Match this to the actual sample rate of the WAV file
        language_code="en-US"
    )

    response = stt_client.recognize(config=config, audio=audio)
    
    # Check if the response has any results
    if not response.results:
        print("No speech detected in the audio file.")
        return "Sorry, I couldn't hear you. Could you please repeat?"

    return response.results[0].alternatives[0].transcript

    response = stt_client.recognize(config=config, audio=audio)
    return response.results[0].alternatives[0].transcript
def speak(text):
    speech_file = generate_speech(text)
    wave_obj = sa.WaveObject.from_wave_file(speech_file)
    play_obj = wave_obj.play()
    play_obj.wait_done()

def listen():
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        print("Listening...")
        audio = recognizer.listen(source)
        with open("input.wav", "wb") as f:
            f.write(audio.get_wav_data())
        return transcribe_audio("input.wav")

def main():
    speak("Welcome to SousChef AI! Please speak into your microphone.")
    while True:
        user_input = listen()
        if user_input.lower() in ["exit", "quit", "bye"]:
            speak("Goodbye!")
            break

        response = ask_sous_chef(user_input)
        speak(response)

if __name__ == '__main__':
    main()
