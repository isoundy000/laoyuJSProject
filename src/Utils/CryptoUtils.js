/*!
 * Crypto-JS v1.1.0
 * http://code.google.com/p/crypto-js/
 * Copyright (c) 2009, Jeff Mott. All rights reserved.
 * http://code.google.com/p/crypto-js/wiki/License
 */

(function (exports) {

    // Global Crypto object
    var Crypto = {};

    var initBase = function () {
        var base64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

        // Crypto utilities
        var util = Crypto.util = {

            // Bit-wise rotate left
            rotl: function (n, b) {
                return (n << b) | (n >>> (32 - b));
            },

            // Bit-wise rotate right
            rotr: function (n, b) {
                return (n << (32 - b)) | (n >>> b);
            },

            // Swap big-endian to little-endian and vice versa
            endian: function (n) {

                // If number given, swap endian
                if (n.constructor == Number) {
                    return util.rotl(n, 8) & 0x00FF00FF |
                        util.rotl(n, 24) & 0xFF00FF00;
                }

                // Else, assume array and swap all items
                for (var i = 0; i < n.length; i++)
                    n[i] = util.endian(n[i]);
                return n;

            },

            // Generate an array of any length of random bytes
            randomBytes: function (n) {
                for (var bytes = []; n > 0; n--)
                    bytes.push(Math.floor(Math.random() * 256));
                return bytes;
            },

            // Convert a string to a byte array
            stringToBytes: function (str) {
                var bytes = [];
                for (var i = 0; i < str.length; i++)
                    bytes.push(str.charCodeAt(i));
                return bytes;
            },

            // Convert a byte array to a string
            bytesToString: function (bytes) {
                var str = [];
                for (var i = 0; i < bytes.length; i++)
                    str.push(String.fromCharCode(bytes[i]));
                return str.join("");
            },

            // Convert a string to big-endian 32-bit words
            stringToWords: function (str) {
                var words = [];
                for (var c = 0, b = 0; c < str.length; c++, b += 8)
                    words[b >>> 5] |= str.charCodeAt(c) << (24 - b % 32);
                return words;
            },

            // Convert a byte array to big-endian 32-bits words
            bytesToWords: function (bytes) {
                var words = [];
                for (var i = 0, b = 0; i < bytes.length; i++, b += 8)
                    words[b >>> 5] |= bytes[i] << (24 - b % 32);
                return words;
            },

            // Convert big-endian 32-bit words to a byte array
            wordsToBytes: function (words) {
                var bytes = [];
                for (var b = 0; b < words.length * 32; b += 8)
                    bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
                return bytes;
            },

            // Convert a byte array to a hex string
            bytesToHex: function (bytes) {
                var hex = [];
                for (var i = 0; i < bytes.length; i++) {
                    hex.push((bytes[i] >>> 4).toString(16));
                    hex.push((bytes[i] & 0xF).toString(16));
                }
                return hex.join("");
            },

            // Convert a hex string to a byte array
            hexToBytes: function (hex) {
                var bytes = [];
                for (var c = 0; c < hex.length; c += 2)
                    bytes.push(parseInt(hex.substr(c, 2), 16));
                return bytes;
            },

            // Convert a byte array to a base-64 string
            bytesToBase64: function (bytes) {

                // Use browser-native function if it exists
                if (typeof btoa == "function") return btoa(util.bytesToString(bytes));

                var base64 = [],
                    overflow;

                for (var i = 0; i < bytes.length; i++) {
                    switch (i % 3) {
                        case 0:
                            base64.push(base64map.charAt(bytes[i] >>> 2));
                            overflow = (bytes[i] & 0x3) << 4;
                            break;
                        case 1:
                            base64.push(base64map.charAt(overflow | (bytes[i] >>> 4)));
                            overflow = (bytes[i] & 0xF) << 2;
                            break;
                        case 2:
                            base64.push(base64map.charAt(overflow | (bytes[i] >>> 6)));
                            base64.push(base64map.charAt(bytes[i] & 0x3F));
                            overflow = -1;
                    }
                }

                // Encode overflow bits, if there are any
                if (overflow != undefined && overflow != -1)
                    base64.push(base64map.charAt(overflow));

                // Add padding
                while (base64.length % 4 != 0) base64.push("=");

                return base64.join("");

            },

            // Convert a base-64 string to a byte array
            base64ToBytes: function (base64) {

                // Use browser-native function if it exists
                if (typeof atob == "function") return util.stringToBytes(atob(base64));

                // Remove non-base-64 characters
                base64 = base64.replace(/[^A-Z0-9+\/]/ig, "");

                var bytes = [];

                for (var i = 0; i < base64.length; i++) {
                    switch (i % 4) {
                        case 1:
                            bytes.push((base64map.indexOf(base64.charAt(i - 1)) << 2) |
                                (base64map.indexOf(base64.charAt(i)) >>> 4));
                            break;
                        case 2:
                            bytes.push(((base64map.indexOf(base64.charAt(i - 1)) & 0xF) << 4) |
                                (base64map.indexOf(base64.charAt(i)) >>> 2));
                            break;
                        case 3:
                            bytes.push(((base64map.indexOf(base64.charAt(i - 1)) & 0x3) << 6) |
                                (base64map.indexOf(base64.charAt(i))));
                            break;
                    }
                }

                return bytes;

            }

        };

        // Crypto mode namespace
        Crypto.mode = {};
    };


    var initHmac = function () {
        // Shortcut
        var util = Crypto.util;

        Crypto.HMAC = function (hasher, message, key, options) {

            // Allow arbitrary length keys
            key = key.length > hasher._blocksize * 4 ?
                hasher(key, {asBytes: true}) :
                util.stringToBytes(key);

            // XOR keys with pad constants
            var okey = key,
                ikey = key.slice(0);
            for (var i = 0; i < hasher._blocksize * 4; i++) {
                okey[i] ^= 0x5C;
                ikey[i] ^= 0x36;
            }

            var hmacbytes = hasher(util.bytesToString(okey) +
                hasher(util.bytesToString(ikey) + message, {asString: true}),
                {asBytes: true});
            return options && options.asBytes ? hmacbytes :
                options && options.asString ? util.bytesToString(hmacbytes) :
                    util.bytesToHex(hmacbytes);

        };
    };

    var initMD5 = function () {
        // Shortcut
        var util = Crypto.util;

        // Public API
        var MD5 = Crypto.MD5 = function (message, options) {
            var digestbytes = util.wordsToBytes(MD5._md5(message));
            return options && options.asBytes ? digestbytes :
                options && options.asString ? util.bytesToString(digestbytes) :
                    util.bytesToHex(digestbytes);
        };

        // The core
        MD5._md5 = function (message) {

            var m = util.stringToWords(message),
                l = message.length * 8,
                a = 1732584193,
                b = -271733879,
                c = -1732584194,
                d = 271733878;

            // Swap endian
            for (var i = 0; i < m.length; i++) {
                m[i] = ((m[i] << 8) | (m[i] >>> 24)) & 0x00FF00FF |
                    ((m[i] << 24) | (m[i] >>> 8)) & 0xFF00FF00;
            }

            // Padding
            m[l >>> 5] |= 0x80 << (l % 32);
            m[(((l + 64) >>> 9) << 4) + 14] = l;

            for (var i = 0; i < m.length; i += 16) {

                var aa = a,
                    bb = b,
                    cc = c,
                    dd = d;

                a = MD5._ff(a, b, c, d, m[i + 0], 7, -680876936);
                d = MD5._ff(d, a, b, c, m[i + 1], 12, -389564586);
                c = MD5._ff(c, d, a, b, m[i + 2], 17, 606105819);
                b = MD5._ff(b, c, d, a, m[i + 3], 22, -1044525330);
                a = MD5._ff(a, b, c, d, m[i + 4], 7, -176418897);
                d = MD5._ff(d, a, b, c, m[i + 5], 12, 1200080426);
                c = MD5._ff(c, d, a, b, m[i + 6], 17, -1473231341);
                b = MD5._ff(b, c, d, a, m[i + 7], 22, -45705983);
                a = MD5._ff(a, b, c, d, m[i + 8], 7, 1770035416);
                d = MD5._ff(d, a, b, c, m[i + 9], 12, -1958414417);
                c = MD5._ff(c, d, a, b, m[i + 10], 17, -42063);
                b = MD5._ff(b, c, d, a, m[i + 11], 22, -1990404162);
                a = MD5._ff(a, b, c, d, m[i + 12], 7, 1804603682);
                d = MD5._ff(d, a, b, c, m[i + 13], 12, -40341101);
                c = MD5._ff(c, d, a, b, m[i + 14], 17, -1502002290);
                b = MD5._ff(b, c, d, a, m[i + 15], 22, 1236535329);

                a = MD5._gg(a, b, c, d, m[i + 1], 5, -165796510);
                d = MD5._gg(d, a, b, c, m[i + 6], 9, -1069501632);
                c = MD5._gg(c, d, a, b, m[i + 11], 14, 643717713);
                b = MD5._gg(b, c, d, a, m[i + 0], 20, -373897302);
                a = MD5._gg(a, b, c, d, m[i + 5], 5, -701558691);
                d = MD5._gg(d, a, b, c, m[i + 10], 9, 38016083);
                c = MD5._gg(c, d, a, b, m[i + 15], 14, -660478335);
                b = MD5._gg(b, c, d, a, m[i + 4], 20, -405537848);
                a = MD5._gg(a, b, c, d, m[i + 9], 5, 568446438);
                d = MD5._gg(d, a, b, c, m[i + 14], 9, -1019803690);
                c = MD5._gg(c, d, a, b, m[i + 3], 14, -187363961);
                b = MD5._gg(b, c, d, a, m[i + 8], 20, 1163531501);
                a = MD5._gg(a, b, c, d, m[i + 13], 5, -1444681467);
                d = MD5._gg(d, a, b, c, m[i + 2], 9, -51403784);
                c = MD5._gg(c, d, a, b, m[i + 7], 14, 1735328473);
                b = MD5._gg(b, c, d, a, m[i + 12], 20, -1926607734);

                a = MD5._hh(a, b, c, d, m[i + 5], 4, -378558);
                d = MD5._hh(d, a, b, c, m[i + 8], 11, -2022574463);
                c = MD5._hh(c, d, a, b, m[i + 11], 16, 1839030562);
                b = MD5._hh(b, c, d, a, m[i + 14], 23, -35309556);
                a = MD5._hh(a, b, c, d, m[i + 1], 4, -1530992060);
                d = MD5._hh(d, a, b, c, m[i + 4], 11, 1272893353);
                c = MD5._hh(c, d, a, b, m[i + 7], 16, -155497632);
                b = MD5._hh(b, c, d, a, m[i + 10], 23, -1094730640);
                a = MD5._hh(a, b, c, d, m[i + 13], 4, 681279174);
                d = MD5._hh(d, a, b, c, m[i + 0], 11, -358537222);
                c = MD5._hh(c, d, a, b, m[i + 3], 16, -722521979);
                b = MD5._hh(b, c, d, a, m[i + 6], 23, 76029189);
                a = MD5._hh(a, b, c, d, m[i + 9], 4, -640364487);
                d = MD5._hh(d, a, b, c, m[i + 12], 11, -421815835);
                c = MD5._hh(c, d, a, b, m[i + 15], 16, 530742520);
                b = MD5._hh(b, c, d, a, m[i + 2], 23, -995338651);

                a = MD5._ii(a, b, c, d, m[i + 0], 6, -198630844);
                d = MD5._ii(d, a, b, c, m[i + 7], 10, 1126891415);
                c = MD5._ii(c, d, a, b, m[i + 14], 15, -1416354905);
                b = MD5._ii(b, c, d, a, m[i + 5], 21, -57434055);
                a = MD5._ii(a, b, c, d, m[i + 12], 6, 1700485571);
                d = MD5._ii(d, a, b, c, m[i + 3], 10, -1894986606);
                c = MD5._ii(c, d, a, b, m[i + 10], 15, -1051523);
                b = MD5._ii(b, c, d, a, m[i + 1], 21, -2054922799);
                a = MD5._ii(a, b, c, d, m[i + 8], 6, 1873313359);
                d = MD5._ii(d, a, b, c, m[i + 15], 10, -30611744);
                c = MD5._ii(c, d, a, b, m[i + 6], 15, -1560198380);
                b = MD5._ii(b, c, d, a, m[i + 13], 21, 1309151649);
                a = MD5._ii(a, b, c, d, m[i + 4], 6, -145523070);
                d = MD5._ii(d, a, b, c, m[i + 11], 10, -1120210379);
                c = MD5._ii(c, d, a, b, m[i + 2], 15, 718787259);
                b = MD5._ii(b, c, d, a, m[i + 9], 21, -343485551);

                a += aa;
                b += bb;
                c += cc;
                d += dd;

            }

            return util.endian([a, b, c, d]);

        };

        // Auxiliary functions
        MD5._ff = function (a, b, c, d, x, s, t) {
            var n = a + (b & c | ~b & d) + (x >>> 0) + t;
            return ((n << s) | (n >>> (32 - s))) + b;
        };
        MD5._gg = function (a, b, c, d, x, s, t) {
            var n = a + (b & d | c & ~d) + (x >>> 0) + t;
            return ((n << s) | (n >>> (32 - s))) + b;
        };
        MD5._hh = function (a, b, c, d, x, s, t) {
            var n = a + (b ^ c ^ d) + (x >>> 0) + t;
            return ((n << s) | (n >>> (32 - s))) + b;
        };
        MD5._ii = function (a, b, c, d, x, s, t) {
            var n = a + (c ^ (b | ~d)) + (x >>> 0) + t;
            return ((n << s) | (n >>> (32 - s))) + b;
        };

        // Package private blocksize
        MD5._blocksize = 16;
    };

    var initSHA1 = function () {
        // Shortcut
        var util = Crypto.util;

        // Public API
        var SHA1 = Crypto.SHA1 = function (message, options) {
            var digestbytes = util.wordsToBytes(SHA1._sha1(message));
            return options && options.asBytes ? digestbytes :
                options && options.asString ? util.bytesToString(digestbytes) :
                    util.bytesToHex(digestbytes);
        };

        // The core
        SHA1._sha1 = function (message) {

            var m = util.stringToWords(message),
                l = message.length * 8,
                w = [],
                H0 = 1732584193,
                H1 = -271733879,
                H2 = -1732584194,
                H3 = 271733878,
                H4 = -1009589776;

            // Padding
            m[l >> 5] |= 0x80 << (24 - l % 32);
            m[((l + 64 >>> 9) << 4) + 15] = l;

            for (var i = 0; i < m.length; i += 16) {

                var a = H0,
                    b = H1,
                    c = H2,
                    d = H3,
                    e = H4;

                for (var j = 0; j < 80; j++) {

                    if (j < 16) w[j] = m[i + j];
                    else {
                        var n = w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16];
                        w[j] = (n << 1) | (n >>> 31);
                    }

                    var t = ((H0 << 5) | (H0 >>> 27)) + H4 + (w[j] >>> 0) + (
                            j < 20 ? (H1 & H2 | ~H1 & H3) + 1518500249 :
                                j < 40 ? (H1 ^ H2 ^ H3) + 1859775393 :
                                    j < 60 ? (H1 & H2 | H1 & H3 | H2 & H3) - 1894007588 :
                                    (H1 ^ H2 ^ H3) - 899497514);

                    H4 = H3;
                    H3 = H2;
                    H2 = (H1 << 30) | (H1 >>> 2);
                    H1 = H0;
                    H0 = t;

                }

                H0 += a;
                H1 += b;
                H2 += c;
                H3 += d;
                H4 += e;

            }

            return [H0, H1, H2, H3, H4];

        };

        // Package private blocksize
        SHA1._blocksize = 16;
    };

    var initBzip2 = function () {
        var bzip2 = {};

        bzip2.array = function (bytes) {
            var bit = 0, byte = 0;
            var BITMASK = [0, 0x01, 0x03, 0x07, 0x0F, 0x1F, 0x3F, 0x7F, 0xFF];
            return function (n) {
                var result = 0;
                while (n > 0) {
                    var left = 8 - bit;
                    if (n >= left) {
                        result <<= left;
                        result |= (BITMASK[left] & bytes[byte++]);
                        bit = 0;
                        n -= left;
                    } else {
                        result <<= n;
                        result |= ((bytes[byte] & (BITMASK[n] << (8 - n - bit))) >> (8 - n - bit));
                        bit += n;
                        n = 0;
                    }
                }
                return result
            }
        };

        bzip2.simple = function (bits) {
            var size = bzip2.header(bits);
            var all = [], chunk = [];
            do {
                for (var i = 0; i < chunk.length; i++)
                    all.push(chunk[i]);
                chunk = bzip2.decompress(bits, size);
            } while (chunk != -1);
            return all;
        };

        bzip2.header = function (bits) {
            if (bits(8 * 3) != 4348520) throw "No magic number found";
            var i = bits(8) - 48;
            if (i < 1 || i > 9) throw "Not a BZIP archive";
            return i;
        };

        //takes a function for reading the block data (starting with 0x314159265359)
        //a block size (0-9) (optional, defaults to 9)
        //a length at which to stop decompressing and return the output
        bzip2.decompress = function (bits, size, len) {
            var MAX_HUFCODE_BITS = 20;
            var MAX_SYMBOLS = 258;
            var SYMBOL_RUNA = 0;
            var SYMBOL_RUNB = 1;
            var GROUP_SIZE = 50;

            var bufsize = 100000 * size;
            for (var h = '', i = 0; i < 6; i++) h += bits(8).toString(16);
            if (h == "177245385090") return -1; //last block
            if (h != "314159265359") throw "eek not valid bzip data";
            bits(32); //ignore CRC codes
            if (bits(1)) throw "unsupported obsolete version";
            var origPtr = bits(24);
            if (origPtr > bufsize) throw "Initial position larger than buffer size";
            var t = bits(16);
            var symToByte = new Uint8Array(256),
                symTotal = 0;
            for (i = 0; i < 16; i++) {
                if (t & (1 << (15 - i))) {
                    var k = bits(16);
                    for (j = 0; j < 16; j++) {
                        if (k & (1 << (15 - j))) {
                            symToByte[symTotal++] = (16 * i) + j;
                        }
                    }
                }
            }

            var groupCount = bits(3);
            if (groupCount < 2 || groupCount > 6) throw "another error";
            var nSelectors = bits(15);
            if (nSelectors == 0) throw "meh";
            var mtfSymbol = []; //TODO: possibly replace JS array with typed arrays
            for (var i = 0; i < groupCount; i++) mtfSymbol[i] = i;
            var selectors = new Uint8Array(32768);

            for (var i = 0; i < nSelectors; i++) {
                for (var j = 0; bits(1); j++) if (j >= groupCount) throw "whoops another error";
                var uc = mtfSymbol[j];
                mtfSymbol.splice(j, 1); //this is a probably inefficient MTF transform
                mtfSymbol.splice(0, 0, uc);
                selectors[i] = uc;
            }

            var symCount = symTotal + 2;
            var groups = [];
            for (var j = 0; j < groupCount; j++) {
                var length = new Uint8Array(MAX_SYMBOLS),
                    temp = new Uint8Array(MAX_HUFCODE_BITS + 1);
                t = bits(5); //lengths
                for (var i = 0; i < symCount; i++) {
                    while (true) {
                        if (t < 1 || t > MAX_HUFCODE_BITS) throw "I gave up a while ago on writing error messages";
                        if (!bits(1)) break;
                        if (!bits(1)) t++;
                        else t--;
                    }
                    length[i] = t;
                }
                var minLen, maxLen;
                minLen = maxLen = length[0];
                for (var i = 1; i < symCount; i++) {
                    if (length[i] > maxLen) maxLen = length[i];
                    else if (length[i] < minLen) minLen = length[i];
                }
                var hufGroup;
                hufGroup = groups[j] = {};
                hufGroup.permute = new Uint32Array(MAX_SYMBOLS);
                hufGroup.limit = new Uint32Array(MAX_HUFCODE_BITS + 1);
                hufGroup.base = new Uint32Array(MAX_HUFCODE_BITS + 1);
                hufGroup.minLen = minLen;
                hufGroup.maxLen = maxLen;
                var base = hufGroup.base.subarray(1);
                var limit = hufGroup.limit.subarray(1);
                var pp = 0;
                for (var i = minLen; i <= maxLen; i++)
                    for (var t = 0; t < symCount; t++)
                        if (length[t] == i) hufGroup.permute[pp++] = t;
                for (i = minLen; i <= maxLen; i++) temp[i] = limit[i] = 0;
                for (i = 0; i < symCount; i++) temp[length[i]]++;
                pp = t = 0;
                for (i = minLen; i < maxLen; i++) {
                    pp += temp[i];
                    limit[i] = pp - 1;
                    pp <<= 1;
                    base[i + 1] = pp - (t += temp[i]);
                }
                limit[maxLen] = pp + temp[maxLen] - 1;
                base[minLen] = 0;
            }
            var byteCount = new Uint32Array(256);
            for (var i = 0; i < 256; i++) mtfSymbol[i] = i;
            var runPos, count, symCount, selector;
            runPos = count = symCount = selector = 0;
            var buf = new Uint32Array(bufsize);
            while (true) {
                if (!(symCount--)) {
                    symCount = GROUP_SIZE - 1;
                    if (selector >= nSelectors) throw "meow i'm a kitty, that's an error";
                    hufGroup = groups[selectors[selector++]];
                    base = hufGroup.base.subarray(1);
                    limit = hufGroup.limit.subarray(1);
                }
                i = hufGroup.minLen;
                j = bits(i);
                while (true) {
                    if (i > hufGroup.maxLen) throw "rawr i'm a dinosaur";
                    if (j <= limit[i]) break;
                    i++;
                    j = (j << 1) | bits(1);
                }
                j -= base[i];
                if (j < 0 || j >= MAX_SYMBOLS) throw "moo i'm a cow";
                var nextSym = hufGroup.permute[j];
                if (nextSym == SYMBOL_RUNA || nextSym == SYMBOL_RUNB) {
                    if (!runPos) {
                        runPos = 1;
                        t = 0;
                    }
                    if (nextSym == SYMBOL_RUNA) t += runPos;
                    else t += 2 * runPos;
                    runPos <<= 1;
                    continue;
                }
                if (runPos) {
                    runPos = 0;
                    if (count + t >= bufsize) throw "Boom.";
                    uc = symToByte[mtfSymbol[0]];
                    byteCount[uc] += t;
                    while (t--) buf[count++] = uc;
                }
                if (nextSym > symTotal) break;
                if (count >= bufsize) throw "I can't think of anything. Error";
                i = nextSym - 1;
                uc = mtfSymbol[i];
                mtfSymbol.splice(i, 1);
                mtfSymbol.splice(0, 0, uc);
                uc = symToByte[uc];
                byteCount[uc]++;
                buf[count++] = uc;
            }
            if (origPtr < 0 || origPtr >= count) throw "I'm a monkey and I'm throwing something at someone, namely you";
            var j = 0;
            for (var i = 0; i < 256; i++) {
                k = j + byteCount[i];
                byteCount[i] = j;
                j = k;
            }
            for (var i = 0; i < count; i++) {
                uc = buf[i] & 0xff;
                buf[byteCount[uc]] |= (i << 8);
                byteCount[uc]++;
            }
            var pos = 0, current = 0, run = 0;
            if (count) {
                pos = buf[origPtr];
                current = (pos & 0xff);
                pos >>= 8;
                run = -1;
            }
            var output = [];
            var copies, previous, outbyte;
            if (!len) len = Infinity;
            while (count) {
                count--;
                previous = current;
                pos = buf[pos];
                current = pos & 0xff;
                pos >>= 8;
                if (run++ == 3) {
                    copies = current;
                    outbyte = previous;
                    current = -1;
                } else {
                    copies = 1;
                    outbyte = current;
                }
                while (copies--) {
                    output.push(outbyte);
                    if (!--len) return output;
                }
                if (current != previous) run = 0;
            }
            return output;
        };
        exports.bzip2 = bzip2;
    };

    var initRC4 = function () {
        var KEY = 'tiantianxiangshang';
        Crypto.RC4 = function (str) {
            if (typeof str !== 'string')
                str = str.toString();
            var key = KEY;
            var s = [], j = 0, x, res = '';
            for (var i = 0; i < 256; i++) {
                s[i] = i;
            }
            for (i = 0; i < 256; i++) {
                j = (j + s[i] + key.charCodeAt(i % key.length)) % 256;
                x = s[i];
                s[i] = s[j];
                s[j] = x;
            }
            i = 0;
            j = 0;
            for (var y = 0; y < str.length; y++) {
                i = (i + 1) % 256;
                j = (j + s[i]) % 256;
                x = s[i];
                s[i] = s[j];
                s[j] = x;
                res += String.fromCharCode(str.charCodeAt(y) ^ s[(s[i] + s[j]) % 256]);
            }
            return res;
        };
    };

    var initEncodeFunctions = function () {
        exports.UTF16ArrayToUTF8Array = function (s) {
            if (!s)
                return;

            var i, code, ret = [], len = s.length;
            for (i = 0; i < len; i++) {
                code = s[i];
                if (code > 0x0 && code <= 0x7f) {
                    //单字节
                    //UTF-16 0000 - 007F
                    //UTF-8  0xxxxxxx
                    ret.push(code);
                } else if (code >= 0x80 && code <= 0x7ff) {
                    //双字节
                    //UTF-16 0080 - 07FF
                    //UTF-8  110xxxxx 10xxxxxx
                    ret.push(
                        //110xxxxx
                        0xc0 | ((code >> 6) & 0x1f),
                        //10xxxxxx
                        0x80 | (code & 0x3f)
                    );
                } else if (code >= 0x800 && code <= 0xffff) {
                    //三字节
                    //UTF-16 0800 - FFFF
                    //UTF-8  1110xxxx 10xxxxxx 10xxxxxx
                    ret.push(
                        //1110xxxx
                        0xe0 | ((code >> 12) & 0xf),
                        //10xxxxxx
                        0x80 | ((code >> 6) & 0x3f),
                        //10xxxxxx
                        0x80 | (code & 0x3f)
                    );
                }
            }

            return ret;
        };

        exports.UTF8ArrayToUTF16Array = function (s) {
            if (!s)
                return;
            var i, codes, bytes, ret = [], len = s.length;
            for (i = 0; i < len; i++) {
                codes = [];
                codes.push(s[i]);
                if (((codes[0] >> 7) & 0xff) == 0x0) {
                    //单字节  0xxxxxxx
                    ret.push(s[i]);
                } else if (((codes[0] >> 5) & 0xff) == 0x6) {
                    //双字节  110xxxxx 10xxxxxx
                    codes.push(s[++i]);
                    bytes = [];
                    bytes.push(codes[0] & 0x1f);
                    bytes.push(codes[1] & 0x3f);
                    ret.push((bytes[0] << 6) | bytes[1]);
                } else if (((codes[0] >> 4) & 0xff) == 0xe) {
                    //三字节  1110xxxx 10xxxxxx 10xxxxxx
                    codes.push(s[++i]);
                    codes.push(s[++i]);
                    bytes = [];
                    bytes.push((codes[0] << 4) | ((codes[1] >> 2) & 0xf));
                    bytes.push(((codes[1] & 0x3) << 6) | (codes[2] & 0x3f));
                    ret.push((bytes[0] << 8) | bytes[1]);
                }
            }
            return ret;
        }
    };

    initBase();
    initHmac();
    initMD5();
    initSHA1();
    initBzip2();
    initRC4();
    initEncodeFunctions();

    exports.Crypto = Crypto;

})(this);