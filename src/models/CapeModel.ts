import {
  BoxGeometry,
  DoubleSide,
  Group,
  Mesh,
  MeshStandardMaterial,
  Texture,
} from 'three';

import { setCapeUVs } from './ModelUtils';

export default class CapeModel extends Group {
  readonly cape: Mesh;

  private material: MeshStandardMaterial;

  constructor(
    texture: Texture,
  ) {
    super();

    this.material = new MeshStandardMaterial({
      map: texture,
      side: DoubleSide,
      transparent: false,
      alphaTest: 1e-5
    });

    // +z (front) - inside of cape
    // -z (back) - outside of cape
    const capeBox = new BoxGeometry(10, 16, 1);
    setCapeUVs(capeBox, 0, 0, 10, 16, 1);
    this.cape = new Mesh(capeBox, this.material);

    this.add(this.cape);
  }
}

