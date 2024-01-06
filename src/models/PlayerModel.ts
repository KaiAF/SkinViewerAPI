import { Group, NearestFilter, Texture } from "three";
import SkinModel from "./SkinModel";

export default class PlayerModel extends Group {
  constructor(
    texture: Texture,
    slim: boolean,
  ) {
    super();

    texture.magFilter = NearestFilter;
    texture.minFilter = NearestFilter;
    texture.needsUpdate = true;

    const skin = new SkinModel(texture, slim);
    skin.name = "skin";
    skin.position.y = 8;
    this.add(skin);
  }
}
