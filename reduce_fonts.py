import re

def update_css(file_path):
    with open(file_path, 'r') as f:
        content = f.read()

    def repl_font_size(match):
        size = int(match.group(1))
        if 11 <= size <= 17:
            return f"font-size:{size-1}px"
        return match.group(0)

    content = re.sub(r'font-size:\s*(\d+)px', repl_font_size, content)

    def repl_font_shorthand(match):
        prefix = match.group(1) or ''
        size = int(match.group(2))
        suffix = match.group(3)
        if 11 <= size <= 17:
            return f"font:{prefix}{size-1}px{suffix}"
        return match.group(0)

    content = re.sub(r'font:\s*([^;}]*?\s+)?(\d+)px([^;}]*)', repl_font_shorthand, content)

    with open(file_path, 'w') as f:
        f.write(content)

update_css('src/index.css')
