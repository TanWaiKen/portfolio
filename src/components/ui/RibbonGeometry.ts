import * as THREE from 'three';

/** A reusable solid ribbon, not camera-facing line-shader triangles. */
export class RibbonGeometry extends THREE.BufferGeometry {
  private readonly segments = 48;
  private readonly centerPoint = new THREE.Vector3();
  private readonly tangent = new THREE.Vector3();
  private readonly across = new THREE.Vector3();
  private readonly previousAcross = new THREE.Vector3(1, 0, 0);
  private readonly depth = new THREE.Vector3();
  constructor() {
    super();
    const count = (this.segments + 1) * 4;
    this.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3).setUsage(THREE.DynamicDrawUsage));
    const uv = new Float32Array(count * 2);
    const indices: number[] = [];
    for (let i = 0; i <= this.segments; i++) {
      for (let side = 0; side < 4; side++) {
        uv[(i * 4 + side) * 2] = i / this.segments;
        uv[(i * 4 + side) * 2 + 1] = side === 1 || side === 2 ? 1 : 0;
        if (i < this.segments) {
          const a = i * 4 + side, b = i * 4 + (side + 1) % 4;
          indices.push(a, b, a + 4, b, b + 4, a + 4);
        }
      }
    }
    this.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    this.setIndex(indices);
  }
  update(curve: THREE.CatmullRomCurve3) {
    const position = this.getAttribute('position') as THREE.BufferAttribute;
    this.previousAcross.set(1, 0, 0);
    for (let i = 0; i <= this.segments; i++) {
      const t = i / this.segments;
      curve.getPoint(t, this.centerPoint);
      curve.getTangent(t, this.tangent);
      // Continuous frame for the mostly planar hanging ribbon; safe at depth-facing tangents.
      this.across.set(-this.tangent.y, this.tangent.x, 0);
      if (this.across.lengthSq() < 1e-8) this.across.copy(this.previousAcross);
      this.across.normalize();
      if (this.across.dot(this.previousAcross) < 0) this.across.negate();
      this.previousAcross.copy(this.across);
      this.depth.crossVectors(this.across, this.tangent).normalize();
      for (let side = 0; side < 4; side++) {
        const width = side === 1 || side === 2 ? 0.052 : -0.052;
        const thickness = side < 2 ? 0.006 : -0.006;
        position.setXYZ(i * 4 + side,
          this.centerPoint.x + this.across.x * width + this.depth.x * thickness,
          this.centerPoint.y + this.across.y * width + this.depth.y * thickness,
          this.centerPoint.z + this.across.z * width + this.depth.z * thickness);
      }
    }
    position.needsUpdate = true;
  }
}
