# Avatar appearance assets

Created with the built-in image-generation tool using the user-supplied photo as the likeness reference. The original photograph is not included in the project.

- `public/images/myavatar.png`: illustrated fallback portrait.
- `public/models/textures/bharadwaj-head.png`: replacement head albedo map.
- `public/models/textures/bharadwaj-outfit.png`: replacement clothing albedo map.

The original GLB, skeleton, and skin weights are retained. Avatar.jsx applies the maps, removes the original quiff, and adjusts glasses, fabric, shoe and skin materials. The animated character remains a stylized approximation of the reference, not a scan or a newly modelled suit.

## Portrait prompt summary

Use the user’s supplied photo as the identity reference and the existing portrait as the stylized 3D reference. Create a smiling chest-up portrait with warm dark brown skin, very short receding dark hair, a full short black beard and moustache, thin metallic rectangular glasses, a charcoal suit, white collar, and dark tie. Use a dark olive studio background, with no other people, text, or watermark.

## Final head texture prompt

Use case: precise-object-edit. Asset type: square diffuse/albedo UV texture for an existing animated 3D head. Image 1 is the EDIT TARGET, a flat unwrapped head texture. Image 2 is the identity reference: use the central man in the charcoal suit. Repaint only the texture colors and facial hair to resemble him: warm deep brown skin, full short BLACK beard and connected black moustache, black eyebrows, short nearly shaved receding black hair. Keep the exact UV layout and exact relative positions, sizes, silhouette, and alignment of every feature and island from image 1: eye sockets, nostrils, lips, ear islands, jaw/beard boundary, neck, bottom-left mouth island. Do not warp, rearrange, crop, zoom or recenter. Keep lips CLOSED as on the original UV map; the rig will animate the smile. No glasses painted into the texture: the model already has glasses geometry. Hair: subtle very short black stubble across the top scalp region, with a receding hairline high above the forehead. Render the result as the same flat square UV texture, NOT a head portrait, not a 3D render, not a photograph. Uniform diffuse lighting, no directional shadows. Preserve edge colors/seams and UV islands, especially eyes at roughly 41%/59% across and 31% down, nose 50% across/42% down, mouth 50% across/48% down. No text or watermarks.

## Final outfit texture prompt

Use case: precise-object-edit. Asset type: square diffuse UV clothing texture for an existing rigged 3D character. Image 1 is the EDIT TARGET, a flat square unwrapped shirt and tie texture. Image 2 is the clothing reference (central man). Repaint image 1 to match the man's charcoal gray formal outfit: very dark charcoal gray fabric with subtle woven texture, crisp white collar where the original collar lies, dark near-black tie. The mesh cannot change so prioritize believable dark formal fabric and an elegant matching tie; do not invent a new garment UV arrangement. Preserve EXACTLY all original UV island shapes, positions, boundaries and seams, every fold, collar boundary, tie silhouette, and center/edge layout. Change only fabric color and finish. The black center island MUST stay a black tie. Do not draw a whole suit, do not add a person or face, do not render a garment mockup. Output exactly one flat square UV texture with edge alignment identical to image 1. No lighting effects, no text or watermarks.

