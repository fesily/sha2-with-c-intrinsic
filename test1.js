import { computeSHA256, computeProof } from './build.emscripten/sha256.js';

const md5 = "sduq4hxwfgsnh3vhfvntmvcx50lvr51z";


async function proof(hard) {
    const digest = await computeProof(md5, hard);
    console.log(digest);
    return digest;
}
await proof(4);