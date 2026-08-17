import re

with open("extracted_code.txt", "r") as f:
    text = f.read()

quiz_rail = text.split("--- Add QuizModuleRail component ---")[1].split("---")[0].strip()
# Remove the leading ")\n}" from QuizModuleRail chunk
quiz_rail = quiz_rail.replace(")\n}\n\n", "")

media_rail = text.split("--- Add MediaModuleRail component ---")[1].split("---")[0].strip()
media_rail = media_rail.replace(")\n}\n\n", "")

render_quizzes = text.split("--- Replace renderQuizzes with the new Figma design layout ---")[1].split("---")[0].strip()
# renderQuizzes might have been split into pieces, but I can reconstruct it manually since it's just a few lines of JSX.

print(quiz_rail[:100])
