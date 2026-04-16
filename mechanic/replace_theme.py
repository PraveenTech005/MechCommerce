import os
import re

dir_path = "/home/hackerx/Desktop/mechanic app/mechanic/app"
context_path = "/home/hackerx/Desktop/mechanic app/mechanic/context"

replacements = [
    (r'#111827', r'#F9FAFB'), # Main background
    (r'#1F2937', r'#FFFFFF'), # Card background
    (r'#374151', r'#F3F4F6'), # Input background / subtle bg
    (r'color:\s*"#9CA3AF"', r'color: "#6B7280"'), # Secondary text
    (r'color="#9CA3AF"', r'color="#6B7280"'), # Icon color
    (r'placeholderTextColor="#6B7280"', r'placeholderTextColor="#9CA3AF"'),
    (r'color="white"', r'color="#111827"'), # General icons
    (r'color:\s*"white"', r'color: "#111827"'), 
    (r'borderTopColor:\s*"#1F2937"', r'borderTopColor: "#E5E7EB"'), 
    (r'borderColor:\s*"#374151"', r'borderColor: "#E5E7EB"'),
    (r'borderColor:\s*"#1F2937"', r'borderColor: "#E5E7EB"'),
]

for root, dirs, files in os.walk(dir_path):
    for file in files:
        if file.endswith(".jsx") or file.endswith(".js"):
            path = os.path.join(root, file)
            with open(path, 'r') as f:
                content = f.read()

            # Handle text colors specifically
            # We want to change text-white to text-gray-900, but keep text-white for buttons (red background usually)
            # Actually, `text-white` on a transparent or dark background should become `text-gray-900`
            # Let's replace 'text-white' -> 'text-gray-900' universally, then we'll fix up the button texts.
            # Buttons are often 'bg-red-500' or style={{backgroundColor: '#EF4444'}}
            # Wait, #EF4444 text was usually white.
            content = content.replace("text-white", "text-gray-900")
            content = content.replace("text-gray-400", "text-gray-500")

            for old, new in replacements:
                content = re.sub(old, new, content)
            
            with open(path, 'w') as f:
                f.write(content)
print("done")
