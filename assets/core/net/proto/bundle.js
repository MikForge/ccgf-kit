/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.network = (function() {

    /**
     * Namespace network.
     * @exports network
     * @namespace
     */
    var network = {};

    network.Response = (function() {

        /**
         * Properties of a Response.
         * @memberof network
         * @interface IResponse
         * @property {number|null} [code] Response code
         * @property {string|null} [message] Response message
         * @property {Uint8Array|null} [data] Response data
         */

        /**
         * Constructs a new Response.
         * @memberof network
         * @classdesc Represents a Response.
         * @implements IResponse
         * @constructor
         * @param {network.IResponse=} [properties] Properties to set
         */
        function Response(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Response code.
         * @member {number} code
         * @memberof network.Response
         * @instance
         */
        Response.prototype.code = 0;

        /**
         * Response message.
         * @member {string} message
         * @memberof network.Response
         * @instance
         */
        Response.prototype.message = "";

        /**
         * Response data.
         * @member {Uint8Array} data
         * @memberof network.Response
         * @instance
         */
        Response.prototype.data = $util.newBuffer([]);

        /**
         * Creates a new Response instance using the specified properties.
         * @function create
         * @memberof network.Response
         * @static
         * @param {network.IResponse=} [properties] Properties to set
         * @returns {network.Response} Response instance
         */
        Response.create = function create(properties) {
            return new Response(properties);
        };

        /**
         * Encodes the specified Response message. Does not implicitly {@link network.Response.verify|verify} messages.
         * @function encode
         * @memberof network.Response
         * @static
         * @param {network.IResponse} message Response message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Response.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.code != null && Object.hasOwnProperty.call(message, "code"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.code);
            if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.message);
            if (message.data != null && Object.hasOwnProperty.call(message, "data"))
                writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.data);
            return writer;
        };

        /**
         * Encodes the specified Response message, length delimited. Does not implicitly {@link network.Response.verify|verify} messages.
         * @function encodeDelimited
         * @memberof network.Response
         * @static
         * @param {network.IResponse} message Response message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Response.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Response message from the specified reader or buffer.
         * @function decode
         * @memberof network.Response
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {network.Response} Response
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Response.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.network.Response();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.code = reader.int32();
                        break;
                    }
                case 2: {
                        message.message = reader.string();
                        break;
                    }
                case 3: {
                        message.data = reader.bytes();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Response message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof network.Response
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {network.Response} Response
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Response.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Response message.
         * @function verify
         * @memberof network.Response
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Response.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.code != null && message.hasOwnProperty("code"))
                if (!$util.isInteger(message.code))
                    return "code: integer expected";
            if (message.message != null && message.hasOwnProperty("message"))
                if (!$util.isString(message.message))
                    return "message: string expected";
            if (message.data != null && message.hasOwnProperty("data"))
                if (!(message.data && typeof message.data.length === "number" || $util.isString(message.data)))
                    return "data: buffer expected";
            return null;
        };

        /**
         * Creates a Response message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof network.Response
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {network.Response} Response
         */
        Response.fromObject = function fromObject(object) {
            if (object instanceof $root.network.Response)
                return object;
            var message = new $root.network.Response();
            if (object.code != null)
                message.code = object.code | 0;
            if (object.message != null)
                message.message = String(object.message);
            if (object.data != null)
                if (typeof object.data === "string")
                    $util.base64.decode(object.data, message.data = $util.newBuffer($util.base64.length(object.data)), 0);
                else if (object.data.length >= 0)
                    message.data = object.data;
            return message;
        };

        /**
         * Creates a plain object from a Response message. Also converts values to other types if specified.
         * @function toObject
         * @memberof network.Response
         * @static
         * @param {network.Response} message Response
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Response.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.code = 0;
                object.message = "";
                if (options.bytes === String)
                    object.data = "";
                else {
                    object.data = [];
                    if (options.bytes !== Array)
                        object.data = $util.newBuffer(object.data);
                }
            }
            if (message.code != null && message.hasOwnProperty("code"))
                object.code = message.code;
            if (message.message != null && message.hasOwnProperty("message"))
                object.message = message.message;
            if (message.data != null && message.hasOwnProperty("data"))
                object.data = options.bytes === String ? $util.base64.encode(message.data, 0, message.data.length) : options.bytes === Array ? Array.prototype.slice.call(message.data) : message.data;
            return object;
        };

        /**
         * Converts this Response to JSON.
         * @function toJSON
         * @memberof network.Response
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Response.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Response
         * @function getTypeUrl
         * @memberof network.Response
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Response.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/network.Response";
        };

        return Response;
    })();

    network.HeartbeatRequest = (function() {

        /**
         * Properties of a HeartbeatRequest.
         * @memberof network
         * @interface IHeartbeatRequest
         * @property {number|Long|null} [timestamp] HeartbeatRequest timestamp
         */

        /**
         * Constructs a new HeartbeatRequest.
         * @memberof network
         * @classdesc Represents a HeartbeatRequest.
         * @implements IHeartbeatRequest
         * @constructor
         * @param {network.IHeartbeatRequest=} [properties] Properties to set
         */
        function HeartbeatRequest(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * HeartbeatRequest timestamp.
         * @member {number|Long} timestamp
         * @memberof network.HeartbeatRequest
         * @instance
         */
        HeartbeatRequest.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new HeartbeatRequest instance using the specified properties.
         * @function create
         * @memberof network.HeartbeatRequest
         * @static
         * @param {network.IHeartbeatRequest=} [properties] Properties to set
         * @returns {network.HeartbeatRequest} HeartbeatRequest instance
         */
        HeartbeatRequest.create = function create(properties) {
            return new HeartbeatRequest(properties);
        };

        /**
         * Encodes the specified HeartbeatRequest message. Does not implicitly {@link network.HeartbeatRequest.verify|verify} messages.
         * @function encode
         * @memberof network.HeartbeatRequest
         * @static
         * @param {network.IHeartbeatRequest} message HeartbeatRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HeartbeatRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(/* id 1, wireType 0 =*/8).int64(message.timestamp);
            return writer;
        };

        /**
         * Encodes the specified HeartbeatRequest message, length delimited. Does not implicitly {@link network.HeartbeatRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof network.HeartbeatRequest
         * @static
         * @param {network.IHeartbeatRequest} message HeartbeatRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HeartbeatRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a HeartbeatRequest message from the specified reader or buffer.
         * @function decode
         * @memberof network.HeartbeatRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {network.HeartbeatRequest} HeartbeatRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HeartbeatRequest.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.network.HeartbeatRequest();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.timestamp = reader.int64();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a HeartbeatRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof network.HeartbeatRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {network.HeartbeatRequest} HeartbeatRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HeartbeatRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a HeartbeatRequest message.
         * @function verify
         * @memberof network.HeartbeatRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        HeartbeatRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                    return "timestamp: integer|Long expected";
            return null;
        };

        /**
         * Creates a HeartbeatRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof network.HeartbeatRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {network.HeartbeatRequest} HeartbeatRequest
         */
        HeartbeatRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.network.HeartbeatRequest)
                return object;
            var message = new $root.network.HeartbeatRequest();
            if (object.timestamp != null)
                if ($util.Long)
                    (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = false;
                else if (typeof object.timestamp === "string")
                    message.timestamp = parseInt(object.timestamp, 10);
                else if (typeof object.timestamp === "number")
                    message.timestamp = object.timestamp;
                else if (typeof object.timestamp === "object")
                    message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a HeartbeatRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof network.HeartbeatRequest
         * @static
         * @param {network.HeartbeatRequest} message HeartbeatRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        HeartbeatRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestamp = options.longs === String ? "0" : 0;
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (typeof message.timestamp === "number")
                    object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                else
                    object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber() : message.timestamp;
            return object;
        };

        /**
         * Converts this HeartbeatRequest to JSON.
         * @function toJSON
         * @memberof network.HeartbeatRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        HeartbeatRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for HeartbeatRequest
         * @function getTypeUrl
         * @memberof network.HeartbeatRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        HeartbeatRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/network.HeartbeatRequest";
        };

        return HeartbeatRequest;
    })();

    network.HeartbeatResponse = (function() {

        /**
         * Properties of a HeartbeatResponse.
         * @memberof network
         * @interface IHeartbeatResponse
         * @property {number|Long|null} [serverTime] HeartbeatResponse serverTime
         */

        /**
         * Constructs a new HeartbeatResponse.
         * @memberof network
         * @classdesc Represents a HeartbeatResponse.
         * @implements IHeartbeatResponse
         * @constructor
         * @param {network.IHeartbeatResponse=} [properties] Properties to set
         */
        function HeartbeatResponse(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * HeartbeatResponse serverTime.
         * @member {number|Long} serverTime
         * @memberof network.HeartbeatResponse
         * @instance
         */
        HeartbeatResponse.prototype.serverTime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new HeartbeatResponse instance using the specified properties.
         * @function create
         * @memberof network.HeartbeatResponse
         * @static
         * @param {network.IHeartbeatResponse=} [properties] Properties to set
         * @returns {network.HeartbeatResponse} HeartbeatResponse instance
         */
        HeartbeatResponse.create = function create(properties) {
            return new HeartbeatResponse(properties);
        };

        /**
         * Encodes the specified HeartbeatResponse message. Does not implicitly {@link network.HeartbeatResponse.verify|verify} messages.
         * @function encode
         * @memberof network.HeartbeatResponse
         * @static
         * @param {network.IHeartbeatResponse} message HeartbeatResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HeartbeatResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.serverTime != null && Object.hasOwnProperty.call(message, "serverTime"))
                writer.uint32(/* id 1, wireType 0 =*/8).int64(message.serverTime);
            return writer;
        };

        /**
         * Encodes the specified HeartbeatResponse message, length delimited. Does not implicitly {@link network.HeartbeatResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof network.HeartbeatResponse
         * @static
         * @param {network.IHeartbeatResponse} message HeartbeatResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HeartbeatResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a HeartbeatResponse message from the specified reader or buffer.
         * @function decode
         * @memberof network.HeartbeatResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {network.HeartbeatResponse} HeartbeatResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HeartbeatResponse.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.network.HeartbeatResponse();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.serverTime = reader.int64();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a HeartbeatResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof network.HeartbeatResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {network.HeartbeatResponse} HeartbeatResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HeartbeatResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a HeartbeatResponse message.
         * @function verify
         * @memberof network.HeartbeatResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        HeartbeatResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.serverTime != null && message.hasOwnProperty("serverTime"))
                if (!$util.isInteger(message.serverTime) && !(message.serverTime && $util.isInteger(message.serverTime.low) && $util.isInteger(message.serverTime.high)))
                    return "serverTime: integer|Long expected";
            return null;
        };

        /**
         * Creates a HeartbeatResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof network.HeartbeatResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {network.HeartbeatResponse} HeartbeatResponse
         */
        HeartbeatResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.network.HeartbeatResponse)
                return object;
            var message = new $root.network.HeartbeatResponse();
            if (object.serverTime != null)
                if ($util.Long)
                    (message.serverTime = $util.Long.fromValue(object.serverTime)).unsigned = false;
                else if (typeof object.serverTime === "string")
                    message.serverTime = parseInt(object.serverTime, 10);
                else if (typeof object.serverTime === "number")
                    message.serverTime = object.serverTime;
                else if (typeof object.serverTime === "object")
                    message.serverTime = new $util.LongBits(object.serverTime.low >>> 0, object.serverTime.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a HeartbeatResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof network.HeartbeatResponse
         * @static
         * @param {network.HeartbeatResponse} message HeartbeatResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        HeartbeatResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.serverTime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.serverTime = options.longs === String ? "0" : 0;
            if (message.serverTime != null && message.hasOwnProperty("serverTime"))
                if (typeof message.serverTime === "number")
                    object.serverTime = options.longs === String ? String(message.serverTime) : message.serverTime;
                else
                    object.serverTime = options.longs === String ? $util.Long.prototype.toString.call(message.serverTime) : options.longs === Number ? new $util.LongBits(message.serverTime.low >>> 0, message.serverTime.high >>> 0).toNumber() : message.serverTime;
            return object;
        };

        /**
         * Converts this HeartbeatResponse to JSON.
         * @function toJSON
         * @memberof network.HeartbeatResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        HeartbeatResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for HeartbeatResponse
         * @function getTypeUrl
         * @memberof network.HeartbeatResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        HeartbeatResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/network.HeartbeatResponse";
        };

        return HeartbeatResponse;
    })();

    /**
     * ErrorCode enum.
     * @name network.ErrorCode
     * @enum {number}
     * @property {number} SUCCESS=0 SUCCESS value
     * @property {number} UNKNOWN_ERROR=1 UNKNOWN_ERROR value
     * @property {number} INVALID_PARAM=2 INVALID_PARAM value
     * @property {number} AUTH_FAILED=3 AUTH_FAILED value
     * @property {number} TIMEOUT=4 TIMEOUT value
     * @property {number} SERVER_ERROR=5 SERVER_ERROR value
     */
    network.ErrorCode = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "SUCCESS"] = 0;
        values[valuesById[1] = "UNKNOWN_ERROR"] = 1;
        values[valuesById[2] = "INVALID_PARAM"] = 2;
        values[valuesById[3] = "AUTH_FAILED"] = 3;
        values[valuesById[4] = "TIMEOUT"] = 4;
        values[valuesById[5] = "SERVER_ERROR"] = 5;
        return values;
    })();

    network.GameData = (function() {

        /**
         * Properties of a GameData.
         * @memberof network
         * @interface IGameData
         * @property {number|null} [level] GameData level
         * @property {number|null} [score] GameData score
         * @property {number|null} [coin] GameData coin
         * @property {number|null} [diamond] GameData diamond
         * @property {Array.<number>|null} [items] GameData items
         */

        /**
         * Constructs a new GameData.
         * @memberof network
         * @classdesc Represents a GameData.
         * @implements IGameData
         * @constructor
         * @param {network.IGameData=} [properties] Properties to set
         */
        function GameData(properties) {
            this.items = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GameData level.
         * @member {number} level
         * @memberof network.GameData
         * @instance
         */
        GameData.prototype.level = 0;

        /**
         * GameData score.
         * @member {number} score
         * @memberof network.GameData
         * @instance
         */
        GameData.prototype.score = 0;

        /**
         * GameData coin.
         * @member {number} coin
         * @memberof network.GameData
         * @instance
         */
        GameData.prototype.coin = 0;

        /**
         * GameData diamond.
         * @member {number} diamond
         * @memberof network.GameData
         * @instance
         */
        GameData.prototype.diamond = 0;

        /**
         * GameData items.
         * @member {Array.<number>} items
         * @memberof network.GameData
         * @instance
         */
        GameData.prototype.items = $util.emptyArray;

        /**
         * Creates a new GameData instance using the specified properties.
         * @function create
         * @memberof network.GameData
         * @static
         * @param {network.IGameData=} [properties] Properties to set
         * @returns {network.GameData} GameData instance
         */
        GameData.create = function create(properties) {
            return new GameData(properties);
        };

        /**
         * Encodes the specified GameData message. Does not implicitly {@link network.GameData.verify|verify} messages.
         * @function encode
         * @memberof network.GameData
         * @static
         * @param {network.IGameData} message GameData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GameData.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.level != null && Object.hasOwnProperty.call(message, "level"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.level);
            if (message.score != null && Object.hasOwnProperty.call(message, "score"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.score);
            if (message.coin != null && Object.hasOwnProperty.call(message, "coin"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.coin);
            if (message.diamond != null && Object.hasOwnProperty.call(message, "diamond"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.diamond);
            if (message.items != null && message.items.length) {
                writer.uint32(/* id 5, wireType 2 =*/42).fork();
                for (var i = 0; i < message.items.length; ++i)
                    writer.int32(message.items[i]);
                writer.ldelim();
            }
            return writer;
        };

        /**
         * Encodes the specified GameData message, length delimited. Does not implicitly {@link network.GameData.verify|verify} messages.
         * @function encodeDelimited
         * @memberof network.GameData
         * @static
         * @param {network.IGameData} message GameData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GameData.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GameData message from the specified reader or buffer.
         * @function decode
         * @memberof network.GameData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {network.GameData} GameData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GameData.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.network.GameData();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.level = reader.int32();
                        break;
                    }
                case 2: {
                        message.score = reader.int32();
                        break;
                    }
                case 3: {
                        message.coin = reader.int32();
                        break;
                    }
                case 4: {
                        message.diamond = reader.int32();
                        break;
                    }
                case 5: {
                        if (!(message.items && message.items.length))
                            message.items = [];
                        if ((tag & 7) === 2) {
                            var end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.items.push(reader.int32());
                        } else
                            message.items.push(reader.int32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a GameData message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof network.GameData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {network.GameData} GameData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GameData.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GameData message.
         * @function verify
         * @memberof network.GameData
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GameData.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.level != null && message.hasOwnProperty("level"))
                if (!$util.isInteger(message.level))
                    return "level: integer expected";
            if (message.score != null && message.hasOwnProperty("score"))
                if (!$util.isInteger(message.score))
                    return "score: integer expected";
            if (message.coin != null && message.hasOwnProperty("coin"))
                if (!$util.isInteger(message.coin))
                    return "coin: integer expected";
            if (message.diamond != null && message.hasOwnProperty("diamond"))
                if (!$util.isInteger(message.diamond))
                    return "diamond: integer expected";
            if (message.items != null && message.hasOwnProperty("items")) {
                if (!Array.isArray(message.items))
                    return "items: array expected";
                for (var i = 0; i < message.items.length; ++i)
                    if (!$util.isInteger(message.items[i]))
                        return "items: integer[] expected";
            }
            return null;
        };

        /**
         * Creates a GameData message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof network.GameData
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {network.GameData} GameData
         */
        GameData.fromObject = function fromObject(object) {
            if (object instanceof $root.network.GameData)
                return object;
            var message = new $root.network.GameData();
            if (object.level != null)
                message.level = object.level | 0;
            if (object.score != null)
                message.score = object.score | 0;
            if (object.coin != null)
                message.coin = object.coin | 0;
            if (object.diamond != null)
                message.diamond = object.diamond | 0;
            if (object.items) {
                if (!Array.isArray(object.items))
                    throw TypeError(".network.GameData.items: array expected");
                message.items = [];
                for (var i = 0; i < object.items.length; ++i)
                    message.items[i] = object.items[i] | 0;
            }
            return message;
        };

        /**
         * Creates a plain object from a GameData message. Also converts values to other types if specified.
         * @function toObject
         * @memberof network.GameData
         * @static
         * @param {network.GameData} message GameData
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GameData.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.items = [];
            if (options.defaults) {
                object.level = 0;
                object.score = 0;
                object.coin = 0;
                object.diamond = 0;
            }
            if (message.level != null && message.hasOwnProperty("level"))
                object.level = message.level;
            if (message.score != null && message.hasOwnProperty("score"))
                object.score = message.score;
            if (message.coin != null && message.hasOwnProperty("coin"))
                object.coin = message.coin;
            if (message.diamond != null && message.hasOwnProperty("diamond"))
                object.diamond = message.diamond;
            if (message.items && message.items.length) {
                object.items = [];
                for (var j = 0; j < message.items.length; ++j)
                    object.items[j] = message.items[j];
            }
            return object;
        };

        /**
         * Converts this GameData to JSON.
         * @function toJSON
         * @memberof network.GameData
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GameData.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for GameData
         * @function getTypeUrl
         * @memberof network.GameData
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        GameData.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/network.GameData";
        };

        return GameData;
    })();

    network.EnterGameRequest = (function() {

        /**
         * Properties of an EnterGameRequest.
         * @memberof network
         * @interface IEnterGameRequest
         * @property {number|null} [levelId] EnterGameRequest levelId
         */

        /**
         * Constructs a new EnterGameRequest.
         * @memberof network
         * @classdesc Represents an EnterGameRequest.
         * @implements IEnterGameRequest
         * @constructor
         * @param {network.IEnterGameRequest=} [properties] Properties to set
         */
        function EnterGameRequest(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * EnterGameRequest levelId.
         * @member {number} levelId
         * @memberof network.EnterGameRequest
         * @instance
         */
        EnterGameRequest.prototype.levelId = 0;

        /**
         * Creates a new EnterGameRequest instance using the specified properties.
         * @function create
         * @memberof network.EnterGameRequest
         * @static
         * @param {network.IEnterGameRequest=} [properties] Properties to set
         * @returns {network.EnterGameRequest} EnterGameRequest instance
         */
        EnterGameRequest.create = function create(properties) {
            return new EnterGameRequest(properties);
        };

        /**
         * Encodes the specified EnterGameRequest message. Does not implicitly {@link network.EnterGameRequest.verify|verify} messages.
         * @function encode
         * @memberof network.EnterGameRequest
         * @static
         * @param {network.IEnterGameRequest} message EnterGameRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EnterGameRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.levelId != null && Object.hasOwnProperty.call(message, "levelId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.levelId);
            return writer;
        };

        /**
         * Encodes the specified EnterGameRequest message, length delimited. Does not implicitly {@link network.EnterGameRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof network.EnterGameRequest
         * @static
         * @param {network.IEnterGameRequest} message EnterGameRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EnterGameRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an EnterGameRequest message from the specified reader or buffer.
         * @function decode
         * @memberof network.EnterGameRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {network.EnterGameRequest} EnterGameRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EnterGameRequest.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.network.EnterGameRequest();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.levelId = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an EnterGameRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof network.EnterGameRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {network.EnterGameRequest} EnterGameRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EnterGameRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an EnterGameRequest message.
         * @function verify
         * @memberof network.EnterGameRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        EnterGameRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.levelId != null && message.hasOwnProperty("levelId"))
                if (!$util.isInteger(message.levelId))
                    return "levelId: integer expected";
            return null;
        };

        /**
         * Creates an EnterGameRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof network.EnterGameRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {network.EnterGameRequest} EnterGameRequest
         */
        EnterGameRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.network.EnterGameRequest)
                return object;
            var message = new $root.network.EnterGameRequest();
            if (object.levelId != null)
                message.levelId = object.levelId | 0;
            return message;
        };

        /**
         * Creates a plain object from an EnterGameRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof network.EnterGameRequest
         * @static
         * @param {network.EnterGameRequest} message EnterGameRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        EnterGameRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.levelId = 0;
            if (message.levelId != null && message.hasOwnProperty("levelId"))
                object.levelId = message.levelId;
            return object;
        };

        /**
         * Converts this EnterGameRequest to JSON.
         * @function toJSON
         * @memberof network.EnterGameRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        EnterGameRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for EnterGameRequest
         * @function getTypeUrl
         * @memberof network.EnterGameRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        EnterGameRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/network.EnterGameRequest";
        };

        return EnterGameRequest;
    })();

    network.EnterGameResponse = (function() {

        /**
         * Properties of an EnterGameResponse.
         * @memberof network
         * @interface IEnterGameResponse
         * @property {network.IGameData|null} [gameData] EnterGameResponse gameData
         * @property {number|Long|null} [startTime] EnterGameResponse startTime
         */

        /**
         * Constructs a new EnterGameResponse.
         * @memberof network
         * @classdesc Represents an EnterGameResponse.
         * @implements IEnterGameResponse
         * @constructor
         * @param {network.IEnterGameResponse=} [properties] Properties to set
         */
        function EnterGameResponse(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * EnterGameResponse gameData.
         * @member {network.IGameData|null|undefined} gameData
         * @memberof network.EnterGameResponse
         * @instance
         */
        EnterGameResponse.prototype.gameData = null;

        /**
         * EnterGameResponse startTime.
         * @member {number|Long} startTime
         * @memberof network.EnterGameResponse
         * @instance
         */
        EnterGameResponse.prototype.startTime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new EnterGameResponse instance using the specified properties.
         * @function create
         * @memberof network.EnterGameResponse
         * @static
         * @param {network.IEnterGameResponse=} [properties] Properties to set
         * @returns {network.EnterGameResponse} EnterGameResponse instance
         */
        EnterGameResponse.create = function create(properties) {
            return new EnterGameResponse(properties);
        };

        /**
         * Encodes the specified EnterGameResponse message. Does not implicitly {@link network.EnterGameResponse.verify|verify} messages.
         * @function encode
         * @memberof network.EnterGameResponse
         * @static
         * @param {network.IEnterGameResponse} message EnterGameResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EnterGameResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.gameData != null && Object.hasOwnProperty.call(message, "gameData"))
                $root.network.GameData.encode(message.gameData, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.startTime != null && Object.hasOwnProperty.call(message, "startTime"))
                writer.uint32(/* id 2, wireType 0 =*/16).int64(message.startTime);
            return writer;
        };

        /**
         * Encodes the specified EnterGameResponse message, length delimited. Does not implicitly {@link network.EnterGameResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof network.EnterGameResponse
         * @static
         * @param {network.IEnterGameResponse} message EnterGameResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EnterGameResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an EnterGameResponse message from the specified reader or buffer.
         * @function decode
         * @memberof network.EnterGameResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {network.EnterGameResponse} EnterGameResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EnterGameResponse.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.network.EnterGameResponse();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.gameData = $root.network.GameData.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        message.startTime = reader.int64();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an EnterGameResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof network.EnterGameResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {network.EnterGameResponse} EnterGameResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EnterGameResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an EnterGameResponse message.
         * @function verify
         * @memberof network.EnterGameResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        EnterGameResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.gameData != null && message.hasOwnProperty("gameData")) {
                var error = $root.network.GameData.verify(message.gameData);
                if (error)
                    return "gameData." + error;
            }
            if (message.startTime != null && message.hasOwnProperty("startTime"))
                if (!$util.isInteger(message.startTime) && !(message.startTime && $util.isInteger(message.startTime.low) && $util.isInteger(message.startTime.high)))
                    return "startTime: integer|Long expected";
            return null;
        };

        /**
         * Creates an EnterGameResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof network.EnterGameResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {network.EnterGameResponse} EnterGameResponse
         */
        EnterGameResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.network.EnterGameResponse)
                return object;
            var message = new $root.network.EnterGameResponse();
            if (object.gameData != null) {
                if (typeof object.gameData !== "object")
                    throw TypeError(".network.EnterGameResponse.gameData: object expected");
                message.gameData = $root.network.GameData.fromObject(object.gameData);
            }
            if (object.startTime != null)
                if ($util.Long)
                    (message.startTime = $util.Long.fromValue(object.startTime)).unsigned = false;
                else if (typeof object.startTime === "string")
                    message.startTime = parseInt(object.startTime, 10);
                else if (typeof object.startTime === "number")
                    message.startTime = object.startTime;
                else if (typeof object.startTime === "object")
                    message.startTime = new $util.LongBits(object.startTime.low >>> 0, object.startTime.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from an EnterGameResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof network.EnterGameResponse
         * @static
         * @param {network.EnterGameResponse} message EnterGameResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        EnterGameResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.gameData = null;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.startTime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.startTime = options.longs === String ? "0" : 0;
            }
            if (message.gameData != null && message.hasOwnProperty("gameData"))
                object.gameData = $root.network.GameData.toObject(message.gameData, options);
            if (message.startTime != null && message.hasOwnProperty("startTime"))
                if (typeof message.startTime === "number")
                    object.startTime = options.longs === String ? String(message.startTime) : message.startTime;
                else
                    object.startTime = options.longs === String ? $util.Long.prototype.toString.call(message.startTime) : options.longs === Number ? new $util.LongBits(message.startTime.low >>> 0, message.startTime.high >>> 0).toNumber() : message.startTime;
            return object;
        };

        /**
         * Converts this EnterGameResponse to JSON.
         * @function toJSON
         * @memberof network.EnterGameResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        EnterGameResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for EnterGameResponse
         * @function getTypeUrl
         * @memberof network.EnterGameResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        EnterGameResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/network.EnterGameResponse";
        };

        return EnterGameResponse;
    })();

    network.GameResult = (function() {

        /**
         * Properties of a GameResult.
         * @memberof network
         * @interface IGameResult
         * @property {number|null} [levelId] GameResult levelId
         * @property {number|null} [score] GameResult score
         * @property {number|null} [duration] GameResult duration
         * @property {boolean|null} [isWin] GameResult isWin
         * @property {Array.<network.IReward>|null} [rewards] GameResult rewards
         */

        /**
         * Constructs a new GameResult.
         * @memberof network
         * @classdesc Represents a GameResult.
         * @implements IGameResult
         * @constructor
         * @param {network.IGameResult=} [properties] Properties to set
         */
        function GameResult(properties) {
            this.rewards = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GameResult levelId.
         * @member {number} levelId
         * @memberof network.GameResult
         * @instance
         */
        GameResult.prototype.levelId = 0;

        /**
         * GameResult score.
         * @member {number} score
         * @memberof network.GameResult
         * @instance
         */
        GameResult.prototype.score = 0;

        /**
         * GameResult duration.
         * @member {number} duration
         * @memberof network.GameResult
         * @instance
         */
        GameResult.prototype.duration = 0;

        /**
         * GameResult isWin.
         * @member {boolean} isWin
         * @memberof network.GameResult
         * @instance
         */
        GameResult.prototype.isWin = false;

        /**
         * GameResult rewards.
         * @member {Array.<network.IReward>} rewards
         * @memberof network.GameResult
         * @instance
         */
        GameResult.prototype.rewards = $util.emptyArray;

        /**
         * Creates a new GameResult instance using the specified properties.
         * @function create
         * @memberof network.GameResult
         * @static
         * @param {network.IGameResult=} [properties] Properties to set
         * @returns {network.GameResult} GameResult instance
         */
        GameResult.create = function create(properties) {
            return new GameResult(properties);
        };

        /**
         * Encodes the specified GameResult message. Does not implicitly {@link network.GameResult.verify|verify} messages.
         * @function encode
         * @memberof network.GameResult
         * @static
         * @param {network.IGameResult} message GameResult message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GameResult.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.levelId != null && Object.hasOwnProperty.call(message, "levelId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.levelId);
            if (message.score != null && Object.hasOwnProperty.call(message, "score"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.score);
            if (message.duration != null && Object.hasOwnProperty.call(message, "duration"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.duration);
            if (message.isWin != null && Object.hasOwnProperty.call(message, "isWin"))
                writer.uint32(/* id 4, wireType 0 =*/32).bool(message.isWin);
            if (message.rewards != null && message.rewards.length)
                for (var i = 0; i < message.rewards.length; ++i)
                    $root.network.Reward.encode(message.rewards[i], writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified GameResult message, length delimited. Does not implicitly {@link network.GameResult.verify|verify} messages.
         * @function encodeDelimited
         * @memberof network.GameResult
         * @static
         * @param {network.IGameResult} message GameResult message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GameResult.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GameResult message from the specified reader or buffer.
         * @function decode
         * @memberof network.GameResult
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {network.GameResult} GameResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GameResult.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.network.GameResult();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.levelId = reader.int32();
                        break;
                    }
                case 2: {
                        message.score = reader.int32();
                        break;
                    }
                case 3: {
                        message.duration = reader.int32();
                        break;
                    }
                case 4: {
                        message.isWin = reader.bool();
                        break;
                    }
                case 5: {
                        if (!(message.rewards && message.rewards.length))
                            message.rewards = [];
                        message.rewards.push($root.network.Reward.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a GameResult message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof network.GameResult
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {network.GameResult} GameResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GameResult.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GameResult message.
         * @function verify
         * @memberof network.GameResult
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GameResult.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.levelId != null && message.hasOwnProperty("levelId"))
                if (!$util.isInteger(message.levelId))
                    return "levelId: integer expected";
            if (message.score != null && message.hasOwnProperty("score"))
                if (!$util.isInteger(message.score))
                    return "score: integer expected";
            if (message.duration != null && message.hasOwnProperty("duration"))
                if (!$util.isInteger(message.duration))
                    return "duration: integer expected";
            if (message.isWin != null && message.hasOwnProperty("isWin"))
                if (typeof message.isWin !== "boolean")
                    return "isWin: boolean expected";
            if (message.rewards != null && message.hasOwnProperty("rewards")) {
                if (!Array.isArray(message.rewards))
                    return "rewards: array expected";
                for (var i = 0; i < message.rewards.length; ++i) {
                    var error = $root.network.Reward.verify(message.rewards[i]);
                    if (error)
                        return "rewards." + error;
                }
            }
            return null;
        };

        /**
         * Creates a GameResult message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof network.GameResult
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {network.GameResult} GameResult
         */
        GameResult.fromObject = function fromObject(object) {
            if (object instanceof $root.network.GameResult)
                return object;
            var message = new $root.network.GameResult();
            if (object.levelId != null)
                message.levelId = object.levelId | 0;
            if (object.score != null)
                message.score = object.score | 0;
            if (object.duration != null)
                message.duration = object.duration | 0;
            if (object.isWin != null)
                message.isWin = Boolean(object.isWin);
            if (object.rewards) {
                if (!Array.isArray(object.rewards))
                    throw TypeError(".network.GameResult.rewards: array expected");
                message.rewards = [];
                for (var i = 0; i < object.rewards.length; ++i) {
                    if (typeof object.rewards[i] !== "object")
                        throw TypeError(".network.GameResult.rewards: object expected");
                    message.rewards[i] = $root.network.Reward.fromObject(object.rewards[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a GameResult message. Also converts values to other types if specified.
         * @function toObject
         * @memberof network.GameResult
         * @static
         * @param {network.GameResult} message GameResult
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GameResult.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.rewards = [];
            if (options.defaults) {
                object.levelId = 0;
                object.score = 0;
                object.duration = 0;
                object.isWin = false;
            }
            if (message.levelId != null && message.hasOwnProperty("levelId"))
                object.levelId = message.levelId;
            if (message.score != null && message.hasOwnProperty("score"))
                object.score = message.score;
            if (message.duration != null && message.hasOwnProperty("duration"))
                object.duration = message.duration;
            if (message.isWin != null && message.hasOwnProperty("isWin"))
                object.isWin = message.isWin;
            if (message.rewards && message.rewards.length) {
                object.rewards = [];
                for (var j = 0; j < message.rewards.length; ++j)
                    object.rewards[j] = $root.network.Reward.toObject(message.rewards[j], options);
            }
            return object;
        };

        /**
         * Converts this GameResult to JSON.
         * @function toJSON
         * @memberof network.GameResult
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GameResult.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for GameResult
         * @function getTypeUrl
         * @memberof network.GameResult
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        GameResult.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/network.GameResult";
        };

        return GameResult;
    })();

    network.Reward = (function() {

        /**
         * Properties of a Reward.
         * @memberof network
         * @interface IReward
         * @property {number|null} [type] Reward type
         * @property {number|null} [itemId] Reward itemId
         * @property {number|null} [count] Reward count
         */

        /**
         * Constructs a new Reward.
         * @memberof network
         * @classdesc Represents a Reward.
         * @implements IReward
         * @constructor
         * @param {network.IReward=} [properties] Properties to set
         */
        function Reward(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Reward type.
         * @member {number} type
         * @memberof network.Reward
         * @instance
         */
        Reward.prototype.type = 0;

        /**
         * Reward itemId.
         * @member {number} itemId
         * @memberof network.Reward
         * @instance
         */
        Reward.prototype.itemId = 0;

        /**
         * Reward count.
         * @member {number} count
         * @memberof network.Reward
         * @instance
         */
        Reward.prototype.count = 0;

        /**
         * Creates a new Reward instance using the specified properties.
         * @function create
         * @memberof network.Reward
         * @static
         * @param {network.IReward=} [properties] Properties to set
         * @returns {network.Reward} Reward instance
         */
        Reward.create = function create(properties) {
            return new Reward(properties);
        };

        /**
         * Encodes the specified Reward message. Does not implicitly {@link network.Reward.verify|verify} messages.
         * @function encode
         * @memberof network.Reward
         * @static
         * @param {network.IReward} message Reward message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Reward.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
            if (message.itemId != null && Object.hasOwnProperty.call(message, "itemId"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.itemId);
            if (message.count != null && Object.hasOwnProperty.call(message, "count"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.count);
            return writer;
        };

        /**
         * Encodes the specified Reward message, length delimited. Does not implicitly {@link network.Reward.verify|verify} messages.
         * @function encodeDelimited
         * @memberof network.Reward
         * @static
         * @param {network.IReward} message Reward message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Reward.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Reward message from the specified reader or buffer.
         * @function decode
         * @memberof network.Reward
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {network.Reward} Reward
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Reward.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.network.Reward();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.type = reader.int32();
                        break;
                    }
                case 2: {
                        message.itemId = reader.int32();
                        break;
                    }
                case 3: {
                        message.count = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Reward message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof network.Reward
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {network.Reward} Reward
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Reward.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Reward message.
         * @function verify
         * @memberof network.Reward
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Reward.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.type != null && message.hasOwnProperty("type"))
                if (!$util.isInteger(message.type))
                    return "type: integer expected";
            if (message.itemId != null && message.hasOwnProperty("itemId"))
                if (!$util.isInteger(message.itemId))
                    return "itemId: integer expected";
            if (message.count != null && message.hasOwnProperty("count"))
                if (!$util.isInteger(message.count))
                    return "count: integer expected";
            return null;
        };

        /**
         * Creates a Reward message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof network.Reward
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {network.Reward} Reward
         */
        Reward.fromObject = function fromObject(object) {
            if (object instanceof $root.network.Reward)
                return object;
            var message = new $root.network.Reward();
            if (object.type != null)
                message.type = object.type | 0;
            if (object.itemId != null)
                message.itemId = object.itemId | 0;
            if (object.count != null)
                message.count = object.count | 0;
            return message;
        };

        /**
         * Creates a plain object from a Reward message. Also converts values to other types if specified.
         * @function toObject
         * @memberof network.Reward
         * @static
         * @param {network.Reward} message Reward
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Reward.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.type = 0;
                object.itemId = 0;
                object.count = 0;
            }
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = message.type;
            if (message.itemId != null && message.hasOwnProperty("itemId"))
                object.itemId = message.itemId;
            if (message.count != null && message.hasOwnProperty("count"))
                object.count = message.count;
            return object;
        };

        /**
         * Converts this Reward to JSON.
         * @function toJSON
         * @memberof network.Reward
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Reward.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Reward
         * @function getTypeUrl
         * @memberof network.Reward
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Reward.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/network.Reward";
        };

        return Reward;
    })();

    network.SubmitGameResultRequest = (function() {

        /**
         * Properties of a SubmitGameResultRequest.
         * @memberof network
         * @interface ISubmitGameResultRequest
         * @property {network.IGameResult|null} [result] SubmitGameResultRequest result
         * @property {string|null} [signature] SubmitGameResultRequest signature
         */

        /**
         * Constructs a new SubmitGameResultRequest.
         * @memberof network
         * @classdesc Represents a SubmitGameResultRequest.
         * @implements ISubmitGameResultRequest
         * @constructor
         * @param {network.ISubmitGameResultRequest=} [properties] Properties to set
         */
        function SubmitGameResultRequest(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SubmitGameResultRequest result.
         * @member {network.IGameResult|null|undefined} result
         * @memberof network.SubmitGameResultRequest
         * @instance
         */
        SubmitGameResultRequest.prototype.result = null;

        /**
         * SubmitGameResultRequest signature.
         * @member {string} signature
         * @memberof network.SubmitGameResultRequest
         * @instance
         */
        SubmitGameResultRequest.prototype.signature = "";

        /**
         * Creates a new SubmitGameResultRequest instance using the specified properties.
         * @function create
         * @memberof network.SubmitGameResultRequest
         * @static
         * @param {network.ISubmitGameResultRequest=} [properties] Properties to set
         * @returns {network.SubmitGameResultRequest} SubmitGameResultRequest instance
         */
        SubmitGameResultRequest.create = function create(properties) {
            return new SubmitGameResultRequest(properties);
        };

        /**
         * Encodes the specified SubmitGameResultRequest message. Does not implicitly {@link network.SubmitGameResultRequest.verify|verify} messages.
         * @function encode
         * @memberof network.SubmitGameResultRequest
         * @static
         * @param {network.ISubmitGameResultRequest} message SubmitGameResultRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SubmitGameResultRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.result != null && Object.hasOwnProperty.call(message, "result"))
                $root.network.GameResult.encode(message.result, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.signature != null && Object.hasOwnProperty.call(message, "signature"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.signature);
            return writer;
        };

        /**
         * Encodes the specified SubmitGameResultRequest message, length delimited. Does not implicitly {@link network.SubmitGameResultRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof network.SubmitGameResultRequest
         * @static
         * @param {network.ISubmitGameResultRequest} message SubmitGameResultRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SubmitGameResultRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SubmitGameResultRequest message from the specified reader or buffer.
         * @function decode
         * @memberof network.SubmitGameResultRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {network.SubmitGameResultRequest} SubmitGameResultRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SubmitGameResultRequest.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.network.SubmitGameResultRequest();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.result = $root.network.GameResult.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        message.signature = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SubmitGameResultRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof network.SubmitGameResultRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {network.SubmitGameResultRequest} SubmitGameResultRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SubmitGameResultRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SubmitGameResultRequest message.
         * @function verify
         * @memberof network.SubmitGameResultRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SubmitGameResultRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.result != null && message.hasOwnProperty("result")) {
                var error = $root.network.GameResult.verify(message.result);
                if (error)
                    return "result." + error;
            }
            if (message.signature != null && message.hasOwnProperty("signature"))
                if (!$util.isString(message.signature))
                    return "signature: string expected";
            return null;
        };

        /**
         * Creates a SubmitGameResultRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof network.SubmitGameResultRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {network.SubmitGameResultRequest} SubmitGameResultRequest
         */
        SubmitGameResultRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.network.SubmitGameResultRequest)
                return object;
            var message = new $root.network.SubmitGameResultRequest();
            if (object.result != null) {
                if (typeof object.result !== "object")
                    throw TypeError(".network.SubmitGameResultRequest.result: object expected");
                message.result = $root.network.GameResult.fromObject(object.result);
            }
            if (object.signature != null)
                message.signature = String(object.signature);
            return message;
        };

        /**
         * Creates a plain object from a SubmitGameResultRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof network.SubmitGameResultRequest
         * @static
         * @param {network.SubmitGameResultRequest} message SubmitGameResultRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SubmitGameResultRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.result = null;
                object.signature = "";
            }
            if (message.result != null && message.hasOwnProperty("result"))
                object.result = $root.network.GameResult.toObject(message.result, options);
            if (message.signature != null && message.hasOwnProperty("signature"))
                object.signature = message.signature;
            return object;
        };

        /**
         * Converts this SubmitGameResultRequest to JSON.
         * @function toJSON
         * @memberof network.SubmitGameResultRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SubmitGameResultRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for SubmitGameResultRequest
         * @function getTypeUrl
         * @memberof network.SubmitGameResultRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        SubmitGameResultRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/network.SubmitGameResultRequest";
        };

        return SubmitGameResultRequest;
    })();

    network.SubmitGameResultResponse = (function() {

        /**
         * Properties of a SubmitGameResultResponse.
         * @memberof network
         * @interface ISubmitGameResultResponse
         * @property {network.IGameData|null} [gameData] SubmitGameResultResponse gameData
         * @property {Array.<network.IReward>|null} [rewards] SubmitGameResultResponse rewards
         */

        /**
         * Constructs a new SubmitGameResultResponse.
         * @memberof network
         * @classdesc Represents a SubmitGameResultResponse.
         * @implements ISubmitGameResultResponse
         * @constructor
         * @param {network.ISubmitGameResultResponse=} [properties] Properties to set
         */
        function SubmitGameResultResponse(properties) {
            this.rewards = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SubmitGameResultResponse gameData.
         * @member {network.IGameData|null|undefined} gameData
         * @memberof network.SubmitGameResultResponse
         * @instance
         */
        SubmitGameResultResponse.prototype.gameData = null;

        /**
         * SubmitGameResultResponse rewards.
         * @member {Array.<network.IReward>} rewards
         * @memberof network.SubmitGameResultResponse
         * @instance
         */
        SubmitGameResultResponse.prototype.rewards = $util.emptyArray;

        /**
         * Creates a new SubmitGameResultResponse instance using the specified properties.
         * @function create
         * @memberof network.SubmitGameResultResponse
         * @static
         * @param {network.ISubmitGameResultResponse=} [properties] Properties to set
         * @returns {network.SubmitGameResultResponse} SubmitGameResultResponse instance
         */
        SubmitGameResultResponse.create = function create(properties) {
            return new SubmitGameResultResponse(properties);
        };

        /**
         * Encodes the specified SubmitGameResultResponse message. Does not implicitly {@link network.SubmitGameResultResponse.verify|verify} messages.
         * @function encode
         * @memberof network.SubmitGameResultResponse
         * @static
         * @param {network.ISubmitGameResultResponse} message SubmitGameResultResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SubmitGameResultResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.gameData != null && Object.hasOwnProperty.call(message, "gameData"))
                $root.network.GameData.encode(message.gameData, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.rewards != null && message.rewards.length)
                for (var i = 0; i < message.rewards.length; ++i)
                    $root.network.Reward.encode(message.rewards[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified SubmitGameResultResponse message, length delimited. Does not implicitly {@link network.SubmitGameResultResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof network.SubmitGameResultResponse
         * @static
         * @param {network.ISubmitGameResultResponse} message SubmitGameResultResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SubmitGameResultResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SubmitGameResultResponse message from the specified reader or buffer.
         * @function decode
         * @memberof network.SubmitGameResultResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {network.SubmitGameResultResponse} SubmitGameResultResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SubmitGameResultResponse.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.network.SubmitGameResultResponse();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.gameData = $root.network.GameData.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        if (!(message.rewards && message.rewards.length))
                            message.rewards = [];
                        message.rewards.push($root.network.Reward.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SubmitGameResultResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof network.SubmitGameResultResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {network.SubmitGameResultResponse} SubmitGameResultResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SubmitGameResultResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SubmitGameResultResponse message.
         * @function verify
         * @memberof network.SubmitGameResultResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SubmitGameResultResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.gameData != null && message.hasOwnProperty("gameData")) {
                var error = $root.network.GameData.verify(message.gameData);
                if (error)
                    return "gameData." + error;
            }
            if (message.rewards != null && message.hasOwnProperty("rewards")) {
                if (!Array.isArray(message.rewards))
                    return "rewards: array expected";
                for (var i = 0; i < message.rewards.length; ++i) {
                    var error = $root.network.Reward.verify(message.rewards[i]);
                    if (error)
                        return "rewards." + error;
                }
            }
            return null;
        };

        /**
         * Creates a SubmitGameResultResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof network.SubmitGameResultResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {network.SubmitGameResultResponse} SubmitGameResultResponse
         */
        SubmitGameResultResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.network.SubmitGameResultResponse)
                return object;
            var message = new $root.network.SubmitGameResultResponse();
            if (object.gameData != null) {
                if (typeof object.gameData !== "object")
                    throw TypeError(".network.SubmitGameResultResponse.gameData: object expected");
                message.gameData = $root.network.GameData.fromObject(object.gameData);
            }
            if (object.rewards) {
                if (!Array.isArray(object.rewards))
                    throw TypeError(".network.SubmitGameResultResponse.rewards: array expected");
                message.rewards = [];
                for (var i = 0; i < object.rewards.length; ++i) {
                    if (typeof object.rewards[i] !== "object")
                        throw TypeError(".network.SubmitGameResultResponse.rewards: object expected");
                    message.rewards[i] = $root.network.Reward.fromObject(object.rewards[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a SubmitGameResultResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof network.SubmitGameResultResponse
         * @static
         * @param {network.SubmitGameResultResponse} message SubmitGameResultResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SubmitGameResultResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.rewards = [];
            if (options.defaults)
                object.gameData = null;
            if (message.gameData != null && message.hasOwnProperty("gameData"))
                object.gameData = $root.network.GameData.toObject(message.gameData, options);
            if (message.rewards && message.rewards.length) {
                object.rewards = [];
                for (var j = 0; j < message.rewards.length; ++j)
                    object.rewards[j] = $root.network.Reward.toObject(message.rewards[j], options);
            }
            return object;
        };

        /**
         * Converts this SubmitGameResultResponse to JSON.
         * @function toJSON
         * @memberof network.SubmitGameResultResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SubmitGameResultResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for SubmitGameResultResponse
         * @function getTypeUrl
         * @memberof network.SubmitGameResultResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        SubmitGameResultResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/network.SubmitGameResultResponse";
        };

        return SubmitGameResultResponse;
    })();

    network.UserInfo = (function() {

        /**
         * Properties of a UserInfo.
         * @memberof network
         * @interface IUserInfo
         * @property {number|Long|null} [userId] UserInfo userId
         * @property {string|null} [username] UserInfo username
         * @property {string|null} [nickname] UserInfo nickname
         * @property {number|null} [level] UserInfo level
         * @property {number|Long|null} [exp] UserInfo exp
         * @property {string|null} [avatar] UserInfo avatar
         * @property {number|Long|null} [createdAt] UserInfo createdAt
         */

        /**
         * Constructs a new UserInfo.
         * @memberof network
         * @classdesc Represents a UserInfo.
         * @implements IUserInfo
         * @constructor
         * @param {network.IUserInfo=} [properties] Properties to set
         */
        function UserInfo(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * UserInfo userId.
         * @member {number|Long} userId
         * @memberof network.UserInfo
         * @instance
         */
        UserInfo.prototype.userId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * UserInfo username.
         * @member {string} username
         * @memberof network.UserInfo
         * @instance
         */
        UserInfo.prototype.username = "";

        /**
         * UserInfo nickname.
         * @member {string} nickname
         * @memberof network.UserInfo
         * @instance
         */
        UserInfo.prototype.nickname = "";

        /**
         * UserInfo level.
         * @member {number} level
         * @memberof network.UserInfo
         * @instance
         */
        UserInfo.prototype.level = 0;

        /**
         * UserInfo exp.
         * @member {number|Long} exp
         * @memberof network.UserInfo
         * @instance
         */
        UserInfo.prototype.exp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * UserInfo avatar.
         * @member {string} avatar
         * @memberof network.UserInfo
         * @instance
         */
        UserInfo.prototype.avatar = "";

        /**
         * UserInfo createdAt.
         * @member {number|Long} createdAt
         * @memberof network.UserInfo
         * @instance
         */
        UserInfo.prototype.createdAt = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new UserInfo instance using the specified properties.
         * @function create
         * @memberof network.UserInfo
         * @static
         * @param {network.IUserInfo=} [properties] Properties to set
         * @returns {network.UserInfo} UserInfo instance
         */
        UserInfo.create = function create(properties) {
            return new UserInfo(properties);
        };

        /**
         * Encodes the specified UserInfo message. Does not implicitly {@link network.UserInfo.verify|verify} messages.
         * @function encode
         * @memberof network.UserInfo
         * @static
         * @param {network.IUserInfo} message UserInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UserInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.userId != null && Object.hasOwnProperty.call(message, "userId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int64(message.userId);
            if (message.username != null && Object.hasOwnProperty.call(message, "username"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.username);
            if (message.nickname != null && Object.hasOwnProperty.call(message, "nickname"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.nickname);
            if (message.level != null && Object.hasOwnProperty.call(message, "level"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.level);
            if (message.exp != null && Object.hasOwnProperty.call(message, "exp"))
                writer.uint32(/* id 5, wireType 0 =*/40).int64(message.exp);
            if (message.avatar != null && Object.hasOwnProperty.call(message, "avatar"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.avatar);
            if (message.createdAt != null && Object.hasOwnProperty.call(message, "createdAt"))
                writer.uint32(/* id 7, wireType 0 =*/56).int64(message.createdAt);
            return writer;
        };

        /**
         * Encodes the specified UserInfo message, length delimited. Does not implicitly {@link network.UserInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof network.UserInfo
         * @static
         * @param {network.IUserInfo} message UserInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UserInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a UserInfo message from the specified reader or buffer.
         * @function decode
         * @memberof network.UserInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {network.UserInfo} UserInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UserInfo.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.network.UserInfo();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.userId = reader.int64();
                        break;
                    }
                case 2: {
                        message.username = reader.string();
                        break;
                    }
                case 3: {
                        message.nickname = reader.string();
                        break;
                    }
                case 4: {
                        message.level = reader.int32();
                        break;
                    }
                case 5: {
                        message.exp = reader.int64();
                        break;
                    }
                case 6: {
                        message.avatar = reader.string();
                        break;
                    }
                case 7: {
                        message.createdAt = reader.int64();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a UserInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof network.UserInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {network.UserInfo} UserInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UserInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a UserInfo message.
         * @function verify
         * @memberof network.UserInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        UserInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.userId != null && message.hasOwnProperty("userId"))
                if (!$util.isInteger(message.userId) && !(message.userId && $util.isInteger(message.userId.low) && $util.isInteger(message.userId.high)))
                    return "userId: integer|Long expected";
            if (message.username != null && message.hasOwnProperty("username"))
                if (!$util.isString(message.username))
                    return "username: string expected";
            if (message.nickname != null && message.hasOwnProperty("nickname"))
                if (!$util.isString(message.nickname))
                    return "nickname: string expected";
            if (message.level != null && message.hasOwnProperty("level"))
                if (!$util.isInteger(message.level))
                    return "level: integer expected";
            if (message.exp != null && message.hasOwnProperty("exp"))
                if (!$util.isInteger(message.exp) && !(message.exp && $util.isInteger(message.exp.low) && $util.isInteger(message.exp.high)))
                    return "exp: integer|Long expected";
            if (message.avatar != null && message.hasOwnProperty("avatar"))
                if (!$util.isString(message.avatar))
                    return "avatar: string expected";
            if (message.createdAt != null && message.hasOwnProperty("createdAt"))
                if (!$util.isInteger(message.createdAt) && !(message.createdAt && $util.isInteger(message.createdAt.low) && $util.isInteger(message.createdAt.high)))
                    return "createdAt: integer|Long expected";
            return null;
        };

        /**
         * Creates a UserInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof network.UserInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {network.UserInfo} UserInfo
         */
        UserInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.network.UserInfo)
                return object;
            var message = new $root.network.UserInfo();
            if (object.userId != null)
                if ($util.Long)
                    (message.userId = $util.Long.fromValue(object.userId)).unsigned = false;
                else if (typeof object.userId === "string")
                    message.userId = parseInt(object.userId, 10);
                else if (typeof object.userId === "number")
                    message.userId = object.userId;
                else if (typeof object.userId === "object")
                    message.userId = new $util.LongBits(object.userId.low >>> 0, object.userId.high >>> 0).toNumber();
            if (object.username != null)
                message.username = String(object.username);
            if (object.nickname != null)
                message.nickname = String(object.nickname);
            if (object.level != null)
                message.level = object.level | 0;
            if (object.exp != null)
                if ($util.Long)
                    (message.exp = $util.Long.fromValue(object.exp)).unsigned = false;
                else if (typeof object.exp === "string")
                    message.exp = parseInt(object.exp, 10);
                else if (typeof object.exp === "number")
                    message.exp = object.exp;
                else if (typeof object.exp === "object")
                    message.exp = new $util.LongBits(object.exp.low >>> 0, object.exp.high >>> 0).toNumber();
            if (object.avatar != null)
                message.avatar = String(object.avatar);
            if (object.createdAt != null)
                if ($util.Long)
                    (message.createdAt = $util.Long.fromValue(object.createdAt)).unsigned = false;
                else if (typeof object.createdAt === "string")
                    message.createdAt = parseInt(object.createdAt, 10);
                else if (typeof object.createdAt === "number")
                    message.createdAt = object.createdAt;
                else if (typeof object.createdAt === "object")
                    message.createdAt = new $util.LongBits(object.createdAt.low >>> 0, object.createdAt.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a UserInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof network.UserInfo
         * @static
         * @param {network.UserInfo} message UserInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        UserInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.userId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.userId = options.longs === String ? "0" : 0;
                object.username = "";
                object.nickname = "";
                object.level = 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.exp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.exp = options.longs === String ? "0" : 0;
                object.avatar = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.createdAt = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.createdAt = options.longs === String ? "0" : 0;
            }
            if (message.userId != null && message.hasOwnProperty("userId"))
                if (typeof message.userId === "number")
                    object.userId = options.longs === String ? String(message.userId) : message.userId;
                else
                    object.userId = options.longs === String ? $util.Long.prototype.toString.call(message.userId) : options.longs === Number ? new $util.LongBits(message.userId.low >>> 0, message.userId.high >>> 0).toNumber() : message.userId;
            if (message.username != null && message.hasOwnProperty("username"))
                object.username = message.username;
            if (message.nickname != null && message.hasOwnProperty("nickname"))
                object.nickname = message.nickname;
            if (message.level != null && message.hasOwnProperty("level"))
                object.level = message.level;
            if (message.exp != null && message.hasOwnProperty("exp"))
                if (typeof message.exp === "number")
                    object.exp = options.longs === String ? String(message.exp) : message.exp;
                else
                    object.exp = options.longs === String ? $util.Long.prototype.toString.call(message.exp) : options.longs === Number ? new $util.LongBits(message.exp.low >>> 0, message.exp.high >>> 0).toNumber() : message.exp;
            if (message.avatar != null && message.hasOwnProperty("avatar"))
                object.avatar = message.avatar;
            if (message.createdAt != null && message.hasOwnProperty("createdAt"))
                if (typeof message.createdAt === "number")
                    object.createdAt = options.longs === String ? String(message.createdAt) : message.createdAt;
                else
                    object.createdAt = options.longs === String ? $util.Long.prototype.toString.call(message.createdAt) : options.longs === Number ? new $util.LongBits(message.createdAt.low >>> 0, message.createdAt.high >>> 0).toNumber() : message.createdAt;
            return object;
        };

        /**
         * Converts this UserInfo to JSON.
         * @function toJSON
         * @memberof network.UserInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        UserInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for UserInfo
         * @function getTypeUrl
         * @memberof network.UserInfo
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        UserInfo.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/network.UserInfo";
        };

        return UserInfo;
    })();

    network.LoginRequest = (function() {

        /**
         * Properties of a LoginRequest.
         * @memberof network
         * @interface ILoginRequest
         * @property {string|null} [username] LoginRequest username
         * @property {string|null} [password] LoginRequest password
         * @property {string|null} [deviceId] LoginRequest deviceId
         */

        /**
         * Constructs a new LoginRequest.
         * @memberof network
         * @classdesc Represents a LoginRequest.
         * @implements ILoginRequest
         * @constructor
         * @param {network.ILoginRequest=} [properties] Properties to set
         */
        function LoginRequest(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * LoginRequest username.
         * @member {string} username
         * @memberof network.LoginRequest
         * @instance
         */
        LoginRequest.prototype.username = "";

        /**
         * LoginRequest password.
         * @member {string} password
         * @memberof network.LoginRequest
         * @instance
         */
        LoginRequest.prototype.password = "";

        /**
         * LoginRequest deviceId.
         * @member {string} deviceId
         * @memberof network.LoginRequest
         * @instance
         */
        LoginRequest.prototype.deviceId = "";

        /**
         * Creates a new LoginRequest instance using the specified properties.
         * @function create
         * @memberof network.LoginRequest
         * @static
         * @param {network.ILoginRequest=} [properties] Properties to set
         * @returns {network.LoginRequest} LoginRequest instance
         */
        LoginRequest.create = function create(properties) {
            return new LoginRequest(properties);
        };

        /**
         * Encodes the specified LoginRequest message. Does not implicitly {@link network.LoginRequest.verify|verify} messages.
         * @function encode
         * @memberof network.LoginRequest
         * @static
         * @param {network.ILoginRequest} message LoginRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LoginRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.username != null && Object.hasOwnProperty.call(message, "username"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.username);
            if (message.password != null && Object.hasOwnProperty.call(message, "password"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.password);
            if (message.deviceId != null && Object.hasOwnProperty.call(message, "deviceId"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.deviceId);
            return writer;
        };

        /**
         * Encodes the specified LoginRequest message, length delimited. Does not implicitly {@link network.LoginRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof network.LoginRequest
         * @static
         * @param {network.ILoginRequest} message LoginRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LoginRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a LoginRequest message from the specified reader or buffer.
         * @function decode
         * @memberof network.LoginRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {network.LoginRequest} LoginRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LoginRequest.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.network.LoginRequest();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.username = reader.string();
                        break;
                    }
                case 2: {
                        message.password = reader.string();
                        break;
                    }
                case 3: {
                        message.deviceId = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a LoginRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof network.LoginRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {network.LoginRequest} LoginRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LoginRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a LoginRequest message.
         * @function verify
         * @memberof network.LoginRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        LoginRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.username != null && message.hasOwnProperty("username"))
                if (!$util.isString(message.username))
                    return "username: string expected";
            if (message.password != null && message.hasOwnProperty("password"))
                if (!$util.isString(message.password))
                    return "password: string expected";
            if (message.deviceId != null && message.hasOwnProperty("deviceId"))
                if (!$util.isString(message.deviceId))
                    return "deviceId: string expected";
            return null;
        };

        /**
         * Creates a LoginRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof network.LoginRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {network.LoginRequest} LoginRequest
         */
        LoginRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.network.LoginRequest)
                return object;
            var message = new $root.network.LoginRequest();
            if (object.username != null)
                message.username = String(object.username);
            if (object.password != null)
                message.password = String(object.password);
            if (object.deviceId != null)
                message.deviceId = String(object.deviceId);
            return message;
        };

        /**
         * Creates a plain object from a LoginRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof network.LoginRequest
         * @static
         * @param {network.LoginRequest} message LoginRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        LoginRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.username = "";
                object.password = "";
                object.deviceId = "";
            }
            if (message.username != null && message.hasOwnProperty("username"))
                object.username = message.username;
            if (message.password != null && message.hasOwnProperty("password"))
                object.password = message.password;
            if (message.deviceId != null && message.hasOwnProperty("deviceId"))
                object.deviceId = message.deviceId;
            return object;
        };

        /**
         * Converts this LoginRequest to JSON.
         * @function toJSON
         * @memberof network.LoginRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        LoginRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for LoginRequest
         * @function getTypeUrl
         * @memberof network.LoginRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        LoginRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/network.LoginRequest";
        };

        return LoginRequest;
    })();

    network.LoginResponse = (function() {

        /**
         * Properties of a LoginResponse.
         * @memberof network
         * @interface ILoginResponse
         * @property {string|null} [token] LoginResponse token
         * @property {network.IUserInfo|null} [userInfo] LoginResponse userInfo
         * @property {number|Long|null} [expireTime] LoginResponse expireTime
         */

        /**
         * Constructs a new LoginResponse.
         * @memberof network
         * @classdesc Represents a LoginResponse.
         * @implements ILoginResponse
         * @constructor
         * @param {network.ILoginResponse=} [properties] Properties to set
         */
        function LoginResponse(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * LoginResponse token.
         * @member {string} token
         * @memberof network.LoginResponse
         * @instance
         */
        LoginResponse.prototype.token = "";

        /**
         * LoginResponse userInfo.
         * @member {network.IUserInfo|null|undefined} userInfo
         * @memberof network.LoginResponse
         * @instance
         */
        LoginResponse.prototype.userInfo = null;

        /**
         * LoginResponse expireTime.
         * @member {number|Long} expireTime
         * @memberof network.LoginResponse
         * @instance
         */
        LoginResponse.prototype.expireTime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new LoginResponse instance using the specified properties.
         * @function create
         * @memberof network.LoginResponse
         * @static
         * @param {network.ILoginResponse=} [properties] Properties to set
         * @returns {network.LoginResponse} LoginResponse instance
         */
        LoginResponse.create = function create(properties) {
            return new LoginResponse(properties);
        };

        /**
         * Encodes the specified LoginResponse message. Does not implicitly {@link network.LoginResponse.verify|verify} messages.
         * @function encode
         * @memberof network.LoginResponse
         * @static
         * @param {network.ILoginResponse} message LoginResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LoginResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.token != null && Object.hasOwnProperty.call(message, "token"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.token);
            if (message.userInfo != null && Object.hasOwnProperty.call(message, "userInfo"))
                $root.network.UserInfo.encode(message.userInfo, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.expireTime != null && Object.hasOwnProperty.call(message, "expireTime"))
                writer.uint32(/* id 3, wireType 0 =*/24).int64(message.expireTime);
            return writer;
        };

        /**
         * Encodes the specified LoginResponse message, length delimited. Does not implicitly {@link network.LoginResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof network.LoginResponse
         * @static
         * @param {network.ILoginResponse} message LoginResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LoginResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a LoginResponse message from the specified reader or buffer.
         * @function decode
         * @memberof network.LoginResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {network.LoginResponse} LoginResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LoginResponse.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.network.LoginResponse();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.token = reader.string();
                        break;
                    }
                case 2: {
                        message.userInfo = $root.network.UserInfo.decode(reader, reader.uint32());
                        break;
                    }
                case 3: {
                        message.expireTime = reader.int64();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a LoginResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof network.LoginResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {network.LoginResponse} LoginResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LoginResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a LoginResponse message.
         * @function verify
         * @memberof network.LoginResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        LoginResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.token != null && message.hasOwnProperty("token"))
                if (!$util.isString(message.token))
                    return "token: string expected";
            if (message.userInfo != null && message.hasOwnProperty("userInfo")) {
                var error = $root.network.UserInfo.verify(message.userInfo);
                if (error)
                    return "userInfo." + error;
            }
            if (message.expireTime != null && message.hasOwnProperty("expireTime"))
                if (!$util.isInteger(message.expireTime) && !(message.expireTime && $util.isInteger(message.expireTime.low) && $util.isInteger(message.expireTime.high)))
                    return "expireTime: integer|Long expected";
            return null;
        };

        /**
         * Creates a LoginResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof network.LoginResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {network.LoginResponse} LoginResponse
         */
        LoginResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.network.LoginResponse)
                return object;
            var message = new $root.network.LoginResponse();
            if (object.token != null)
                message.token = String(object.token);
            if (object.userInfo != null) {
                if (typeof object.userInfo !== "object")
                    throw TypeError(".network.LoginResponse.userInfo: object expected");
                message.userInfo = $root.network.UserInfo.fromObject(object.userInfo);
            }
            if (object.expireTime != null)
                if ($util.Long)
                    (message.expireTime = $util.Long.fromValue(object.expireTime)).unsigned = false;
                else if (typeof object.expireTime === "string")
                    message.expireTime = parseInt(object.expireTime, 10);
                else if (typeof object.expireTime === "number")
                    message.expireTime = object.expireTime;
                else if (typeof object.expireTime === "object")
                    message.expireTime = new $util.LongBits(object.expireTime.low >>> 0, object.expireTime.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a LoginResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof network.LoginResponse
         * @static
         * @param {network.LoginResponse} message LoginResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        LoginResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.token = "";
                object.userInfo = null;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.expireTime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.expireTime = options.longs === String ? "0" : 0;
            }
            if (message.token != null && message.hasOwnProperty("token"))
                object.token = message.token;
            if (message.userInfo != null && message.hasOwnProperty("userInfo"))
                object.userInfo = $root.network.UserInfo.toObject(message.userInfo, options);
            if (message.expireTime != null && message.hasOwnProperty("expireTime"))
                if (typeof message.expireTime === "number")
                    object.expireTime = options.longs === String ? String(message.expireTime) : message.expireTime;
                else
                    object.expireTime = options.longs === String ? $util.Long.prototype.toString.call(message.expireTime) : options.longs === Number ? new $util.LongBits(message.expireTime.low >>> 0, message.expireTime.high >>> 0).toNumber() : message.expireTime;
            return object;
        };

        /**
         * Converts this LoginResponse to JSON.
         * @function toJSON
         * @memberof network.LoginResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        LoginResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for LoginResponse
         * @function getTypeUrl
         * @memberof network.LoginResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        LoginResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/network.LoginResponse";
        };

        return LoginResponse;
    })();

    network.GetUserInfoRequest = (function() {

        /**
         * Properties of a GetUserInfoRequest.
         * @memberof network
         * @interface IGetUserInfoRequest
         * @property {number|Long|null} [userId] GetUserInfoRequest userId
         */

        /**
         * Constructs a new GetUserInfoRequest.
         * @memberof network
         * @classdesc Represents a GetUserInfoRequest.
         * @implements IGetUserInfoRequest
         * @constructor
         * @param {network.IGetUserInfoRequest=} [properties] Properties to set
         */
        function GetUserInfoRequest(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GetUserInfoRequest userId.
         * @member {number|Long} userId
         * @memberof network.GetUserInfoRequest
         * @instance
         */
        GetUserInfoRequest.prototype.userId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new GetUserInfoRequest instance using the specified properties.
         * @function create
         * @memberof network.GetUserInfoRequest
         * @static
         * @param {network.IGetUserInfoRequest=} [properties] Properties to set
         * @returns {network.GetUserInfoRequest} GetUserInfoRequest instance
         */
        GetUserInfoRequest.create = function create(properties) {
            return new GetUserInfoRequest(properties);
        };

        /**
         * Encodes the specified GetUserInfoRequest message. Does not implicitly {@link network.GetUserInfoRequest.verify|verify} messages.
         * @function encode
         * @memberof network.GetUserInfoRequest
         * @static
         * @param {network.IGetUserInfoRequest} message GetUserInfoRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetUserInfoRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.userId != null && Object.hasOwnProperty.call(message, "userId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int64(message.userId);
            return writer;
        };

        /**
         * Encodes the specified GetUserInfoRequest message, length delimited. Does not implicitly {@link network.GetUserInfoRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof network.GetUserInfoRequest
         * @static
         * @param {network.IGetUserInfoRequest} message GetUserInfoRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetUserInfoRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GetUserInfoRequest message from the specified reader or buffer.
         * @function decode
         * @memberof network.GetUserInfoRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {network.GetUserInfoRequest} GetUserInfoRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetUserInfoRequest.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.network.GetUserInfoRequest();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.userId = reader.int64();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a GetUserInfoRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof network.GetUserInfoRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {network.GetUserInfoRequest} GetUserInfoRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetUserInfoRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GetUserInfoRequest message.
         * @function verify
         * @memberof network.GetUserInfoRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GetUserInfoRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.userId != null && message.hasOwnProperty("userId"))
                if (!$util.isInteger(message.userId) && !(message.userId && $util.isInteger(message.userId.low) && $util.isInteger(message.userId.high)))
                    return "userId: integer|Long expected";
            return null;
        };

        /**
         * Creates a GetUserInfoRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof network.GetUserInfoRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {network.GetUserInfoRequest} GetUserInfoRequest
         */
        GetUserInfoRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.network.GetUserInfoRequest)
                return object;
            var message = new $root.network.GetUserInfoRequest();
            if (object.userId != null)
                if ($util.Long)
                    (message.userId = $util.Long.fromValue(object.userId)).unsigned = false;
                else if (typeof object.userId === "string")
                    message.userId = parseInt(object.userId, 10);
                else if (typeof object.userId === "number")
                    message.userId = object.userId;
                else if (typeof object.userId === "object")
                    message.userId = new $util.LongBits(object.userId.low >>> 0, object.userId.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a GetUserInfoRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof network.GetUserInfoRequest
         * @static
         * @param {network.GetUserInfoRequest} message GetUserInfoRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GetUserInfoRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.userId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.userId = options.longs === String ? "0" : 0;
            if (message.userId != null && message.hasOwnProperty("userId"))
                if (typeof message.userId === "number")
                    object.userId = options.longs === String ? String(message.userId) : message.userId;
                else
                    object.userId = options.longs === String ? $util.Long.prototype.toString.call(message.userId) : options.longs === Number ? new $util.LongBits(message.userId.low >>> 0, message.userId.high >>> 0).toNumber() : message.userId;
            return object;
        };

        /**
         * Converts this GetUserInfoRequest to JSON.
         * @function toJSON
         * @memberof network.GetUserInfoRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GetUserInfoRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for GetUserInfoRequest
         * @function getTypeUrl
         * @memberof network.GetUserInfoRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        GetUserInfoRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/network.GetUserInfoRequest";
        };

        return GetUserInfoRequest;
    })();

    network.GetUserInfoResponse = (function() {

        /**
         * Properties of a GetUserInfoResponse.
         * @memberof network
         * @interface IGetUserInfoResponse
         * @property {network.IUserInfo|null} [userInfo] GetUserInfoResponse userInfo
         */

        /**
         * Constructs a new GetUserInfoResponse.
         * @memberof network
         * @classdesc Represents a GetUserInfoResponse.
         * @implements IGetUserInfoResponse
         * @constructor
         * @param {network.IGetUserInfoResponse=} [properties] Properties to set
         */
        function GetUserInfoResponse(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GetUserInfoResponse userInfo.
         * @member {network.IUserInfo|null|undefined} userInfo
         * @memberof network.GetUserInfoResponse
         * @instance
         */
        GetUserInfoResponse.prototype.userInfo = null;

        /**
         * Creates a new GetUserInfoResponse instance using the specified properties.
         * @function create
         * @memberof network.GetUserInfoResponse
         * @static
         * @param {network.IGetUserInfoResponse=} [properties] Properties to set
         * @returns {network.GetUserInfoResponse} GetUserInfoResponse instance
         */
        GetUserInfoResponse.create = function create(properties) {
            return new GetUserInfoResponse(properties);
        };

        /**
         * Encodes the specified GetUserInfoResponse message. Does not implicitly {@link network.GetUserInfoResponse.verify|verify} messages.
         * @function encode
         * @memberof network.GetUserInfoResponse
         * @static
         * @param {network.IGetUserInfoResponse} message GetUserInfoResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetUserInfoResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.userInfo != null && Object.hasOwnProperty.call(message, "userInfo"))
                $root.network.UserInfo.encode(message.userInfo, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified GetUserInfoResponse message, length delimited. Does not implicitly {@link network.GetUserInfoResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof network.GetUserInfoResponse
         * @static
         * @param {network.IGetUserInfoResponse} message GetUserInfoResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetUserInfoResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GetUserInfoResponse message from the specified reader or buffer.
         * @function decode
         * @memberof network.GetUserInfoResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {network.GetUserInfoResponse} GetUserInfoResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetUserInfoResponse.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.network.GetUserInfoResponse();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.userInfo = $root.network.UserInfo.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a GetUserInfoResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof network.GetUserInfoResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {network.GetUserInfoResponse} GetUserInfoResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetUserInfoResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GetUserInfoResponse message.
         * @function verify
         * @memberof network.GetUserInfoResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GetUserInfoResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.userInfo != null && message.hasOwnProperty("userInfo")) {
                var error = $root.network.UserInfo.verify(message.userInfo);
                if (error)
                    return "userInfo." + error;
            }
            return null;
        };

        /**
         * Creates a GetUserInfoResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof network.GetUserInfoResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {network.GetUserInfoResponse} GetUserInfoResponse
         */
        GetUserInfoResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.network.GetUserInfoResponse)
                return object;
            var message = new $root.network.GetUserInfoResponse();
            if (object.userInfo != null) {
                if (typeof object.userInfo !== "object")
                    throw TypeError(".network.GetUserInfoResponse.userInfo: object expected");
                message.userInfo = $root.network.UserInfo.fromObject(object.userInfo);
            }
            return message;
        };

        /**
         * Creates a plain object from a GetUserInfoResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof network.GetUserInfoResponse
         * @static
         * @param {network.GetUserInfoResponse} message GetUserInfoResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GetUserInfoResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.userInfo = null;
            if (message.userInfo != null && message.hasOwnProperty("userInfo"))
                object.userInfo = $root.network.UserInfo.toObject(message.userInfo, options);
            return object;
        };

        /**
         * Converts this GetUserInfoResponse to JSON.
         * @function toJSON
         * @memberof network.GetUserInfoResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GetUserInfoResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for GetUserInfoResponse
         * @function getTypeUrl
         * @memberof network.GetUserInfoResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        GetUserInfoResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/network.GetUserInfoResponse";
        };

        return GetUserInfoResponse;
    })();

    network.UpdateUserInfoRequest = (function() {

        /**
         * Properties of an UpdateUserInfoRequest.
         * @memberof network
         * @interface IUpdateUserInfoRequest
         * @property {string|null} [nickname] UpdateUserInfoRequest nickname
         * @property {string|null} [avatar] UpdateUserInfoRequest avatar
         */

        /**
         * Constructs a new UpdateUserInfoRequest.
         * @memberof network
         * @classdesc Represents an UpdateUserInfoRequest.
         * @implements IUpdateUserInfoRequest
         * @constructor
         * @param {network.IUpdateUserInfoRequest=} [properties] Properties to set
         */
        function UpdateUserInfoRequest(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * UpdateUserInfoRequest nickname.
         * @member {string} nickname
         * @memberof network.UpdateUserInfoRequest
         * @instance
         */
        UpdateUserInfoRequest.prototype.nickname = "";

        /**
         * UpdateUserInfoRequest avatar.
         * @member {string} avatar
         * @memberof network.UpdateUserInfoRequest
         * @instance
         */
        UpdateUserInfoRequest.prototype.avatar = "";

        /**
         * Creates a new UpdateUserInfoRequest instance using the specified properties.
         * @function create
         * @memberof network.UpdateUserInfoRequest
         * @static
         * @param {network.IUpdateUserInfoRequest=} [properties] Properties to set
         * @returns {network.UpdateUserInfoRequest} UpdateUserInfoRequest instance
         */
        UpdateUserInfoRequest.create = function create(properties) {
            return new UpdateUserInfoRequest(properties);
        };

        /**
         * Encodes the specified UpdateUserInfoRequest message. Does not implicitly {@link network.UpdateUserInfoRequest.verify|verify} messages.
         * @function encode
         * @memberof network.UpdateUserInfoRequest
         * @static
         * @param {network.IUpdateUserInfoRequest} message UpdateUserInfoRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UpdateUserInfoRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.nickname != null && Object.hasOwnProperty.call(message, "nickname"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.nickname);
            if (message.avatar != null && Object.hasOwnProperty.call(message, "avatar"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.avatar);
            return writer;
        };

        /**
         * Encodes the specified UpdateUserInfoRequest message, length delimited. Does not implicitly {@link network.UpdateUserInfoRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof network.UpdateUserInfoRequest
         * @static
         * @param {network.IUpdateUserInfoRequest} message UpdateUserInfoRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UpdateUserInfoRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an UpdateUserInfoRequest message from the specified reader or buffer.
         * @function decode
         * @memberof network.UpdateUserInfoRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {network.UpdateUserInfoRequest} UpdateUserInfoRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UpdateUserInfoRequest.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.network.UpdateUserInfoRequest();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.nickname = reader.string();
                        break;
                    }
                case 2: {
                        message.avatar = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an UpdateUserInfoRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof network.UpdateUserInfoRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {network.UpdateUserInfoRequest} UpdateUserInfoRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UpdateUserInfoRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an UpdateUserInfoRequest message.
         * @function verify
         * @memberof network.UpdateUserInfoRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        UpdateUserInfoRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.nickname != null && message.hasOwnProperty("nickname"))
                if (!$util.isString(message.nickname))
                    return "nickname: string expected";
            if (message.avatar != null && message.hasOwnProperty("avatar"))
                if (!$util.isString(message.avatar))
                    return "avatar: string expected";
            return null;
        };

        /**
         * Creates an UpdateUserInfoRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof network.UpdateUserInfoRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {network.UpdateUserInfoRequest} UpdateUserInfoRequest
         */
        UpdateUserInfoRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.network.UpdateUserInfoRequest)
                return object;
            var message = new $root.network.UpdateUserInfoRequest();
            if (object.nickname != null)
                message.nickname = String(object.nickname);
            if (object.avatar != null)
                message.avatar = String(object.avatar);
            return message;
        };

        /**
         * Creates a plain object from an UpdateUserInfoRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof network.UpdateUserInfoRequest
         * @static
         * @param {network.UpdateUserInfoRequest} message UpdateUserInfoRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        UpdateUserInfoRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.nickname = "";
                object.avatar = "";
            }
            if (message.nickname != null && message.hasOwnProperty("nickname"))
                object.nickname = message.nickname;
            if (message.avatar != null && message.hasOwnProperty("avatar"))
                object.avatar = message.avatar;
            return object;
        };

        /**
         * Converts this UpdateUserInfoRequest to JSON.
         * @function toJSON
         * @memberof network.UpdateUserInfoRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        UpdateUserInfoRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for UpdateUserInfoRequest
         * @function getTypeUrl
         * @memberof network.UpdateUserInfoRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        UpdateUserInfoRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/network.UpdateUserInfoRequest";
        };

        return UpdateUserInfoRequest;
    })();

    return network;
})();

module.exports = $root;
module.exports.network = $root.network;
