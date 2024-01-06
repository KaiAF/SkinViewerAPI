import {
  BoxGeometry,
  DoubleSide,
  FrontSide,
  Group,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  Texture,
} from 'three';
import { setSkinUVs } from './ModelUtils';

export default class SkinModel extends Group {
  readonly texture: Texture;

  readonly head: Object3D;
  readonly body: Object3D;
  readonly rightArm: Object3D;
  readonly leftArm: Object3D;
  readonly rightLeg: Object3D;
  readonly leftLeg: Object3D;

  private slim: boolean = false;
  private layerMaterialInner: MeshStandardMaterial;
  private layerMaterialOuter: MeshStandardMaterial;

  constructor(
    texture: Texture,
    slim: boolean,
  ) {
    super();
    this.texture = texture;
    this.slim = slim;

    this.layerMaterialInner = new MeshStandardMaterial({
      map: texture,
      side: FrontSide,
      transparent: false,
      toneMapped: false,
    });

    this.layerMaterialOuter = new MeshStandardMaterial({
      map: texture,
      side: DoubleSide,
      transparent: true,
      alphaTest: 1e-5,
      toneMapped: false,
    });

    // Head
    const headBox = new BoxGeometry(8, 8, 8);
    setSkinUVs(headBox, 0, 0, 8, 8, 8);
    const headMesh = new Mesh(headBox, this.layerMaterialInner);

    const head2Box = new BoxGeometry(9, 9, 9);
    setSkinUVs(head2Box, 32, 0, 8, 8, 8);
    const head2Mesh = new Mesh(head2Box, this.layerMaterialOuter);

    this.head = new Object3D();
    this.head.name = "head";
    this.head.add(headMesh, head2Mesh);
    headMesh.position.y = 4;
    head2Mesh.position.y = 4;

    const bodyBox = new BoxGeometry(8, 12, 4);
    setSkinUVs(bodyBox, 16, 16, 8, 12, 4);
    const bodyMesh = new Mesh(bodyBox, this.layerMaterialInner);

    const body2Box = new BoxGeometry(8.5, 12.5, 4.5);
    setSkinUVs(body2Box, 16, 32, 8, 12, 4);
    const body2Mesh = new Mesh(body2Box, this.layerMaterialOuter);

    this.body = new Object3D();
    this.body.name = "body";
    this.body.add(bodyMesh, body2Mesh);
    this.body.position.y = -6;

    // Right Arm
    const rightArmBox = new BoxGeometry();
    const rightArmMesh = new Mesh(rightArmBox, this.layerMaterialInner);
    rightArmMesh.scale.x = this.slim ? 3 : 4;
    rightArmMesh.scale.y = 12;
    rightArmMesh.scale.z = 4;
    setSkinUVs(rightArmBox, 40, 16, this.slim ? 3 : 4, 12, 4);

    const rightArm2Box = new BoxGeometry();
    const rightArm2Mesh = new Mesh(rightArm2Box, this.layerMaterialOuter);
    rightArm2Mesh.scale.x = this.slim ? 3.5 : 4.5;
    rightArm2Mesh.scale.y = 12.5;
    rightArm2Mesh.scale.z = 4.5;
    setSkinUVs(rightArm2Box, 40, 32, this.slim ? 3 : 4, 12, 4);

    const rightArmPivot = new Group();
    rightArmPivot.add(rightArmMesh, rightArm2Mesh);
    rightArmPivot.position.x = this.slim ? -.5 : -1;
    rightArmPivot.position.y = -4;

    this.rightArm = new Object3D();
    this.rightArm.name = "rightArm";
    this.rightArm.add(rightArmPivot);
    this.rightArm.position.x = -5;
    this.rightArm.position.y = -2;

    // Left Arm
    const leftArmBox = new BoxGeometry();
    const leftArmMesh = new Mesh(leftArmBox, this.layerMaterialInner);
    leftArmMesh.scale.x = this.slim ? 3 : 4;
    leftArmMesh.scale.y = 12;
    leftArmMesh.scale.z = 4;
    setSkinUVs(leftArmBox, 32, 48, this.slim ? 3 : 4, 12, 4);

    const leftArm2Box = new BoxGeometry();
    const leftArm2Mesh = new Mesh(leftArm2Box, this.layerMaterialOuter);
    leftArm2Mesh.scale.x = this.slim ? 3.5 : 4.5;
    leftArm2Mesh.scale.y = 12.5;
    leftArm2Mesh.scale.z = 4.5;
    setSkinUVs(leftArm2Box, 48, 48, this.slim ? 3 : 4, 12, 4);

    const leftArmPivot = new Group();
    leftArmPivot.add(leftArmMesh, leftArm2Mesh);
    leftArmPivot.position.x = this.slim ? 0.5 : 1;
    leftArmPivot.position.y = -4;

    this.leftArm = new Object3D();
    this.leftArm.name = "leftArm";
    this.leftArm.add(leftArmPivot);
    this.leftArm.position.x = 5;
    this.leftArm.position.y = -2;

    // Right Leg
    const rightLegBox = new BoxGeometry(4, 12, 4);
    setSkinUVs(rightLegBox, 0, 16, 4, 12, 4);
    const rightLegMesh = new Mesh(rightLegBox, this.layerMaterialInner);

    const rightLeg2Box = new BoxGeometry(4.5, 12.5, 4.5);
    setSkinUVs(rightLeg2Box, 0, 32, 4, 12, 4);
    const rightLeg2Mesh = new Mesh(rightLeg2Box, this.layerMaterialOuter);

    const rightLegPivot = new Group();
    rightLegPivot.add(rightLegMesh, rightLeg2Mesh);
    rightLegPivot.position.y = -6;

    this.rightLeg = new Object3D();
    this.rightLeg.name = "rightLeg";
    this.rightLeg.add(rightLegPivot);
    this.rightLeg.position.x = -1.9;
    this.rightLeg.position.y = -12;
    this.rightLeg.position.z = -.1;

    // Left Leg
    const leftLegBox = new BoxGeometry(4, 12, 4);
    setSkinUVs(leftLegBox, 16, 48, 4, 12, 4);
    const leftLegMesh = new Mesh(leftLegBox, this.layerMaterialInner);

    const leftLeg2Box = new BoxGeometry(4.5, 12.5, 4.5);
    setSkinUVs(leftLeg2Box, 0, 48, 4, 12, 4);
    const leftLeg2Mesh = new Mesh(leftLeg2Box, this.layerMaterialOuter);

    const leftLegPivot = new Group();
    leftLegPivot.add(leftLegMesh, leftLeg2Mesh);
    leftLegPivot.position.y = -6;

    this.leftLeg = new Object3D();
    this.leftLeg.name = "leftLeg";
    this.leftLeg.add(leftLegPivot);
    this.leftLeg.position.x = 1.9;
    this.leftLeg.position.y = -12;
    this.leftLeg.position.z = -.1;

    // add model
    this.add(this.head);
    this.add(this.body);
    this.add(this.rightArm);
    this.add(this.leftArm);
    this.add(this.rightLeg);
    this.add(this.leftLeg);
  }
}