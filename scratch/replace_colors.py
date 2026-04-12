import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if there's anything to replace
    if '#D4AF37' not in content and '212,175,55' not in content and '212, 175, 55' not in content and '#B8962E' not in content:
        return

    # Replacements
    content = content.replace('#D4AF37', '#C1A36A')
    content = content.replace('212,175,55', '193,163,106')
    content = content.replace('212, 175, 55', '193, 163, 106')
    
    # Update darker gold #B8962E to #8E7A53
    content = content.replace('#B8962E', '#8E7A53')

    # Ensure background colors of emojis/boxes are more refined, let's just make sure to soften anything "1B3022" (dark green) to something else? 
    # Let's keep it minimal.
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

src_dir = '/home/naolgetu/Cloned webs/orchids-heran-mart-luxury-landing-page/src'

for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith('.ts') or file.endswith('.tsx') or file.endswith('.css'):
            process_file(os.path.join(root, file))

print("Replacement complete.")
