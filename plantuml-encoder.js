// plantuml-encoder.js - 原生实现 PlantUML 编码
const pumlEncoder = {
    encode: function (plantumlText) {
        // 1. 移除所有空格和非ASCII字符
        const cleaned = plantumlText
            .replace(/\s+/g, '')
            .replace(/[^\x20-\x7F]/g, '');

        // 2. 转换为UTF-8字节数组
        const utf8Bytes = [];
        for (let i = 0; i < cleaned.length; i++) {
            const charCode = cleaned.charCodeAt(i);
            if (charCode < 0x80) {
                utf8Bytes.push(charCode);
            } else if (charCode < 0x800) {
                utf8Bytes.push(0xc0 | (charCode >> 6));
                utf8Bytes.push(0x80 | (charCode & 0x3f));
            } else {
                utf8Bytes.push(0xe0 | (charCode >> 12));
                utf8Bytes.push(0x80 | ((charCode >> 6) & 0x3f));
                utf8Bytes.push(0x80 | (charCode & 0x3f));
            }
        }

        // 3. 实现PlantUML的6位编码
        const base64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
        let result = '';

        for (let i = 0; i < utf8Bytes.length; i += 3) {
            const byte1 = utf8Bytes[i];
            const byte2 = utf8Bytes[i + 1] || 0;
            const byte3 = utf8Bytes[i + 2] || 0;

            const triplet = (byte1 << 16) | (byte2 << 8) | byte3;

            result += base64[(triplet >> 18) & 0x3f];
            result += base64[(triplet >> 12) & 0x3f];
            result += base64[(triplet >> 6) & 0x3f];
            result += base64[triplet & 0x3f];
        }

        // 4. 根据长度调整填充
        const padding = utf8Bytes.length % 3;
        if (padding === 1) {
            result = result.slice(0, -2) + '==';
        } else if (padding === 2) {
            result = result.slice(0, -1) + '=';
        }

        return result;
    }
};