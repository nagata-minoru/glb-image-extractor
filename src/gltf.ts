// src/gltf.ts

let GLTF: any;
let GLB: any;

async function initModules() {
  if (!GLTF || !GLB) {
    // @ts-ignore
    const gltfModule = await import('https://code4fukui.github.io/GLTF/GLTF.js');
    // @ts-ignore
    const glbModule = await import('https://code4fukui.github.io/GLTF/GLB.js');
    GLTF = gltfModule.GLTF;
    GLB = glbModule.GLB;
  }
}

export async function parseGLTF(bin: ArrayBuffer) {
  await initModules();
  return GLTF.parse(bin);
}

export async function getTextureGLTF(gltf: any) {
  await initModules();
  return GLTF.getTexture(gltf);
}

export async function decodeGLB(bin: ArrayBuffer) {
  await initModules();
  return GLB.decode(bin);
}

export function replaceTexture(gltf: any, newTextureData: Uint8Array): any {
  GLTF.setTexture(gltf, newTextureData)
  return gltf
}

export async function encodeGLB(gltf: any): Promise<ArrayBuffer> {
  return new Promise(async resolve => resolve(await GLB.encode(gltf)))
}
