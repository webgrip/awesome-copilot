---
name: nano-banana-pro-openrouter
description: Generate or edit images via OpenRouter using openai-python with the Gemini 3 Pro Image model. Use for prompt-only image generation, image edits, and multi-image compositing; supports 1K/2K/4K output, saves results to the current working directory, and prints MEDIA lines.
metadata:
  emoji: 🍌
  requires:
    bins:
      - uv
    env:
      - OPENROUTER_API_KEY
  primaryEnv: OPENROUTER_API_KEY
---

# Nano Banana Pro OpenRouter

## Overview

Generate or edit images with OpenRouter using the `google/gemini-3-pro-image-preview` model and the openai-python client. Support prompt-only generation, single-image edits, and multi-image composition. Save results to the current working directory and output MEDIA lines for easy attachment.

### Prompt-only generation

```
uv run {baseDir}/scripts/generate_image.py \
  --prompt "A cinematic sunset over snow-capped mountains" \
  --filename sunset.png
```

### Edit a single image

```
uv run {baseDir}/scripts/generate_image.py \
  --prompt "Replace the sky with a dramatic aurora" \
  --input-image input.jpg \
  --filename aurora.png
```

### Compose multiple images

```
uv run {baseDir}/scripts/generate_image.py \
  --prompt "Combine the subjects into a single studio portrait" \
  --input-image face1.jpg \
  --input-image face2.jpg \
  --filename composite.png
```

## Resolution

- Use `--resolution` with `1K`, `2K`, or `4K`.
- Default is `1K` if not specified.

## System prompt customization

The skill reads an optional system prompt from `assets/SYSTEM_TEMPLATE`. This allows you to customize the image generation behavior without modifying code.

## Behavior and constraints

- Read the API key from `OPENROUTER_API_KEY` (no CLI flag).
- Accept up to 3 input images via repeated `--input-image`.
- Save output in the current working directory. If multiple images are returned, append `-1`, `-2`, etc.
- Print `MEDIA: <path>` for each saved image. Do not read images back into the response.