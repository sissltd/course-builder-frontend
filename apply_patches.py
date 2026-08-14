import json

log_path = "/Users/user/.gemini/antigravity-ide/brain/3b9ce6fe-72ff-4e63-a1bc-9b1d23d9f37f/.system_generated/logs/transcript_full.jsonl"
file_path = "/Users/user/projects/course-builder-frontend/src/modules/reviewer/course-overview/ReviewerCourseOverviewView.tsx"

with open(file_path, "r") as f:
    content = f.read()

with open(log_path, "r") as f:
    for line in f:
        try:
            data = json.loads(line)
            if "tool_calls" in data:
                for call in data["tool_calls"]:
                    if call["name"] in ["replace_file_content", "multi_replace_file_content"]:
                        args = call["args"]
                        if isinstance(args, str):
                            args = json.loads(args)
                        
                        target_file = args.get("TargetFile", "")
                        if "ReviewerCourseOverviewView" in target_file:
                            # Apply the patch
                            if call["name"] == "replace_file_content":
                                target = args["TargetContent"]
                                replacement = args["ReplacementContent"]
                                if target in content:
                                    content = content.replace(target, replacement, 1)
                                    print(f"Applied: {args.get('Instruction')}")
                                else:
                                    print(f"FAILED to apply (target not found): {args.get('Instruction')}")
                            elif call["name"] == "multi_replace_file_content":
                                chunks = args.get("ReplacementChunks", [])
                                for i, chunk in enumerate(chunks):
                                    target = chunk["TargetContent"]
                                    replacement = chunk["ReplacementContent"]
                                    if target in content:
                                        content = content.replace(target, replacement, 1)
                                        print(f"Applied: {args.get('Instruction')} Chunk {i}")
                                    else:
                                        print(f"FAILED to apply (target not found): {args.get('Instruction')} Chunk {i}")
        except Exception as e:
            pass

with open(file_path, "w") as f:
    f.write(content)
print("Done patching.")
