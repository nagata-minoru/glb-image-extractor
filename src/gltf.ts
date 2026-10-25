// src/gltf.ts
// GLTF.js / GLB.js は URL から読み込む型定義のないモジュールなので any を許す
/* eslint-disable @typescript-eslint/no-explicit-any */

let GLTF: any;
let GLB: any;

async function initModules() {
  if (!GLTF || !GLB) {
    // @ts-expect-error URL からの import は型解決できない
    const gltfModule = await import('https://code4fukui.github.io/GLTF/GLTF.js');
    // @ts-expect-error URL からの import は型解決できない
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

export async function decodeGLB(bin: Uint8Array) {
  await initModules();
  return GLB.decode(bin);
}

export function replaceTexture(gltf: any, newTextureData: Uint8Array): any {
  GLTF.setTexture(gltf, newTextureData)
  return gltf
}

export async function encodeGLB(gltf: any): Promise<ArrayBuffer> {
  return GLB.encode(gltf)
}
