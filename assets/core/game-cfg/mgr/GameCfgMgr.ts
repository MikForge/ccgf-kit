import { Singleton } from 'db://assets/core/common';
import type { GameConfig } from '../defines/game-config.structs';

export class GameCfgMgr extends Singleton<GameCfgMgr> {
    private _data: GameConfig | null = null;
    private _envType: string = 'dev';

    init(json: GameConfig): void {
        this._data = json;
        this._envType = json?.type ?? 'dev';

        if (this._envType !== 'dev' && !json?.config?.[this._envType]) {
            const available = json?.config ? Object.keys(json.config).join(', ') : '无';
            H.log.warn(
                `GameCfgMgr: 环境 "${this._envType}" 不在配置中，` +
                `可用环境: [${available}]，相关 getter 将返回空字符串`
            );
        }
    }

    get envType(): string {
        return this._envType;
    }

    get httpServer(): string {
        return this._data?.config?.[this._envType]?.httpServer ?? '';
    }

    get webSocketServer(): string {
        return this._data?.config?.[this._envType]?.webSocketServer ?? '';
    }
}
