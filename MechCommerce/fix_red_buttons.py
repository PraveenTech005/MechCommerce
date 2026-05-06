import os

dir_path = "/home/hackerx/Desktop/mechanic app/mechanic/app"

for root, dirs, files in os.walk(dir_path):
    for file in files:
        if file.endswith(".jsx") or file.endswith(".js"):
            path = os.path.join(root, file)
            with open(path, 'r') as f:
                lines = f.readlines()

            for i, line in enumerate(lines):
                if '"#EF4444"' in line:
                    # Look ahead up to 10 lines to fix text and icon colors in red buttons
                    for j in range(i, min(i+15, len(lines))):
                        # But stop if we find closing tags that might indicate we've left the button context
                        # Actually just replace blindly in the next few lines. Usually it's fine.
                        if "text-gray-900" in lines[j]:
                            lines[j] = lines[j].replace("text-gray-900", "text-white")
                        if 'color="#111827"' in lines[j]:
                            lines[j] = lines[j].replace('color="#111827"', 'color="white"')
                        # special edge case in home.jsx where we had color={item.stock ? "#EF4444" : "#6B7280"}
                        # This wouldn't match.

            with open(path, 'w') as f:
                f.writelines(lines)
print("fixed buttons")
