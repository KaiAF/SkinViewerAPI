import { Group, NearestFilter, Texture } from "three";
import { ModelOptions, degrees_to_radians } from "./ModelUtils";
import SkinModel from "./SkinModel";
import CapeModel from "./CapeModel";

export default class PlayerModel extends Group {
  constructor(
    texture: Texture,
    capeTexture: Texture | null,
    modelOptions: ModelOptions,
  ) {
    super();

    texture.magFilter = NearestFilter;
    texture.minFilter = NearestFilter;
    texture.needsUpdate = true;

    const skin = new SkinModel(texture, modelOptions.slim);
    skin.name = "skin";
    skin.position.y = 8;
    this.add(skin);
    if (modelOptions.backwards) {
      skin.rotation.y += degrees_to_radians(180);
    }

    if (capeTexture) {
      capeTexture.magFilter = NearestFilter;
      capeTexture.minFilter = NearestFilter;
      capeTexture.needsUpdate = true;
      const cape = new CapeModel(capeTexture);
      cape.name = "cape";
      if (modelOptions.backwards) {
        cape.position.z += 3;
      } else {
        cape.position.z -= 3; // it's either 2 or 3
        cape.rotation.x += degrees_to_radians(180);
      }

      this.add(cape);
    }
  }
}
