import tkinter as tk
from tkinter import messagebox as messagebox
import ffmpeg 
import os
import pytubefix as pytube
from faster_whisper import WhisperModel
import math
import shlex
import subprocess

os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

def extract_audio(input_file):
    print(f"Extracting audio from {input_file}...")
    extracted_audio = f"audio-{input_file}.wav"
    try:
        ffmpeg.input(input_file).output(extracted_audio).run(overwrite_output=True)
        print(f"Audio extracted successfully: {extracted_audio}")
    except ffmpeg.Error as e:
        error_message = e.stderr.decode() if e.stderr else str(e)
        print(f"FFmpeg error: {error_message}")
        raise e
    return extracted_audio

def transcribe_audio(audio):
    model = WhisperModel("small", device="cpu")
    segments, info = model.transcribe(audio)
    language = info[0]
    segments = list(segments)
    for segment in segments:
        print("[%.2fs -> %.2fs] %s" % (segment.start, segment.end, segment.text))
    return language, segments

def convert_to_SRT(seconds):
    seconds = math.floor(seconds)
    hours = seconds // 3600
    seconds = seconds - (3600 * hours)
    minutes = seconds // 60
    seconds = seconds - 60 * minutes
    return f"{hours:02}:{minutes:02}:{seconds:02},000"

def generate_subtitle_file(input_file, language, segments):
    subtitle_file = f"sub-{input_file}.{language}.srt"
    text = ""
    for index, segment in enumerate(segments):
        segment_start = convert_to_SRT(segment.start)
        segment_end = convert_to_SRT(segment.end)
        text += f"{str(index + 1)}\n"
        text += f"{segment_start} --> {segment_end}\n"
        text += f"{segment.text}\n\n"
        print(f"Segment {index + 1}:")
        print(f"Start: {segment_start}, End: {segment_end}, Text: {segment.text}")
    with open(subtitle_file, "w") as f:
        f.write(text)
    return subtitle_file

def summarize_transcription(segments):
    summary = "Summary of the transcription:\n\n"
    for segment in segments:
        summary += f"{segment.text}\n"
    return summary

def add_overlay_text(input_file, segments):
    import os
    from pathlib import Path
    import ffmpeg

    # Define font settings (you can customize these)
    font = "Arial"  # Use a common system font
    font_size = 36
    font_color = "yellow"
    x_position = "(w-tw)/2"
    y_position = "h-(h*0.2)"  # Positioning text near the bottom

    # Start with the input stream
    input_stream = ffmpeg.input(input_file)
    
    # Apply filters for each segment
    filter_chain = input_stream.video
    for segment in segments:
        start_time = segment.start
        end_time = segment.end
        text = segment.text.replace("'", "\\'")  # Escape single quotes
        filter_chain = filter_chain.drawtext(
            text=text,
            x=x_position,
            y=y_position,
            fontsize=font_size,
            fontcolor=font_color,
            font=font,
            enable=f'between(t,{start_time},{end_time})'
        )
    
    # Define output file name
    output_file = f"overlay-{Path(input_file).stem}.mp4"

    # Combine video and audio and output
    try:
        ffmpeg.output(filter_chain, input_stream.audio, output_file).run(overwrite_output=True)
        print(f"Overlay video created successfully: {output_file}")
        return output_file
    except ffmpeg.Error as e:
        error_message = e.stderr.decode() if e.stderr else str(e)
        print(f"FFmpeg error: {error_message}")
        raise e



def add_subtitle_to_video(input_file, subtitle_file, subtitle_language):
    output_video = f"output-{input_file}-{subtitle_language}.mp4"
    try:
        ffmpeg.input(input_file).output(output_video, vf=f"subtitles={subtitle_file}", acodec='aac', vcodec='libx264').run(overwrite_output=True)
        print(f"Subtitles added successfully: {output_video}")
    except ffmpeg.Error as e:
        error_message = e.stderr.decode() if e.stderr else str(e)
        print(f"FFmpeg error: {error_message}")
        raise e

def add_summary_to_video(input_file, summary):
    summary_file = f"summary-{input_file}"
    try:
        # Create a text file with the summary
        with open(summary_file + '.txt', 'w') as f:
            f.write(summary)
        
        # Add the summary as a video overlay
        ffmpeg.input(input_file).output(summary_file + '.mp4', vf=f"drawtext=textfile={summary_file}.txt:fontcolor=white:fontsize=24:box=1:boxcolor=black@0.5", vcodec='libx264').run(overwrite_output=True)
        print(f"Summary added successfully: {summary_file}.mp4")
    except ffmpeg.Error as e:
        error_message = e.stderr.decode() if e.stderr else str(e)
        print(f"FFmpeg error: {error_message}")
        raise e
    return summary_file + '.mp4'

def save_summary_file(summary):
    summary_file = "summary.txt"
    try:
        with open(summary_file, 'w') as f:
            f.write(summary)
        print(f"Summary file saved successfully: {summary_file}")
    except IOError as e:
        print(f"Error writing summary file: {e}")
        raise e
    return summary_file


def getURL():
    url = URL_entry.get()
    if not url:
        messagebox.showwarning("Input Error", "Please enter a valid YouTube URL.")
        return

    try:
        yt_video = pytube.YouTube(url)
        stream = yt_video.streams.filter(progressive=True, file_extension='mp4').order_by('resolution').desc().first()
        if stream:
            working_directory = os.getcwd()
            stream.download(output_path=working_directory)
            video_file = stream.default_filename

            audio_extract = extract_audio(video_file)
            print("Audio extracted successfully!")

            language, segments = transcribe_audio(audio_extract)
            print("Language and segments retrieved successfully!")

            # Generate overlayed video with subtitles
            overlayed_video = add_overlay_text(video_file, segments)
            print("Overlayed video created successfully!")

            messagebox.showinfo("Success", "Transcription and subtitle process completed successfully!")
        else:
            messagebox.showwarning("Download Error", "No video stream found for download.")
    except pytube.exceptions.PytubeFixError as e:
        messagebox.showwarning("Pytube Error", f"An error occurred with Pytube: {e}")
        print(f"Pytube Error: {e}")
    except Exception as e:
        messagebox.showwarning("An error occurred", f"{e}")
        print(f"An error occurred: {e}")
    finally:
        messagebox.showinfo("Thank You", "Thanks for using AI Transcriber!")

# Creates the main window
root = tk.Tk()
root.title("AI Transcriber")  # Sets the window title
root.geometry("500x500")  # Sets the window size to 500x500 pixels

# Creates input fields and labels
URL_label = tk.Label(root, text="Enter your YouTube Video's URL:")  # Creates the label
URL_label.pack(pady=10)  # Packs the label into the window with padding
URL_entry = tk.Entry(root)  # Creates an input field to enter the URL
URL_entry.pack(pady=10)  # Packs the input field into the window with padding

# Creates a button that calls the function
run_button = tk.Button(root, text="Transcribe Video!", command=getURL)
run_button.pack(pady=20)  # Packs the button into the window with padding

# Runs the main event loop of the application
root.mainloop()
