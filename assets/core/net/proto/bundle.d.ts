import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace network. */
export namespace network {

    /** Properties of a Response. */
    interface IResponse {

        /** Response code */
        code?: (number|null);

        /** Response message */
        message?: (string|null);

        /** Response data */
        data?: (Uint8Array|null);
    }

    /** Represents a Response. */
    class Response implements IResponse {

        /**
         * Constructs a new Response.
         * @param [properties] Properties to set
         */
        constructor(properties?: network.IResponse);

        /** Response code. */
        public code: number;

        /** Response message. */
        public message: string;

        /** Response data. */
        public data: Uint8Array;

        /**
         * Creates a new Response instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Response instance
         */
        public static create(properties?: network.IResponse): network.Response;

        /**
         * Encodes the specified Response message. Does not implicitly {@link network.Response.verify|verify} messages.
         * @param message Response message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: network.IResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Response message, length delimited. Does not implicitly {@link network.Response.verify|verify} messages.
         * @param message Response message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: network.IResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Response message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Response
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): network.Response;

        /**
         * Decodes a Response message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Response
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): network.Response;

        /**
         * Verifies a Response message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Response message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Response
         */
        public static fromObject(object: { [k: string]: any }): network.Response;

        /**
         * Creates a plain object from a Response message. Also converts values to other types if specified.
         * @param message Response
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: network.Response, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Response to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Response
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a HeartbeatRequest. */
    interface IHeartbeatRequest {

        /** HeartbeatRequest timestamp */
        timestamp?: (number|Long|null);
    }

    /** Represents a HeartbeatRequest. */
    class HeartbeatRequest implements IHeartbeatRequest {

        /**
         * Constructs a new HeartbeatRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: network.IHeartbeatRequest);

        /** HeartbeatRequest timestamp. */
        public timestamp: (number|Long);

        /**
         * Creates a new HeartbeatRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns HeartbeatRequest instance
         */
        public static create(properties?: network.IHeartbeatRequest): network.HeartbeatRequest;

        /**
         * Encodes the specified HeartbeatRequest message. Does not implicitly {@link network.HeartbeatRequest.verify|verify} messages.
         * @param message HeartbeatRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: network.IHeartbeatRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified HeartbeatRequest message, length delimited. Does not implicitly {@link network.HeartbeatRequest.verify|verify} messages.
         * @param message HeartbeatRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: network.IHeartbeatRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a HeartbeatRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns HeartbeatRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): network.HeartbeatRequest;

        /**
         * Decodes a HeartbeatRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns HeartbeatRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): network.HeartbeatRequest;

        /**
         * Verifies a HeartbeatRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a HeartbeatRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns HeartbeatRequest
         */
        public static fromObject(object: { [k: string]: any }): network.HeartbeatRequest;

        /**
         * Creates a plain object from a HeartbeatRequest message. Also converts values to other types if specified.
         * @param message HeartbeatRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: network.HeartbeatRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this HeartbeatRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for HeartbeatRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a HeartbeatResponse. */
    interface IHeartbeatResponse {

        /** HeartbeatResponse serverTime */
        serverTime?: (number|Long|null);
    }

    /** Represents a HeartbeatResponse. */
    class HeartbeatResponse implements IHeartbeatResponse {

        /**
         * Constructs a new HeartbeatResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: network.IHeartbeatResponse);

        /** HeartbeatResponse serverTime. */
        public serverTime: (number|Long);

        /**
         * Creates a new HeartbeatResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns HeartbeatResponse instance
         */
        public static create(properties?: network.IHeartbeatResponse): network.HeartbeatResponse;

        /**
         * Encodes the specified HeartbeatResponse message. Does not implicitly {@link network.HeartbeatResponse.verify|verify} messages.
         * @param message HeartbeatResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: network.IHeartbeatResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified HeartbeatResponse message, length delimited. Does not implicitly {@link network.HeartbeatResponse.verify|verify} messages.
         * @param message HeartbeatResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: network.IHeartbeatResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a HeartbeatResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns HeartbeatResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): network.HeartbeatResponse;

        /**
         * Decodes a HeartbeatResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns HeartbeatResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): network.HeartbeatResponse;

        /**
         * Verifies a HeartbeatResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a HeartbeatResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns HeartbeatResponse
         */
        public static fromObject(object: { [k: string]: any }): network.HeartbeatResponse;

        /**
         * Creates a plain object from a HeartbeatResponse message. Also converts values to other types if specified.
         * @param message HeartbeatResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: network.HeartbeatResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this HeartbeatResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for HeartbeatResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** ErrorCode enum. */
    enum ErrorCode {
        SUCCESS = 0,
        UNKNOWN_ERROR = 1,
        INVALID_PARAM = 2,
        AUTH_FAILED = 3,
        TIMEOUT = 4,
        SERVER_ERROR = 5
    }

    /** Properties of a GameData. */
    interface IGameData {

        /** GameData level */
        level?: (number|null);

        /** GameData score */
        score?: (number|null);

        /** GameData coin */
        coin?: (number|null);

        /** GameData diamond */
        diamond?: (number|null);

        /** GameData items */
        items?: (number[]|null);
    }

    /** Represents a GameData. */
    class GameData implements IGameData {

        /**
         * Constructs a new GameData.
         * @param [properties] Properties to set
         */
        constructor(properties?: network.IGameData);

        /** GameData level. */
        public level: number;

        /** GameData score. */
        public score: number;

        /** GameData coin. */
        public coin: number;

        /** GameData diamond. */
        public diamond: number;

        /** GameData items. */
        public items: number[];

        /**
         * Creates a new GameData instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GameData instance
         */
        public static create(properties?: network.IGameData): network.GameData;

        /**
         * Encodes the specified GameData message. Does not implicitly {@link network.GameData.verify|verify} messages.
         * @param message GameData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: network.IGameData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GameData message, length delimited. Does not implicitly {@link network.GameData.verify|verify} messages.
         * @param message GameData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: network.IGameData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GameData message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GameData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): network.GameData;

        /**
         * Decodes a GameData message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GameData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): network.GameData;

        /**
         * Verifies a GameData message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GameData message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GameData
         */
        public static fromObject(object: { [k: string]: any }): network.GameData;

        /**
         * Creates a plain object from a GameData message. Also converts values to other types if specified.
         * @param message GameData
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: network.GameData, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GameData to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GameData
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an EnterGameRequest. */
    interface IEnterGameRequest {

        /** EnterGameRequest levelId */
        levelId?: (number|null);
    }

    /** Represents an EnterGameRequest. */
    class EnterGameRequest implements IEnterGameRequest {

        /**
         * Constructs a new EnterGameRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: network.IEnterGameRequest);

        /** EnterGameRequest levelId. */
        public levelId: number;

        /**
         * Creates a new EnterGameRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns EnterGameRequest instance
         */
        public static create(properties?: network.IEnterGameRequest): network.EnterGameRequest;

        /**
         * Encodes the specified EnterGameRequest message. Does not implicitly {@link network.EnterGameRequest.verify|verify} messages.
         * @param message EnterGameRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: network.IEnterGameRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified EnterGameRequest message, length delimited. Does not implicitly {@link network.EnterGameRequest.verify|verify} messages.
         * @param message EnterGameRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: network.IEnterGameRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an EnterGameRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns EnterGameRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): network.EnterGameRequest;

        /**
         * Decodes an EnterGameRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns EnterGameRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): network.EnterGameRequest;

        /**
         * Verifies an EnterGameRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an EnterGameRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns EnterGameRequest
         */
        public static fromObject(object: { [k: string]: any }): network.EnterGameRequest;

        /**
         * Creates a plain object from an EnterGameRequest message. Also converts values to other types if specified.
         * @param message EnterGameRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: network.EnterGameRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this EnterGameRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for EnterGameRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an EnterGameResponse. */
    interface IEnterGameResponse {

        /** EnterGameResponse gameData */
        gameData?: (network.IGameData|null);

        /** EnterGameResponse startTime */
        startTime?: (number|Long|null);
    }

    /** Represents an EnterGameResponse. */
    class EnterGameResponse implements IEnterGameResponse {

        /**
         * Constructs a new EnterGameResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: network.IEnterGameResponse);

        /** EnterGameResponse gameData. */
        public gameData?: (network.IGameData|null);

        /** EnterGameResponse startTime. */
        public startTime: (number|Long);

        /**
         * Creates a new EnterGameResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns EnterGameResponse instance
         */
        public static create(properties?: network.IEnterGameResponse): network.EnterGameResponse;

        /**
         * Encodes the specified EnterGameResponse message. Does not implicitly {@link network.EnterGameResponse.verify|verify} messages.
         * @param message EnterGameResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: network.IEnterGameResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified EnterGameResponse message, length delimited. Does not implicitly {@link network.EnterGameResponse.verify|verify} messages.
         * @param message EnterGameResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: network.IEnterGameResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an EnterGameResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns EnterGameResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): network.EnterGameResponse;

        /**
         * Decodes an EnterGameResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns EnterGameResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): network.EnterGameResponse;

        /**
         * Verifies an EnterGameResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an EnterGameResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns EnterGameResponse
         */
        public static fromObject(object: { [k: string]: any }): network.EnterGameResponse;

        /**
         * Creates a plain object from an EnterGameResponse message. Also converts values to other types if specified.
         * @param message EnterGameResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: network.EnterGameResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this EnterGameResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for EnterGameResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GameResult. */
    interface IGameResult {

        /** GameResult levelId */
        levelId?: (number|null);

        /** GameResult score */
        score?: (number|null);

        /** GameResult duration */
        duration?: (number|null);

        /** GameResult isWin */
        isWin?: (boolean|null);

        /** GameResult rewards */
        rewards?: (network.IReward[]|null);
    }

    /** Represents a GameResult. */
    class GameResult implements IGameResult {

        /**
         * Constructs a new GameResult.
         * @param [properties] Properties to set
         */
        constructor(properties?: network.IGameResult);

        /** GameResult levelId. */
        public levelId: number;

        /** GameResult score. */
        public score: number;

        /** GameResult duration. */
        public duration: number;

        /** GameResult isWin. */
        public isWin: boolean;

        /** GameResult rewards. */
        public rewards: network.IReward[];

        /**
         * Creates a new GameResult instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GameResult instance
         */
        public static create(properties?: network.IGameResult): network.GameResult;

        /**
         * Encodes the specified GameResult message. Does not implicitly {@link network.GameResult.verify|verify} messages.
         * @param message GameResult message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: network.IGameResult, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GameResult message, length delimited. Does not implicitly {@link network.GameResult.verify|verify} messages.
         * @param message GameResult message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: network.IGameResult, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GameResult message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GameResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): network.GameResult;

        /**
         * Decodes a GameResult message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GameResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): network.GameResult;

        /**
         * Verifies a GameResult message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GameResult message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GameResult
         */
        public static fromObject(object: { [k: string]: any }): network.GameResult;

        /**
         * Creates a plain object from a GameResult message. Also converts values to other types if specified.
         * @param message GameResult
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: network.GameResult, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GameResult to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GameResult
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a Reward. */
    interface IReward {

        /** Reward type */
        type?: (number|null);

        /** Reward itemId */
        itemId?: (number|null);

        /** Reward count */
        count?: (number|null);
    }

    /** Represents a Reward. */
    class Reward implements IReward {

        /**
         * Constructs a new Reward.
         * @param [properties] Properties to set
         */
        constructor(properties?: network.IReward);

        /** Reward type. */
        public type: number;

        /** Reward itemId. */
        public itemId: number;

        /** Reward count. */
        public count: number;

        /**
         * Creates a new Reward instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Reward instance
         */
        public static create(properties?: network.IReward): network.Reward;

        /**
         * Encodes the specified Reward message. Does not implicitly {@link network.Reward.verify|verify} messages.
         * @param message Reward message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: network.IReward, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Reward message, length delimited. Does not implicitly {@link network.Reward.verify|verify} messages.
         * @param message Reward message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: network.IReward, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Reward message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Reward
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): network.Reward;

        /**
         * Decodes a Reward message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Reward
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): network.Reward;

        /**
         * Verifies a Reward message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Reward message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Reward
         */
        public static fromObject(object: { [k: string]: any }): network.Reward;

        /**
         * Creates a plain object from a Reward message. Also converts values to other types if specified.
         * @param message Reward
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: network.Reward, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Reward to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Reward
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SubmitGameResultRequest. */
    interface ISubmitGameResultRequest {

        /** SubmitGameResultRequest result */
        result?: (network.IGameResult|null);

        /** SubmitGameResultRequest signature */
        signature?: (string|null);
    }

    /** Represents a SubmitGameResultRequest. */
    class SubmitGameResultRequest implements ISubmitGameResultRequest {

        /**
         * Constructs a new SubmitGameResultRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: network.ISubmitGameResultRequest);

        /** SubmitGameResultRequest result. */
        public result?: (network.IGameResult|null);

        /** SubmitGameResultRequest signature. */
        public signature: string;

        /**
         * Creates a new SubmitGameResultRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SubmitGameResultRequest instance
         */
        public static create(properties?: network.ISubmitGameResultRequest): network.SubmitGameResultRequest;

        /**
         * Encodes the specified SubmitGameResultRequest message. Does not implicitly {@link network.SubmitGameResultRequest.verify|verify} messages.
         * @param message SubmitGameResultRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: network.ISubmitGameResultRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SubmitGameResultRequest message, length delimited. Does not implicitly {@link network.SubmitGameResultRequest.verify|verify} messages.
         * @param message SubmitGameResultRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: network.ISubmitGameResultRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SubmitGameResultRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SubmitGameResultRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): network.SubmitGameResultRequest;

        /**
         * Decodes a SubmitGameResultRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SubmitGameResultRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): network.SubmitGameResultRequest;

        /**
         * Verifies a SubmitGameResultRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SubmitGameResultRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SubmitGameResultRequest
         */
        public static fromObject(object: { [k: string]: any }): network.SubmitGameResultRequest;

        /**
         * Creates a plain object from a SubmitGameResultRequest message. Also converts values to other types if specified.
         * @param message SubmitGameResultRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: network.SubmitGameResultRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SubmitGameResultRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for SubmitGameResultRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SubmitGameResultResponse. */
    interface ISubmitGameResultResponse {

        /** SubmitGameResultResponse gameData */
        gameData?: (network.IGameData|null);

        /** SubmitGameResultResponse rewards */
        rewards?: (network.IReward[]|null);
    }

    /** Represents a SubmitGameResultResponse. */
    class SubmitGameResultResponse implements ISubmitGameResultResponse {

        /**
         * Constructs a new SubmitGameResultResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: network.ISubmitGameResultResponse);

        /** SubmitGameResultResponse gameData. */
        public gameData?: (network.IGameData|null);

        /** SubmitGameResultResponse rewards. */
        public rewards: network.IReward[];

        /**
         * Creates a new SubmitGameResultResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SubmitGameResultResponse instance
         */
        public static create(properties?: network.ISubmitGameResultResponse): network.SubmitGameResultResponse;

        /**
         * Encodes the specified SubmitGameResultResponse message. Does not implicitly {@link network.SubmitGameResultResponse.verify|verify} messages.
         * @param message SubmitGameResultResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: network.ISubmitGameResultResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SubmitGameResultResponse message, length delimited. Does not implicitly {@link network.SubmitGameResultResponse.verify|verify} messages.
         * @param message SubmitGameResultResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: network.ISubmitGameResultResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SubmitGameResultResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SubmitGameResultResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): network.SubmitGameResultResponse;

        /**
         * Decodes a SubmitGameResultResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SubmitGameResultResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): network.SubmitGameResultResponse;

        /**
         * Verifies a SubmitGameResultResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SubmitGameResultResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SubmitGameResultResponse
         */
        public static fromObject(object: { [k: string]: any }): network.SubmitGameResultResponse;

        /**
         * Creates a plain object from a SubmitGameResultResponse message. Also converts values to other types if specified.
         * @param message SubmitGameResultResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: network.SubmitGameResultResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SubmitGameResultResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for SubmitGameResultResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a UserInfo. */
    interface IUserInfo {

        /** UserInfo userId */
        userId?: (number|Long|null);

        /** UserInfo username */
        username?: (string|null);

        /** UserInfo nickname */
        nickname?: (string|null);

        /** UserInfo level */
        level?: (number|null);

        /** UserInfo exp */
        exp?: (number|Long|null);

        /** UserInfo avatar */
        avatar?: (string|null);

        /** UserInfo createdAt */
        createdAt?: (number|Long|null);
    }

    /** Represents a UserInfo. */
    class UserInfo implements IUserInfo {

        /**
         * Constructs a new UserInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: network.IUserInfo);

        /** UserInfo userId. */
        public userId: (number|Long);

        /** UserInfo username. */
        public username: string;

        /** UserInfo nickname. */
        public nickname: string;

        /** UserInfo level. */
        public level: number;

        /** UserInfo exp. */
        public exp: (number|Long);

        /** UserInfo avatar. */
        public avatar: string;

        /** UserInfo createdAt. */
        public createdAt: (number|Long);

        /**
         * Creates a new UserInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns UserInfo instance
         */
        public static create(properties?: network.IUserInfo): network.UserInfo;

        /**
         * Encodes the specified UserInfo message. Does not implicitly {@link network.UserInfo.verify|verify} messages.
         * @param message UserInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: network.IUserInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified UserInfo message, length delimited. Does not implicitly {@link network.UserInfo.verify|verify} messages.
         * @param message UserInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: network.IUserInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a UserInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns UserInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): network.UserInfo;

        /**
         * Decodes a UserInfo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns UserInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): network.UserInfo;

        /**
         * Verifies a UserInfo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a UserInfo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns UserInfo
         */
        public static fromObject(object: { [k: string]: any }): network.UserInfo;

        /**
         * Creates a plain object from a UserInfo message. Also converts values to other types if specified.
         * @param message UserInfo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: network.UserInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this UserInfo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for UserInfo
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a LoginRequest. */
    interface ILoginRequest {

        /** LoginRequest username */
        username?: (string|null);

        /** LoginRequest password */
        password?: (string|null);

        /** LoginRequest deviceId */
        deviceId?: (string|null);
    }

    /** Represents a LoginRequest. */
    class LoginRequest implements ILoginRequest {

        /**
         * Constructs a new LoginRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: network.ILoginRequest);

        /** LoginRequest username. */
        public username: string;

        /** LoginRequest password. */
        public password: string;

        /** LoginRequest deviceId. */
        public deviceId: string;

        /**
         * Creates a new LoginRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LoginRequest instance
         */
        public static create(properties?: network.ILoginRequest): network.LoginRequest;

        /**
         * Encodes the specified LoginRequest message. Does not implicitly {@link network.LoginRequest.verify|verify} messages.
         * @param message LoginRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: network.ILoginRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LoginRequest message, length delimited. Does not implicitly {@link network.LoginRequest.verify|verify} messages.
         * @param message LoginRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: network.ILoginRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LoginRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LoginRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): network.LoginRequest;

        /**
         * Decodes a LoginRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LoginRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): network.LoginRequest;

        /**
         * Verifies a LoginRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LoginRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LoginRequest
         */
        public static fromObject(object: { [k: string]: any }): network.LoginRequest;

        /**
         * Creates a plain object from a LoginRequest message. Also converts values to other types if specified.
         * @param message LoginRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: network.LoginRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LoginRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for LoginRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a LoginResponse. */
    interface ILoginResponse {

        /** LoginResponse token */
        token?: (string|null);

        /** LoginResponse userInfo */
        userInfo?: (network.IUserInfo|null);

        /** LoginResponse expireTime */
        expireTime?: (number|Long|null);
    }

    /** Represents a LoginResponse. */
    class LoginResponse implements ILoginResponse {

        /**
         * Constructs a new LoginResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: network.ILoginResponse);

        /** LoginResponse token. */
        public token: string;

        /** LoginResponse userInfo. */
        public userInfo?: (network.IUserInfo|null);

        /** LoginResponse expireTime. */
        public expireTime: (number|Long);

        /**
         * Creates a new LoginResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LoginResponse instance
         */
        public static create(properties?: network.ILoginResponse): network.LoginResponse;

        /**
         * Encodes the specified LoginResponse message. Does not implicitly {@link network.LoginResponse.verify|verify} messages.
         * @param message LoginResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: network.ILoginResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LoginResponse message, length delimited. Does not implicitly {@link network.LoginResponse.verify|verify} messages.
         * @param message LoginResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: network.ILoginResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LoginResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LoginResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): network.LoginResponse;

        /**
         * Decodes a LoginResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LoginResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): network.LoginResponse;

        /**
         * Verifies a LoginResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LoginResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LoginResponse
         */
        public static fromObject(object: { [k: string]: any }): network.LoginResponse;

        /**
         * Creates a plain object from a LoginResponse message. Also converts values to other types if specified.
         * @param message LoginResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: network.LoginResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LoginResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for LoginResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GetUserInfoRequest. */
    interface IGetUserInfoRequest {

        /** GetUserInfoRequest userId */
        userId?: (number|Long|null);
    }

    /** Represents a GetUserInfoRequest. */
    class GetUserInfoRequest implements IGetUserInfoRequest {

        /**
         * Constructs a new GetUserInfoRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: network.IGetUserInfoRequest);

        /** GetUserInfoRequest userId. */
        public userId: (number|Long);

        /**
         * Creates a new GetUserInfoRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetUserInfoRequest instance
         */
        public static create(properties?: network.IGetUserInfoRequest): network.GetUserInfoRequest;

        /**
         * Encodes the specified GetUserInfoRequest message. Does not implicitly {@link network.GetUserInfoRequest.verify|verify} messages.
         * @param message GetUserInfoRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: network.IGetUserInfoRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetUserInfoRequest message, length delimited. Does not implicitly {@link network.GetUserInfoRequest.verify|verify} messages.
         * @param message GetUserInfoRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: network.IGetUserInfoRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetUserInfoRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetUserInfoRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): network.GetUserInfoRequest;

        /**
         * Decodes a GetUserInfoRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetUserInfoRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): network.GetUserInfoRequest;

        /**
         * Verifies a GetUserInfoRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetUserInfoRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetUserInfoRequest
         */
        public static fromObject(object: { [k: string]: any }): network.GetUserInfoRequest;

        /**
         * Creates a plain object from a GetUserInfoRequest message. Also converts values to other types if specified.
         * @param message GetUserInfoRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: network.GetUserInfoRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetUserInfoRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GetUserInfoRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GetUserInfoResponse. */
    interface IGetUserInfoResponse {

        /** GetUserInfoResponse userInfo */
        userInfo?: (network.IUserInfo|null);
    }

    /** Represents a GetUserInfoResponse. */
    class GetUserInfoResponse implements IGetUserInfoResponse {

        /**
         * Constructs a new GetUserInfoResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: network.IGetUserInfoResponse);

        /** GetUserInfoResponse userInfo. */
        public userInfo?: (network.IUserInfo|null);

        /**
         * Creates a new GetUserInfoResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetUserInfoResponse instance
         */
        public static create(properties?: network.IGetUserInfoResponse): network.GetUserInfoResponse;

        /**
         * Encodes the specified GetUserInfoResponse message. Does not implicitly {@link network.GetUserInfoResponse.verify|verify} messages.
         * @param message GetUserInfoResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: network.IGetUserInfoResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetUserInfoResponse message, length delimited. Does not implicitly {@link network.GetUserInfoResponse.verify|verify} messages.
         * @param message GetUserInfoResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: network.IGetUserInfoResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetUserInfoResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetUserInfoResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): network.GetUserInfoResponse;

        /**
         * Decodes a GetUserInfoResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetUserInfoResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): network.GetUserInfoResponse;

        /**
         * Verifies a GetUserInfoResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetUserInfoResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetUserInfoResponse
         */
        public static fromObject(object: { [k: string]: any }): network.GetUserInfoResponse;

        /**
         * Creates a plain object from a GetUserInfoResponse message. Also converts values to other types if specified.
         * @param message GetUserInfoResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: network.GetUserInfoResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetUserInfoResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GetUserInfoResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an UpdateUserInfoRequest. */
    interface IUpdateUserInfoRequest {

        /** UpdateUserInfoRequest nickname */
        nickname?: (string|null);

        /** UpdateUserInfoRequest avatar */
        avatar?: (string|null);
    }

    /** Represents an UpdateUserInfoRequest. */
    class UpdateUserInfoRequest implements IUpdateUserInfoRequest {

        /**
         * Constructs a new UpdateUserInfoRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: network.IUpdateUserInfoRequest);

        /** UpdateUserInfoRequest nickname. */
        public nickname: string;

        /** UpdateUserInfoRequest avatar. */
        public avatar: string;

        /**
         * Creates a new UpdateUserInfoRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns UpdateUserInfoRequest instance
         */
        public static create(properties?: network.IUpdateUserInfoRequest): network.UpdateUserInfoRequest;

        /**
         * Encodes the specified UpdateUserInfoRequest message. Does not implicitly {@link network.UpdateUserInfoRequest.verify|verify} messages.
         * @param message UpdateUserInfoRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: network.IUpdateUserInfoRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified UpdateUserInfoRequest message, length delimited. Does not implicitly {@link network.UpdateUserInfoRequest.verify|verify} messages.
         * @param message UpdateUserInfoRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: network.IUpdateUserInfoRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an UpdateUserInfoRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns UpdateUserInfoRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): network.UpdateUserInfoRequest;

        /**
         * Decodes an UpdateUserInfoRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns UpdateUserInfoRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): network.UpdateUserInfoRequest;

        /**
         * Verifies an UpdateUserInfoRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an UpdateUserInfoRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns UpdateUserInfoRequest
         */
        public static fromObject(object: { [k: string]: any }): network.UpdateUserInfoRequest;

        /**
         * Creates a plain object from an UpdateUserInfoRequest message. Also converts values to other types if specified.
         * @param message UpdateUserInfoRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: network.UpdateUserInfoRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this UpdateUserInfoRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for UpdateUserInfoRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }
}
