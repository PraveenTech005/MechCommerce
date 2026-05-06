import os

dir_path = "/home/hackerx/Desktop/mechanic app/mechanic/app"

for root, dirs, files in os.walk(dir_path):
    for file in files:
        if file.endswith(".jsx") or file.endswith(".js"):
            path = os.path.join(root, file)
            with open(path, 'r') as f:
                content = f.read()

            content = content.replace('text-white', 'text-gray-900')
            content = content.replace('color="white"', 'color="#111827"')

            lines = content.split('\n')

            for i in range(len(lines)):
                if 'backgroundColor: "#EF4444"' in lines[i]:
                    for j in range(i, min(i+8, len(lines))):
                        # Avoid changing if we hit a sibling or weird element
                        if "text-gray-900" in lines[j]:
                            lines[j] = lines[j].replace("text-gray-900", "text-white")
                        if 'color="#111827"' in lines[j]:
                            lines[j] = lines[j].replace('color="#111827"', 'color="white"')

            with open(path, 'w') as f:
                f.write('\n'.join(lines))

print("done finale")
