import os
import math
import subprocess

def get_3d_arrow_svg(cx, cy, scale=1.0, opacity=0.9, angle_tilt=0):
    """
    Renders a 3D white arrow pointing upwards with perspective, bevels, and drop shadow.
    """
    w = 60 * scale
    h = 90 * scale
    depth = 14 * scale

    # Arrow vertices relative to center
    # Top tip
    tip_x, tip_y = cx, cy - h/2
    # Left barb
    lb_x, lb_y = cx - w/2, cy - h/2 + w*0.7
    # Right barb
    rb_x, rb_y = cx + w/2, cy - h/2 + w*0.7
    # Left inner corner
    li_x, li_y = cx - w*0.22, cy - h/2 + w*0.7
    # Right inner corner
    ri_x, ri_y = cx + w*0.22, cy - h/2 + w*0.7
    # Bottom left stem
    bl_x, bl_y = cx - w*0.22, cy + h/2
    # Bottom right stem
    br_x, br_y = cx + w*0.22, cy + h/2

    front_face = f"M {tip_x:.1f} {tip_y:.1f} L {rb_x:.1f} {rb_y:.1f} L {ri_x:.1f} {ri_y:.1f} L {br_x:.1f} {br_y:.1f} L {bl_x:.1f} {bl_y:.1f} L {li_x:.1f} {li_y:.1f} L {lb_x:.1f} {lb_y:.1f} Z"

    # 3D Depth Extrusion offset (down and right)
    dx = depth * 0.7
    dy = depth * 0.7

    shadow_path = f"M {tip_x+dx*1.4:.1f} {tip_y+dy*1.4:.1f} L {rb_x+dx*1.4:.1f} {rb_y+dy*1.4:.1f} L {ri_x+dx*1.4:.1f} {ri_y+dy*1.4:.1f} L {br_x+dx*1.4:.1f} {br_y+dy*1.4:.1f} L {bl_x+dx*1.4:.1f} {bl_y+dy*1.4:.1f} L {li_x+dx*1.4:.1f} {li_y+dx*1.4:.1f} L {lb_x+dx*1.4:.1f} {lb_y+dx*1.4:.1f} Z"

    # Side extruded facets for right/bottom perspective
    side_right_barb = f"M {tip_x:.1f} {tip_y:.1f} L {tip_x+dx:.1f} {tip_y+dy:.1f} L {rb_x+dx:.1f} {rb_y+dy:.1f} L {rb_x:.1f} {rb_y:.1f} Z"
    side_inner_right = f"M {rb_x:.1f} {rb_y:.1f} L {rb_x+dx:.1f} {rb_y+dy:.1f} L {ri_x+dx:.1f} {ri_y+dy:.1f} L {ri_x:.1f} {ri_y:.1f} Z"
    side_stem_right = f"M {ri_x:.1f} {ri_y:.1f} L {ri_x+dx:.1f} {ri_y+dy:.1f} L {br_x+dx:.1f} {br_y+dy:.1f} L {br_x:.1f} {br_y:.1f} Z"
    side_bottom_stem = f"M {bl_x:.1f} {bl_y:.1f} L {bl_x+dx:.1f} {bl_y+dy:.1f} L {br_x+dx:.1f} {br_y+dy:.1f} L {br_x:.1f} {br_y:.1f} Z"

    svg_arrow = f'''
    <g opacity="{opacity:.2f}">
      <!-- Soft ambient shadow -->
      <path d="{shadow_path}" fill="#1e293b" opacity="0.32" filter="blur(6px)"/>
      <!-- 3D Shaded Side Facets -->
      <path d="{side_right_barb}" fill="#cbd5e1"/>
      <path d="{side_inner_right}" fill="#94a3b8"/>
      <path d="{side_stem_right}" fill="#b8c7d9"/>
      <path d="{side_bottom_stem}" fill="#94a3b8"/>
      <!-- Top Pure White Face -->
      <path d="{front_face}" fill="#ffffff" stroke="#f1f5f9" stroke-width="0.8"/>
    </g>
    '''
    return svg_arrow

ARROWS_CONFIG = [
    # (base_x, base_y_seed, scale, speed, opacity, sway_phase)
    (0.18, 0.20, 1.35, 0.08, 0.95, 0.0),
    (0.48, 0.55, 1.60, 0.09, 0.98, 1.2),
    (0.82, 0.35, 1.25, 0.07, 0.90, 2.4),
    (0.32, 0.85, 0.95, 0.06, 0.75, 3.1),
    (0.68, 0.90, 1.10, 0.07, 0.85, 4.2),
    (0.08, 0.70, 0.75, 0.05, 0.60, 5.0),
    (0.92, 0.75, 0.80, 0.05, 0.65, 1.8),
    (0.38, 0.15, 0.65, 0.04, 0.55, 2.7),
    (0.60, 0.25, 0.70, 0.05, 0.55, 0.8),
]

def generate_frame(time_sec, width=1280, height=720):
    svg_arrows = []
    duration = 15.0

    for (bx, by_seed, sc, spd, op, ph) in ARROWS_CONFIG:
        # Upward rising trajectory with loop wrap
        y_progress = (by_seed - (time_sec * spd)) % 1.2
        # Convert to screen coords (allow arrows to rise smoothly from bottom past top)
        cy = (y_progress - 0.1) * height
        cx = (bx * width) + math.sin(time_sec * 0.8 + ph) * (15 * sc)

        svg_arrows.append(get_3d_arrow_svg(cx, cy, scale=sc, opacity=op))

    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">
  <defs>
    <!-- Soft Blue Gradient Background (HEX #4b6584, RGB rgb(75, 101, 132)) -->
    <linearGradient id="softBlueGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#597799"/>
      <stop offset="50%" stop-color="#4b6584"/>
      <stop offset="100%" stop-color="#3b526d"/>
    </linearGradient>
    <radialGradient id="centerGlow" cx="50%" cy="40%" r="65%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.14"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.12"/>
    </radialGradient>
  </defs>

  <!-- Background Base Gradient -->
  <rect width="{width}" height="{height}" fill="url(#softBlueGrad)"/>
  <rect width="{width}" height="{height}" fill="url(#centerGlow)"/>

  <!-- Subtle Perspective Trajectory Grid -->
  <g opacity="0.08" stroke="#ffffff" stroke-width="0.8">
    <line x1="0" y1="180" x2="{width}" y2="180"/>
    <line x1="0" y1="360" x2="{width}" y2="360"/>
    <line x1="0" y1="540" x2="{width}" y2="540"/>
    <line x1="{width*0.2}" y1="0" x2="{width*0.2}" y2="{height}"/>
    <line x1="{width*0.4}" y1="0" x2="{width*0.4}" y2="{height}"/>
    <line x1="{width*0.6}" y1="0" x2="{width*0.6}" y2="{height}"/>
    <line x1="{width*0.8}" y1="0" x2="{width*0.8}" y2="{height}"/>
  </g>

  <!-- 3D Upward Rising White Arrows Layer -->
  {"".join(svg_arrows)}
</svg>'''
    return svg_content

def render_arrows_video(fps=15, duration=15):
    frames_dir = "./tmp_frames_arrows"
    os.makedirs(frames_dir, exist_ok=True)
    total_frames = fps * duration

    print(f"Generating {total_frames} frames for 3D White Upward Arrows video...")
    for i in range(total_frames):
        t = i / float(fps)
        svg_content = generate_frame(t, width=1280, height=720)
        with open(f"{frames_dir}/frame_{i:04d}.svg", "w") as f:
            f.write(svg_content)

    output_landscape = "./public/videos/upward_arrows_3d.mp4"
    print(f"Encoding landscape 3D arrows video {output_landscape}...")
    cmd_landscape = [
        "ffmpeg", "-y",
        "-framerate", str(fps),
        "-i", f"{frames_dir}/frame_%04d.svg",
        "-c:v", "libx264",
        "-preset", "fast",
        "-crf", "19",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        output_landscape
    ]
    subprocess.run(cmd_landscape, check=True)

    # Also make it available as default homepage_hero_video if desired or preset
    print("3D ARROWS VIDEO GENERATED SUCCESSFULLY!")

if __name__ == '__main__':
    render_arrows_video()
