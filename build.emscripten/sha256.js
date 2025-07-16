import { TextDecoder } from "util";
import module from "./sha-with-intrinsic.js";

const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()
const _Module = module();

export async function computeSHA256(inputData) {
    // 输入数据转换为 Uint8Array
    const dataArray = textEncoder.encode(inputData); // 或直接使用 Uint8Array
    const dataLen = dataArray.length;

    const Module = await _Module;
    // 分配内存 for 输入数据
    const dataPtr = Module._malloc(dataLen);
    Module.HEAPU8.set(dataArray, dataPtr);

    // 分配内存 for 输出摘要 (SHA256 是 32 字节)
    const dgstPtr = Module._malloc(32);

    // 调用函数
    Module.ccall('mysha256', null, ['number', 'number', 'number'], [dgstPtr, dataPtr, dataLen]);
    // 读取输出
    const resultArray = new Uint8Array(Module.HEAPU8.subarray(dgstPtr, dgstPtr + 32));

    // 释放内存
    Module._free(dataPtr);
    Module._free(dgstPtr);

    // 将结果转换为十六进制字符串（可选）
    const hexDigest = Array.from(resultArray)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

    return hexDigest;
}

export async function computeProof(inputData, hard) {
    // 输入数据转换为 Uint8Array
    const dataArray = textEncoder.encode(inputData); // 或直接使用 Uint8Array
    const dataLen = dataArray.length;

    const Module = await _Module;
    // 分配内存 for 输入数据
    const dataPtr = Module._malloc(dataLen);
    Module.HEAPU8.set(dataArray, dataPtr);

    // 分配内存 for 输出摘要 (SHA256 是 32 字节)
    const dgstPtr = Module._malloc(32);

    // 调用函数
    Module.ccall('Proof', null, ['number', 'number', 'number', 'number'], [dgstPtr, dataPtr, dataLen, hard]);

    let resultArray;
    // 判断一下长度
    for (let i = 0; i < 32; i++) {
        if (Module.HEAPU8[dgstPtr + i] === 0) {
            resultArray = new Uint8Array(Module.HEAPU8.subarray(dgstPtr, dgstPtr + i));
            break;
        }
    }

    // 释放内存
    Module._free(dataPtr);
    Module._free(dgstPtr);

    // digest 转换成字符串
    return textDecoder.decode(resultArray);
}
