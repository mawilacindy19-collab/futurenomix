import os
import math
import subprocess
import time

def get_donut_path(cx, cy, r_out, r_in, percent):
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

    scroll_y = lerp(0, 180, time_sec / 15.0)

    if theme == 'dark':
        bg = "#415977"
        card_bg = "#32445c"
        text_primary = "#ffffff"
        text_secondary = "#e2e8f0"
        text_muted = "#cbd5e1"
        grid_color = "#556e8d"
        year_badge_bg = "#28374a"
        year_badge_border = "#84cc16"
        year_badge_text = "#84cc16"
        donut_bg = "#4e6785"
        donut_colors = ["#facc15", "#facc15", "#84cc16", "#84cc16", "#d946ef", "#06b6d4"]
        line1_color = "#a3e635"
        line2_color = "#ec4899"
        bar_colors = ["#f59e0b", "#84cc16", "#06b6d4"]
        bar_grey = "#4e6785"
        pill_bg = "#ec4899"
        pct_color = "#84cc16"
        pie_colors = ["#facc15", "#84cc16", "#d946ef", "#06b6d4"]
    else: # light
        bg = "#415977"
        card_bg = "#516c8c"
        text_primary = "#ffffff"
        text_secondary = "#f1f5f9"
        text_muted = "#e2e8f0"
        grid_color = "#637e9e"
        year_badge_bg = "#30435b"
        year_badge_border = "#30435b"
        year_badge_text = "#ffffff"
        donut_bg = "#3a516d"
        donut_colors = ["#38bdf8", "#0284c7", "#38bdf8", "#0284c7", "#38bdf8", "#0284c7"]
        line1_color = "#38bdf8"
        line2_color = "#f43f5e"
        bar_colors = ["#38bdf8", "#2dd4bf", "#818cf8"]
        bar_grey = "#64748b"
        pill_bg = "#38bdf8"
        pct_color = "#ffffff"
        pie_colors = ["#30435b", "#38bdf8", "#7dd3fc", "#e2e8f0"]

    donut_coords = [
        (450, 270), (565, 270),
        (450, 365), (565, 365),
        (450, 460), (565, 460)
    ]

    donuts_svg = []
    for k, (cx, cy) in enumerate(donut_coords):
        val = donuts[k]
        col = donut_colors[k]
        track = f'<circle cx="{cx}" cy="{cy}" r="38" fill="none" stroke="{donut_bg}" stroke-width="12"/>'
        path_d = get_donut_path(cx, cy, 44, 32, val)
        arc = f'<path d="{path_d}" fill="{col}"/>' if path_d else ''
        donuts_svg.append(f'<g>{track}{arc}</g>')

    zigzag_pts = []
    for idx_z, x in enumerate(range(100, 330, 25)):
        y_val = 220 + math.sin(idx_z * 1.3 + time_sec * 0.4) * 35
        zigzag_pts.append(f"{x},{y_val:.1f}")
    zigzag_str = " ".join(zigzag_pts)

    line1_pts = []
    line2_pts = []
    nodes_svg = []
    for step_l in range(7):
        lx = 420 + step_l * 38
        ly1 = 570 - (math.sin(step_l * 0.8 + time_sec * 0.5) * 28 + (step_l * 12 * (donuts[0] / 100.0)))
        ly2 = 590 - (math.cos(step_l * 0.7 + time_sec * 0.4) * 22 + (step_l * 8 * (donuts[0] / 100.0)))
        line1_pts.append(f"{lx},{ly1:.1f}")
        line2_pts.append(f"{lx},{ly2:.1f}")
        nodes_svg.append(f'<circle cx="{lx}" cy="{ly1:.1f}" r="4" fill="{line1_color}"/>')
        nodes_svg.append(f'<circle cx="{lx}" cy="{ly2:.1f}" r="4" fill="{line2_color}"/>')

    bar_cols_svg = []
    for b_i in range(8):
        bx = 220 + b_i * 22
        b_h = 35 + ((b_i * 17) % 55)
        bar_cols_svg.append(f'<rect x="{bx}" y="{820 - b_h}" width="14" height="{b_h}" fill="{bar_grey}" rx="2"/>')

    b1_h = lerp(45, 110, f)
    b2_h = lerp(35, 85, f)
    b3_h = lerp(25, 60, f)

    colored_bars = f'''
    <rect x="420" y="{820 - b1_h}" width="20" height="{b1_h}" fill="{bar_colors[0]}" rx="3"/>
    <rect x="446" y="{820 - b2_h}" width="20" height="{b2_h}" fill="{bar_colors[1]}" rx="3"/>
    <rect x="472" y="{820 - b3_h}" width="20" height="{b3_h}" fill="{bar_colors[2]}" rx="3"/>
    '''

    pie_svg = f'''
    <g transform="translate(620, 880) scale(1, 0.55)">
      <path d="M -60 22 A 60 60 0 0 0 60 22 L 60 0 A 60 60 0 0 1 -60 0 Z" fill="{pie_colors[0]}" opacity="0.6"/>
      <path d="M 0 0 L 0 -60 A 60 60 0 0 1 56 22 Z" fill="{pie_colors[0]}"/>
      <path d="M 0 0 L 56 22 A 60 60 0 0 1 -28 53 Z" fill="{pie_colors[1]}"/>
      <path d="M 0 0 L -28 53 A 60 60 0 0 1 -60 0 Z" fill="{pie_colors[2]}"/>
      <path d="M 0 0 L -60 0 A 60 60 0 0 1 0 -60 Z" fill="{pie_colors[3]}"/>
    </g>
    '''

    svg_str = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="{bg}"/>
      <stop offset="100%" stop-color="{card_bg}"/>
    </linearGradient>
  </defs>

  <rect width="{width}" height="{height}" fill="url(#bgGrad)"/>

  <!-- Tilted Infographic Sheet (Rotated -16 deg with perspective) -->
  <g transform="translate(360, 640) rotate(-16) translate(-400, {-550 - scroll_y})">

    <!-- Grid Lines -->
    <line x1="80" y1="180" x2="720" y2="180" stroke="{grid_color}" stroke-width="0.8" opacity="0.3"/>
    <line x1="80" y1="360" x2="720" y2="360" stroke="{grid_color}" stroke-width="0.8" opacity="0.3"/>
    <line x1="80" y1="540" x2="720" y2="540" stroke="{grid_color}" stroke-width="0.8" opacity="0.3"/>
    <line x1="80" y1="720" x2="720" y2="720" stroke="{grid_color}" stroke-width="0.8" opacity="0.3"/>

    <!-- Left Timeline Badge -->
    <rect x="75" y="160" width="80" height="34" rx="6" fill="{year_badge_bg}" stroke="{year_badge_border}" stroke-width="1.5"/>
    <text x="115" y="183" font-family="system-ui, -apple-system, sans-serif" font-size="17" font-weight="900" fill="{year_badge_text}" text-anchor="middle">{year}</text>

    <!-- Zigzag Chart -->
    <polyline points="{zigzag_str}" fill="none" stroke="{line1_color}" stroke-width="2.5"/>
    <line x1="100" y1="260" x2="320" y2="260" stroke="{grid_color}" stroke-width="1"/>

    <!-- Top Right Column Chart -->
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

    <!-- Lower Line Chart -->
    <polyline points="{" ".join(line1_pts)}" fill="none" stroke="{line1_color}" stroke-width="3"/>
    <polyline points="{" ".join(line2_pts)}" fill="none" stroke="{line2_color}" stroke-width="2.5" stroke-dasharray="4 2"/>
    {"".join(nodes_svg)}

    <!-- Lower Left Bar Charts -->
    {"".join(bar_cols_svg)}
    {colored_bars}

    <!-- Pill Accent Shape -->
    <rect x="420" y="830" width="62" height="22" rx="4" fill="{pill_bg}"/>

    <!-- 3D Pie Chart -->
    {pie_svg}

  </g>
</svg>'''
    return svg_str

def render_video(theme, output_portrait, output_landscape, fps=15, duration=15):
    frames_dir = f"./tmp_frames_{theme}"
    os.makedirs(frames_dir, exist_ok=True)
    total_frames = fps * duration

    print(f"Generating {total_frames} frames for {theme}...")
    for i in range(total_frames):
        t = i / float(fps)
        svg_content = generate_svg(t, theme=theme, width=720, height=1280)
        with open(f"{frames_dir}/frame_{i:04d}.svg", "w") as f:
            f.write(svg_content)

    print(f"Encoding portrait video {output_portrait}...")
    cmd_portrait = [
        "ffmpeg", "-y",
        "-framerate", str(fps),
        "-i", f"{frames_dir}/frame_%04d.svg",
        "-c:v", "libx264",
        "-preset", "fast",
        "-crf", "20",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        output_portrait
    ]
    subprocess.run(cmd_portrait, check=True)

    print(f"Encoding landscape video {output_landscape}...")
    cmd_landscape = [
        "ffmpeg", "-y",
        "-i", output_portrait,
        "-filter_complex",
        "[0:v]scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2:color=#415977[v]",
        "-map", "[v]",
        "-c:v", "libx264",
        "-preset", "fast",
        "-crf", "20",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        output_landscape
    ]
    subprocess.run(cmd_landscape, check=True)

if __name__ == '__main__':
    os.makedirs("./public/videos", exist_ok=True)
    
    # Render Dark Theme
    render_video(
        'dark',
        './public/videos/economic_analytics_dark_portrait.mp4',
        './public/videos/economic_analytics_dark.mp4'
    )
    
    # Render Light Theme
    render_video(
        'light',
        './public/videos/financial_horizon_light_portrait.mp4',
        './public/videos/financial_horizon_light.mp4'
    )

    # Replaced clips:
    # short_video_1.mp4 is Dark mode
    # short_video_2.mp4 is Light mode
    # short_video_3.mp4 is Dark mode portrait
    subprocess.run(["cp", "-f", "./public/videos/economic_analytics_dark.mp4", "./public/videos/short_video_1.mp4"], check=True)
    subprocess.run(["cp", "-f", "./public/videos/financial_horizon_light.mp4", "./public/videos/short_video_2.mp4"], check=True)
    subprocess.run(["cp", "-f", "./public/videos/economic_analytics_dark_portrait.mp4", "./public/videos/short_video_3.mp4"], check=True)

    # Combine both into continuous 30-second hero video (Dark 15s + Light 15s)
    cmd_hero = [
        "ffmpeg", "-y",
        "-i", "./public/videos/economic_analytics_dark.mp4",
        "-i", "./public/videos/financial_horizon_light.mp4",
        "-filter_complex", "[0:v][1:v]concat=n=2:v=1[v]",
        "-map", "[v]",
        "-c:v", "libx264",
        "-preset", "fast",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        "./public/videos/homepage_hero_video.mp4"
    ]
    subprocess.run(cmd_hero, check=True)

    print("ALL INFOGRAPHIC VIDEOS GENERATED SUCCESSFULLY!")
