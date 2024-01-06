# 3D Rendering in NodeJS

This is a project designed to open source the way that some websites (specifically, NameMC.com, Laby.net and LivzMC.net) render 3d models through a web api.
Looking at their headers, they use ExpressJS which is a way to create websites through NodeJS.
I would not recommend you to simply fork and run this on a production server! It is missing basic caching and does not use Mojang's API to get skin data.

This is a project to learn and possibly use, but expect it to be buggy.
It is also missing how to run GLTF models which probably is easier to deal with, and will allow you to create custom models through Blockbench. Eventually, I plan to add support for them, but not now.

## Known Issues

- This is missing the models for Minecraft capes.
- The gamma seems too high, making the texture look too gray.

### Sort of based off of

This project is sort of based off of the open source project called "[skinview3d](https://github.com/bs-community/skinview3d)" which allows you to have a skin viewer on the client.

Looking in [ModelUtils.ts](/src/models/ModelUtils.ts) you can see I copy pasted the setUVs function from them. And I changed slightly but mostly copy pasted how the skin is modeled, read [SkinModel.ts](/src/models/SkinModel.ts).
