import module from "./sha-with-intrinsic.js";

const textDecoder = new TextDecoder()
const _Module = module();

/** @param {string} inputData  */
export async function computeSHA256(inputData) {
    const Module = await _Module;

    // 分配内存 for 输出摘要 (SHA256 是 32 字节)
    const dgstPtr = Module._malloc(32);

    // 调用函数
    Module.ccall('mysha256', null, ['number', 'string', 'number'], [dgstPtr, inputData, inputData.length]);
    // 读取输出
    const resultArray = new Uint8Array(Module.HEAPU8.subarray(dgstPtr, dgstPtr + 32));

    // 释放内存
    Module._free(dgstPtr);

    // 将结果转换为十六进制字符串（可选）
    const hexDigest = Array.from(resultArray)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

    return hexDigest;
}

/** @param {string} inputData  */
export async function computeProof(inputData, hard) {
    
    const Module = await _Module;

    // 分配内存 for 输出摘要 (SHA256 是 32 字节)
    const dgstPtr = Module._malloc(32);

    // 调用函数
    Module.ccall('Proof', null, ['number', 'string', 'number', 'number'], [dgstPtr, inputData, inputData.length, hard]);

    let resultArray;
    // 判断一下长度
    for (let i = 0; i < 32; i++) {
        if (Module.HEAPU8[dgstPtr + i] === 0) {
            resultArray = new Uint8Array(Module.HEAPU8.subarray(dgstPtr, dgstPtr + i));
            break;
        }
    }

    Module._free(dgstPtr);

    // digest 转换成字符串
    return textDecoder.decode(resultArray);
}
