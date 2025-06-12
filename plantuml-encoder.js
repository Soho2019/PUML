// plantuml-encoder.js - 符合 PlantUML 官方规范的编码器
const pumlEncoder = {
    encode: function (plantumlText) {
        // PlantUML 官方推荐的编码方法
        let encoded = '';
        let i = 0;
        const len = plantumlText.length;

        while (i < len) {
            const byte1 = plantumlText.charCodeAt(i++);
            let byte2 = 0, byte3 = 0;

            if (i < len) byte2 = plantumlText.charCodeAt(i++);
            if (i < len) byte3 = plantumlText.charCodeAt(i++);

            const triplet = (byte1 << 16) | (byte2 << 8) | byte3;

            encoded += this._encode6bit(triplet >>> 18 & 0x3F);
            encoded += this._encode6bit(triplet >>> 12 & 0x3F);
            encoded += this._encode6bit(triplet >>> 6 & 0x3F);
            encoded += this._encode6bit(triplet & 0x3F);
        }

        // 添加填充字符
        const mod = len % 3;
        if (mod === 1) {
            encoded = encoded.substring(0, encoded.length - 2) + '==';
        } else if (mod === 2) {
            encoded = encoded.substring(0, encoded.length - 1) + '=';
        }

        return encoded;
    },

    _encode6bit: function (b) {
        if (b < 10) {
            return String.fromCharCode(48 + b);
        }
        b -= 10;
        if (b < 26) {
            return String.fromCharCode(65 + b);
        }
        b -= 26;
        if (b < 26) {
            return String.fromCharCode(97 + b);
        }
        b -= 26;
        if (b === 0) {
            return '-';
        }
        if (b === 1) {
            return '_';
        }
        return '?';
    }
};