import { assert, time } from 'console';
import { computeSHA256, computeProof } from './build.emscripten/sha256.js';
import { createHash } from 'crypto';

const md5 = "sduq4hxwfgsnh3vhfvntmvcx50lvr51z";
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
    performance.now()
    const proof_4 = await proof(5);
    const sha256_1 = await computeSHA256(md5 + proof_4);
    assert(sha256_1.startsWith('00000'), 'SHA256 proof should start with 5 zeros');
}
await test()


async function profile() {
    // 收集 1000 次执行时间
    const times = [];
    for (let i = 0; i < 100; i++) {
        const start = performance.now();
        await proof(6);  // 调用 proof 函数
        const end = performance.now();
        times.push(end - start);
    }

    // 计算平均时间
    const averageTime = times.reduce((a, b) => a + b, 0) / times.length;

    // 计算中位数
    const sortedTimes = [...times].sort((a, b) => a - b);
    const mid = Math.floor(sortedTimes.length / 2);
    const medianTime = sortedTimes.length % 2 === 0
        ? (sortedTimes[mid - 1] + sortedTimes[mid]) / 2
        : sortedTimes[mid];

    // 计算直方图
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    const numBins = 20;  // bin 数量，可调整
    const binWidth = (maxTime - minTime) / numBins;
    const bins = new Array(numBins).fill(0);

    for (let time of times) {
        let binIndex = Math.floor((time - minTime) / binWidth);
        if (binIndex === numBins) binIndex--;  // 处理最大值边界
        bins[binIndex]++;
    }

    // 输出平均时间、中位数和分布图
    console.log(`平均执行时间: ${averageTime.toFixed(4)} ms`);
    console.log(`中位执行时间: ${medianTime.toFixed(4)} ms`);
    console.log('执行时间分布图 (每个 * 代表约 10 次执行):');
    for (let i = 0; i < numBins; i++) {
        const binStart = minTime + i * binWidth;
        const binEnd = binStart + binWidth;
        const stars = '*'.repeat(Math.round(bins[i] / 10));  // 缩放显示
        console.log(`${binStart.toFixed(2)} - ${binEnd.toFixed(2)} ms: ${stars} (${bins[i]} 次)`);
    }
}
await profile()