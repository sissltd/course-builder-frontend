import json

log_path = "/Users/user/.gemini/antigravity-ide/brain/3b9ce6fe-72ff-4e63-a1bc-9b1d23d9f37f/.system_generated/logs/transcript_full.jsonl"
with open(log_path, 'r') as f:
    for line in f:
        try:
            data = json.loads(line)
            if 'tool_calls' in data:
                for call in data['tool_calls']:
                    if call['function']['name'] in ['default_api:replace_file_content', 'default_api:multi_replace_file_content']:
                        args = json.loads(call['function']['arguments'])
                        if 'ReviewerCourseOverviewView.tsx' in args.get('TargetFile', ''):
                            print(f"Found edit: {args.get('Instruction', 'No instruction')}")
                            if 'ReplacementContent' in args:
                                with open('extracted_edit.txt', 'a') as out:
                                    out.write(f"\n--- {args.get('Instruction')} ---\n")
                                    out.write(args['ReplacementContent'])
                            if 'ReplacementChunks' in args:
                                for i, chunk in enumerate(args['ReplacementChunks']):
                                    with open('extracted_edit.txt', 'a') as out:
                                        out.write(f"\n--- {args.get('Instruction')} Chunk {i} ---\n")
                                        out.write(chunk['ReplacementContent'])
        except Exception as e:
            pass
