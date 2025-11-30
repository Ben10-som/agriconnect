import openai

openai.api_key = "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"

def translate_audio_to_french(file_path):
    audio_file = open(file_path, "rb")

    result = openai.audio.translations.create(
        model="whisper-1",
        file=audio_file
    )

    return result.text

print(translate_audio_to_french("audio2.mp4"))
