import * as constants from "./constants.js"

// Converts plain object structure into protobuf object
export function objectToProtoObj(typeName, plainObject, protobufjs) {
    var type = protobufjs.lookupType(typeName);
    let errMsg = type.verify(plainObject);
    if (errMsg) {
        throw new Error('Error in meshtasticjs.objectToProtoObj:' + e.message);
    }
    return type.fromObject(plainObject);
}


export function bufferToHex(arrayBuffer) { 
    return Array.prototype.map.call(new Uint8Array(arrayBuffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}


export function typedArrayToBuffer(array) {
    return array.buffer.slice(array.byteOffset, array.byteLength + array.byteOffset)
}


// This function keeps calling "toTry" until promise resolves or has
// retried "max" number of times. First retry has a delay of "delay" seconds.
// "success" is called upon success.
// https://googlechrome.github.io/samples/web-bluetooth/automatic-reconnect-async-await.html
export async function exponentialBackoff(max, delay, toTry, success, fail) {
    try {
        const result = await toTry();
        success(result);
    } catch(error) {
        if (max === 0) {
            return fail();
        }
        setTimeout(function() {
        exponentialBackoff(--max, delay * 2, toTry, success, fail);
        }, delay * 1000);
    }
}