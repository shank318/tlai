import re

def update_css(file_path):
    with open(file_path, 'r') as f:
        content = f.read()

    # Increase font-size: Xpx
    def repl_font_size(match):
        size = int(match.group(1))
        if 8 <= size <= 14:
            return f"font-size:{size+2}px"
        return match.group(0)
        
    content = re.sub(r'font-size:\s*(\d+)px', repl_font_size, content)
    
    # Increase font: ... Xpx/Y ...
    def repl_font_shorthand(match):
        prefix = match.group(1) or ''
        size = int(match.group(2))
        suffix = match.group(3)
        if 8 <= size <= 14:
            return f"font:{prefix}{size+2}px{suffix}"
        return match.group(0)
    
    # Match patterns like `font:500 13px/1.6 'DM Mono',monospace`
    # and `font:400 11px 'DM Mono',monospace`
    content = re.sub(r'font:\s*([^;}]*?\s+)?(\d+)px([^;}]*)', repl_font_shorthand, content)

    # Some fonts might be defined as `font: 11px DM Mono;`
    
    with open(file_path, 'w') as f:
        f.write(content)

update_css('src/index.css')
