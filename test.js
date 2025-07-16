import { assert } from 'console';
import { computeSHA256, computeProof } from './build.emscripten/sha256.js';
import { createHash } from 'crypto';

const md5 = "fgxiocfglk32lkdcguji032gfdjfgjdfg";
async function sha256() {
    const digest = await computeSHA256(md5);
    console.log(digest);
    return digest;
}

async function proof(hard) {
    const digest = await computeProof(md5, hard);
    console.log(digest);
    return digest;
}

const get_random = function (length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
}
function stdSha256(input) {
    const stdhash = createHash('sha256');
    stdhash.update(input);
    return stdhash.digest('hex')
}
function proofjs(key, hard) {
    const started = ''.padEnd(hard, '0');
    while (1) {
        const stri = get_random(6)
        const stdhash = createHash('sha256');
        stdhash.update(key);
        stdhash.update(stri);
        if (stdhash.digest('hex').startsWith(started)) {
            return stri;
        }
    }
}

async function test() {
    {
        const sha256_1 = await sha256();
        const sha256_2 = await stdSha256(md5)
        assert(sha256_1 === sha256_2, 'SHA256 results should be equal');
    }
    const ddd = proofjs(md5, 5);
    const proof_4 = await proof(5);
    const sha256_1 = await computeSHA256(md5 + proof_4);
    assert(sha256_1.startsWith('0000'), 'SHA256 proof should start with 4 zeros');
}
test()
