import os
import shutil
import re
import glob

current_dir = os.path.dirname(os.path.abspath(__file__)) if '__file__' in locals() else os.getcwd()
os.chdir(current_dir)

for d in ['pages', 'css', 'js', 'assets']:
    os.makedirs(d, exist_ok=True)

if os.path.exists('asset') and os.path.isdir('asset'):
    if os.path.exists('assets') and os.path.isdir('assets'):
        for item in os.listdir('asset'):
            shutil.move(os.path.join('asset', item), 'assets')
        os.rmdir('asset')
    else:
        os.rename('asset', 'assets')

if os.path.exists('style.css'):
    shutil.move('style.css', os.path.join('css', 'style.css'))
if os.path.exists('script.js'):
    shutil.move('script.js', os.path.join('js', 'script.js'))

html_files = glob.glob('*.html')
subpages = [f for f in html_files if f != 'index.html']

def update_links(html_content, is_index):
    if is_index:
        html_content = re.sub(r'href="style\.css"', r'href="css/style.css"', html_content)
        html_content = re.sub(r'src="script\.js"', r'src="js/script.js"', html_content)
        html_content = re.sub(r'(src|href)="asset/', r'\1="assets/', html_content)
    else:
        html_content = re.sub(r'href="style\.css"', r'href="../css/style.css"', html_content)
        html_content = re.sub(r'href="css/style\.css"', r'href="../css/style.css"', html_content) # if it was already changed by previous attempts
        
        html_content = re.sub(r'src="script\.js"', r'src="../js/script.js"', html_content)
        html_content = re.sub(r'src="js/script\.js"', r'src="../js/script.js"', html_content)
        
        html_content = re.sub(r'(src|href)="asset/', r'\1="../assets/', html_content)
        html_content = re.sub(r'(src|href)="assets/', r'\1="../assets/', html_content)

    def repl_href(match):
        full_match = match.group(0) # href="..."
        file_part = match.group(1) # something.html
        rest_part = match.group(2) or '' # #hash or empty
        
        if file_part.startswith('http') or full_match.startswith('href="#') or file_part.startswith('mailto:') or file_part.startswith('tel:'):
            return full_match
            
        if is_index:
            if file_part == 'index.html':
                 # might be already updated if ran before?
                 return full_match 
            elif file_part.endswith('.html'):
                # Avoid nesting 'pages/pages/'
                if not file_part.startswith('pages/'):
                    return f'href="pages/{file_part}{rest_part}"'
                return full_match
        else:
            if file_part == 'index.html':
                if not full_match.startswith('href="../'):
                    return f'href="../{file_part}{rest_part}"'
                return full_match
            elif file_part.endswith('.html'):
                # In subpages, links to other subpages stay the same, but wait!
                # If they were already rewritten as pages/something.html?
                # Actually, index.html links them as pages/something.html
                # But subpages to subpages should just be something.html
                if file_part.startswith('pages/'):
                    # Strip it
                    return f'href="{file_part[6:]}{rest_part}"'
                
                return full_match

        return full_match

    html_content = re.sub(r'href="([^"#]*(?:\.html))([^"]*)"', repl_href, html_content)

    return html_content

if 'index.html' in html_files or os.path.exists('index.html'):
    with open('index.html', 'r', encoding='utf-8') as f:
        content = f.read()
    new_content = update_links(content, is_index=True)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Updated index.html")

for page in subpages:
    if os.path.exists(page):
        with open(page, 'r', encoding='utf-8') as f:
            content = f.read()
        new_content = update_links(content, is_index=False)
        new_path = os.path.join('pages', page)
        with open(new_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        os.remove(page)
        print(f"Updated and moved {page} to pages/{page}")
    else:
        # maybe already in pages/?
        page_in_pages = os.path.join('pages', page)
        if os.path.exists(page_in_pages):
            with open(page_in_pages, 'r', encoding='utf-8') as f:
                content = f.read()
            new_content = update_links(content, is_index=False)
            with open(page_in_pages, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {page} internally inside pages/")

print("Restructuring complete.")
