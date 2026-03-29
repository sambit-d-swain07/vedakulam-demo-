import re

# Read the correct header from index.html
with open('index.html', 'r', encoding='utf-8') as f:
    index_content = f.read()

# Extract the header block from index.html
header_match = re.search(r'(<header id="navbar".*?</header>)', index_content, re.DOTALL)
if header_match:
    correct_header = header_match.group(1)
else:
    print("Could not find header in index.html")
    exit(1)

files_to_update = [
    'check-health.html',
    'physical-health.html',
    'mental-health.html',
    'brain-power.html',
    'internet-addiction.html',
    'vision-mission.html',
    'our-approach.html',
    'our-team.html',
    'research-development.html',
    'academic-progress.html'
]

import os

for filename in files_to_update:
    if not os.path.exists(filename):
        print(f"File {filename} does not exist, skipping.")
        continue
        
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace existing header with correct header
        if '<header id="navbar"' in content:
            new_content = re.sub(r'<header id="navbar".*?</header>', correct_header, content, flags=re.DOTALL)
            
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            print(f"Updated header in {filename}")
        else:
            print(f"No match in {filename}")
    except Exception as e:
        print(f"Error processing {filename}: {e}")
