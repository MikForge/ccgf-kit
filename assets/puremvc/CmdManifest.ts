/**
 * 命令通知名清单（合并 BaseCmd / Controller / Model / View 四层）
 */
export namespace CmdManifest {
    // ---- Base ----
    export namespace Base {
        export const STARTUP = "BaseCmd.STARTUP";
        export const GAME_INIT = "BaseCmd.GAME_INIT";
        export const INIT_PROGRESS = "BaseCmd.INIT_PROGRESS";
        export const INIT_COMPLETE = "BaseCmd.INIT_COMPLETE";
    }

    // ---- Controller ----
    export namespace Controller {
        export const NETWORK_SEND = "Controller.NETWORK_SEND";
        export const NETWORK_RESPONSE = "Controller.NETWORK_RESPONSE";
    }

    // ---- Model（空占位，供游戏侧扩展）----
    export namespace Model {}

    // ---- View ----
    export namespace View {
        export const UI_OPEN = "View.UI_OPEN";
        export const UI_CLOSE = "View.UI_CLOSE";
    }
}
