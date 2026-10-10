import os
import math

def get_donut_path(cx, cy, r_out, r_in, percent):
    # Arc from -90 deg (top) clockwise by percent * 360
    if percent <= 0:
        return ""
    if percent >= 100:
        percent = 99.99
    
    angle = (percent / 100.0) * 2 * math.pi
    start_angle = -math.pi / 2
    end_angle = start_angle + angle

    x1_out = cx + r_out * math.cos(start_angle)
    y1_out = cy + r_out * math.sin(start_angle)
    x2_out = cx + r_out * math.cos(end_angle)
    y2_out = cy + r_out * math.sin(end_angle)

    x1_in = cx + r_in * math.cos(start_angle)
    y1_in = cy + r_in * math.sin(start_angle)
    x2_in = cx + r_in * math.cos(end_angle)
    y2_in = cy + r_in * math.sin(end_angle)

    large_arc = 1 if percent > 50 else 0

    return (f"M {x1_out:.2f} {y1_out:.2f} "
            f"A {r_out} {r_out} 0 {large_arc} 1 {x2_out:.2f} {y2_out:.2f} "
            f"L {x2_in:.2f} {y2_in:.2f} "
            f"A {r_in} {r_in} 0 {large_arc} 0 {x1_in:.2f} {y1_in:.2f} Z")

# Years and metrics
YEARS = [1967, 1971, 1976, 1980, 1984, 1989, 1993, 1997, 2002, 2006, 2010, 2015, 2019, 2023, 2028]
DONUTS = [
    [1, 1, 2, 2, 3, 3],
    [4, 2, 7, 5, 10, 8],
    [6, 4, 12, 8, 16, 14],
    [8, 5, 17, 12, 23, 20],
    [11, 7, 21, 15, 30, 25],
    [13, 8, 26, 19, 37, 31],
    [16, 10, 31, 22, 43, 37],
    [18, 11, 36, 25, 50, 43],
    [20, 12, 41, 29, 57, 48],
    [23, 14, 46, 32, 63, 54],
    [25, 15, 50, 36, 70, 60],
    [28, 17, 55, 39, 77, 65],
    [30, 18, 60, 42, 83, 71],
    [32, 20, 65, 46, 90, 77],
    [35, 21, 70, 49, 97, 82]
]
DOLLARS = ["$1150", "$1150", "$1280", "$1450", "$1750", "$2100", "$2600", "$3200", "$3850", "$4418", "$4558", "$4703", "$4848", "$4993", "$5138"]
BIG_PCT = ["2%", "7%", "12%", "17%", "21%", "22%", "17%", "12%", "7%", "3%", "2%", "3%", "2%", "2%", "2%"]
BAR_VALS = [
    [56850, 47493, 27820],
    [121150, 101182, 33986],
    [186250, 152148, 37331],
    [251350, 204150, 42016],
    [316450, 255640, 46731],
    [381550, 307125, 51446],
    [446450, 358614, 56161],
    [511550, 410103, 60876],
    [576650, 461592, 65592],
    [641750, 513081, 70307],
    [707000, 564550, 75000],
    [772150, 616039, 79737],
    [837250, 667528, 84452],
    [902350, 719017, 89167],
    [967450, 770506, 93882]
]
TOP_BAR_NUMS = [1852, 1893, 1914, 1936, 1957, 1978, 2000, 2021, 2042, 2064, 2085, 2107, 2128, 2149, 2170]

def lerp(a, b, t):
    return a + (b - a) * t

def generate_svg(time_sec, theme='dark', width=720, height=1280):
    # Total duration 15 seconds (0 to 14.99)
    idx_float = max(0.0, min(13.999, time_sec / 15.0 * 14.0))
    i0 = int(idx_float)
    i1 = min(14, i0 + 1)
    f = idx_float - i0

    year = int(lerp(YEARS[i0], YEARS[i1], f))
    donuts = [lerp(DONUTS[i0][k], DONUTS[i1][k], f) for k in range(6)]
    dollar = DOLLARS[i0]
    pct = BIG_PCT[i0]
    bars = [int(lerp(BAR_VALS[i0][k], BAR_VALS[i1][k], f)) for k in range(3)]
    top_num = int(lerp(TOP_BAR_NUMS[i0], TOP_BAR_NUMS[i1], f))

    # Scroll offset: scrolls upwards smoothly
    scroll_y = lerp(0, 110, time_sec / 15.0)

    # Color themes
    if theme == 'dark':
        bg = "#181b22"
        card_bg = "#1f242d"
        text_primary = "#ffffff"
        text_secondary = "#94a3b8"
        text_muted = "#64748b"
        grid_color = "#334155"
        year_badge_bg = "#0f172a"
        year_badge_border = "#84cc16"
        year_badge_text = "#84cc16"
        # Donut colors
        donut_bg = "#27303f"
        donut_colors = ["#facc15", "#facc15", "#84cc16", "#84cc16", "#d946ef", "#06b6d4"]
        # Line graph
        line1_color = "#a3e635"
        line2_color = "#ec4899"
        # Bars
        bar_colors = ["#ec4899", "#84cc16", "#06b6d4"]
        bar_grey = "#334155"
        pill_bg = "#ec4899"
        pie_colors = ["#facc15", "#84cc16", "#d946ef", "#06b6d4"]
    else: # light
        bg = "#e6edf3"
        card_bg = "#ffffff"
        text_primary = "#0f172a"
        text_secondary = "#334155"
        text_muted = "#64748b"
        grid_color = "#cbd5e1"
        year_badge_bg = "#0f233a"
        year_badge_border = "#0f233a"
        year_badge_text = "#ffffff"
        # Donut colors
        donut_bg = "#d6e2ed"
        donut_colors = ["#0284c7", "#0369a1", "#0284c7", "#0369a1", "#0369a1", "#0284c7"]
        # Line graph
        line1_color = "#0284c7"
        line2_color = "#0f233a"
        # Bars
        bar_colors = ["#0284c7", "#0f766e", "#0e7490"]
        bar_grey = "#94a3b8"
        pill_bg = "#0284c7"
        pie_colors = ["#0f233a", "#0284c7", "#38bdf8", "#64748b"]

    # Donut center coordinates
    # Grid of 2 cols x 3 rows
    # Col 1: cx=440, Col 2: cx=560
    # Row 1: cy=280, Row 2: cy=370, Row 3: cy=460
    donut_coords = [
        (450, 270), (560, 270),
        (450, 360), (560, 360),
        (450, 450), (560, 450)
    ]

    donuts_svg = []
    for k, (cx, cy) in enumerate(donut_coords):
        val = donuts[k]
        col = donut_colors[k]
        # background ring
        track = f'<circle cx="{cx}" cy="{cy}" r="38" fill="none" stroke="{donut_bg}" stroke-width="12"/>'
        # progress arc
        path_d = get_donut_path(cx, cy, 44, 32, val)
        arc = f'<path d="{path_d}" fill="{col}"/>' if path_d else ''
        txt = f'<text x="{cx}" y="{cy + 6}" font-family="system-ui, -apple-system, sans-serif" font-size="19" font-weight="800" fill="{text_primary}" text-anchor="middle">{int(round(val))}%</text>'
        donuts_svg.append(f'<g>{track}{arc}{txt}</g>')

    # Zigzag chart on left
    zigzag_pts = []
    for idx_z, x in enumerate(range(100, 320, 25)):
        y_val = 220 + math.sin(idx_z * 1.3 + time_sec * 0.4) * 35
        zigzag_pts.append(f"{x},{y_val:.1f}")
    zigzag_str = " ".join(zigzag_pts)

    # Line series under donuts
    line1_pts = []
    line2_pts = []
    nodes_svg = []
    for step_l in range(7):
        lx = 420 + step_l * 38
        ly1 = 570 - (math.sin(step_l * 0.8 + time_sec * 0.5) * 28 + (step_l * 12 * (val / 100.0)))
        ly2 = 590 - (math.cos(step_l * 0.7 + time_sec * 0.4) * 22 + (step_l * 8 * (val / 100.0)))
        line1_pts.append(f"{lx},{ly1:.1f}")
        line2_pts.append(f"{lx},{ly2:.1f}")
        nodes_svg.append(f'<circle cx="{lx}" cy="{ly1:.1f}" r="4" fill="{line1_color}"/>')
        nodes_svg.append(f'<circle cx="{lx}" cy="{ly2:.1f}" r="4" fill="{line2_color}"/>')

    # Bar chart columns left
    bar_cols_svg = []
    for b_i in range(8):
        bx = 220 + b_i * 22
        b_h = 35 + ((b_i * 17) % 55)
        bar_cols_svg.append(f'<rect x="{bx}" y="{820 - b_h}" width="14" height="{b_h}" fill="{bar_grey}" rx="2"/>')
        bar_cols_svg.append(f'<text x="{bx+7}" y="{812 - b_h}" font-size="10" fill="{text_muted}" text-anchor="middle font-family="system-ui">{b_h}</text>')

    # 3 colored main bars
    b1_h = lerp(45, 110, f)
    b2_h = lerp(35, 85, f)
    b3_h = lerp(25, 60, f)

    colored_bars = f'''
    <rect x="420" y="{820 - b1_h}" width="20" height="{b1_h}" fill="{bar_colors[0]}" rx="3"/>
    <text x="430" y="{812 - b1_h}" font-size="10" font-weight="700" fill="{bar_colors[0]}" text-anchor="middle" font-family="system-ui">{bars[0]}</text>
    <rect x="446" y="{820 - b2_h}" width="20" height="{b2_h}" fill="{bar_colors[1]}" rx="3"/>
    <text x="456" y="{812 - b2_h}" font-size="10" font-weight="700" fill="{bar_colors[1]}" text-anchor="middle" font-family="system-ui">{bars[1]}</text>
    <rect x="472" y="{820 - b3_h}" width="20" height="{b3_h}" fill="{bar_colors[2]}" rx="3"/>
    <text x="482" y="{812 - b3_h}" font-size="10" font-weight="700" fill="{bar_colors[2]}" text-anchor="middle" font-family="system-ui">{bars[2]}</text>
    '''

    # Isometric 3D Pie Chart at bottom right
    pie_svg = f'''
    <g transform="translate(620, 880) scale(1, 0.55)">
      <!-- 3D base extrusion -->
      <path d="M -60 20 A 60 60 0 0 0 60 20 L 60 0 A 60 60 0 0 1 -60 0 Z" fill="{pie_colors[0]}" opacity="0.6"/>
      <!-- Top Slices -->
      <path d="M 0 0 L 0 -60 A 60 60 0 0 1 56 22 Z" fill="{pie_colors[0]}"/>
      <path d="M 0 0 L 56 22 A 60 60 0 0 1 -28 53 Z" fill="{pie_colors[1]}"/>
      <path d="M 0 0 L -28 53 A 60 60 0 0 1 -60 0 Z" fill="{pie_colors[2]}"/>
      <path d="M 0 0 L -60 0 A 60 60 0 0 1 0 -60 Z" fill="{pie_colors[3]}"/>
    </g>
    '''

    # SVG assembly with isometric tilt
    svg_str = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="{bg}"/>
      <stop offset="100%" stop-color="{card_bg}"/>
    </linearGradient>
  </defs>

  <!-- Background Canvas -->
  <rect width="{width}" height="{height}" fill="url(#bgGrad)"/>

  <!-- Tilted Infographic Sheet (Rotated -16 deg with perspective) -->
  <g transform="translate(360, 640) rotate(-16) translate(-400, {-550 - scroll_y})">

    <!-- Subtle Grid Lines -->
    <line x1="80" y1="180" x2="720" y2="180" stroke="{grid_color}" stroke-width="0.8" opacity="0.4"/>
    <line x1="80" y1="360" x2="720" y2="360" stroke="{grid_color}" stroke-width="0.8" opacity="0.4"/>
    <line x1="80" y1="540" x2="720" y2="540" stroke="{grid_color}" stroke-width="0.8" opacity="0.4"/>
    <line x1="80" y1="720" x2="720" y2="720" stroke="{grid_color}" stroke-width="0.8" opacity="0.4"/>

    <!-- Left Timeline Badge -->
    <rect x="75" y="160" width="80" height="34" rx="6" fill="{year_badge_bg}" stroke="{year_badge_border}" stroke-width="1.5"/>
    <text x="115" y="183" font-family="system-ui, -apple-system, sans-serif" font-size="17" font-weight="900" fill="{year_badge_text}" text-anchor="middle">{year}</text>

    <!-- Zigzag Chart -->
    <polyline points="{zigzag_str}" fill="none" stroke="{line1_color}" stroke-width="2.5"/>
    <line x1="100" y1="260" x2="320" y2="260" stroke="{grid_color}" stroke-width="1"/>

    <!-- Editorial Text Block 1 (Beside Year) -->
    <text x="175" y="172" font-family="system-ui, sans-serif" font-size="8.5" fill="{text_secondary}" opacity="0.85">Market exchange rate aggregations for emerging and developing economies</text>
    <text x="175" y="184" font-family="system-ui, sans-serif" font-size="8.5" fill="{text_secondary}" opacity="0.85">Consumer prices computed on weighted index basis (1967-2028 World Economic Series)</text>

    <!-- Top Right Column Chart & Metric -->
    <text x="590" y="145" font-family="system-ui, sans-serif" font-size="18" font-weight="800" fill="{text_primary}">{top_num}</text>
    <g transform="translate(560, 155)">
      <rect x="0" y="0" width="6" height="40" fill="{bar_colors[1]}" rx="2"/>
      <rect x="10" y="10" width="6" height="30" fill="{bar_colors[0]}" rx="2"/>
      <rect x="20" y="5" width="6" height="35" fill="{bar_colors[2]}" rx="2"/>
      <rect x="30" y="15" width="6" height="25" fill="{bar_grey}" rx="2"/>
    </g>

    <!-- Top Right Squircle Topic Badges -->
    <g transform="translate(635, 140)">
      <rect x="0" y="0" width="22" height="22" rx="5" fill="{bar_colors[1]}" opacity="0.85"/>
      <rect x="26" y="0" width="22" height="22" rx="5" fill="{bar_colors[0]}" opacity="0.85"/>
      <rect x="52" y="0" width="22" height="22" rx="5" fill="{bar_colors[2]}" opacity="0.85"/>
    </g>

    <!-- 6 Radial Donut Charts -->
    {"".join(donuts_svg)}

    <!-- Editorial Paragraph beside Donuts -->
    <g transform="translate(640, 260)">
      <text x="0" y="0" font-family="system-ui, sans-serif" font-size="9" fill="{text_secondary}" font-weight="600">RTGS &amp; Currency Framework</text>
      <text x="0" y="14" font-family="system-ui, sans-serif" font-size="8" fill="{text_muted}">Redenominated conversion</text>
      <text x="0" y="26" font-family="system-ui, sans-serif" font-size="8" fill="{text_muted}">factor applied for local parity</text>
      <text x="0" y="44" font-family="system-ui, sans-serif" font-size="9" fill="{text_secondary}" font-weight="600">Macro Debt Sustainability</text>
      <text x="0" y="58" font-family="system-ui, sans-serif" font-size="8" fill="{text_muted}">Building fiscal buffers</text>
      <text x="0" y="70" font-family="system-ui, sans-serif" font-size="8" fill="{text_muted}">against international shocks</text>
    </g>

    <!-- Lower Line Chart -->
    <polyline points="{" ".join(line1_pts)}" fill="none" stroke="{line1_color}" stroke-width="3"/>
    <polyline points="{" ".join(line2_pts)}" fill="none" stroke="{line2_color}" stroke-width="2.5" stroke-dasharray="4 2"/>
    {"".join(nodes_svg)}

    <!-- Lower Left Bar Charts -->
    {"".join(bar_cols_svg)}
    {colored_bars}

    <!-- Dollar Pill & Big Percentage -->
    <rect x="420" y="830" width="62" height="22" rx="4" fill="{pill_bg}"/>
    <text x="451" y="845" font-family="system-ui, sans-serif" font-size="12" font-weight="800" fill="#ffffff" text-anchor="middle">{dollar}</text>

    <text x="360" y="855" font-family="system-ui, sans-serif" font-size="44" font-weight="900" fill="{text_primary}">{pct}</text>

    <!-- 3D Pie Chart -->
    {pie_svg}

    <!-- Bottom Contextual Report Notes -->
    <g transform="translate(200, 920)">
      <text x="0" y="0" font-family="system-ui, sans-serif" font-size="8" fill="{text_muted}">Due to high levels of prevailing public debt, policy makers need to rebuild fiscal resilience</text>
      <text x="0" y="12" font-family="system-ui, sans-serif" font-size="8" fill="{text_muted}">when economic risks are low and debt is high. Fiscal buffers should be rebuilt to respond</text>
      <text x="0" y="24" font-family="system-ui, sans-serif" font-size="8" fill="{text_muted}">to adverse shocks and ensure sustainability across emerging market economies.</text>
    </g>

  </g>
</svg>'''
    return svg_str

if __name__ == '__main__':
    with open('/tmp/test_dark.svg', 'w') as f:
        f.write(generate_svg(0, 'dark'))
    with open('/tmp/test_light.svg', 'w') as f:
        f.write(generate_svg(0, 'light'))
    print("Test SVGs written successfully")
