import { log } from "cc";
import { LogLevel } from "db://ccgf-kit/helper/defines/LogLevel";

/** 
 * 日志管理 
 * @example
LogHelper.debug("调试信息");
LogHelper.info("普通信息");
LogHelper.warn("警告信息");
LogHelper.error("错误信息");

// 设置日志级别(只显示 WARN 及以上)
LogHelper.setLevel(LogLevel.WARN);
 */
export class LogHelper {

    private static level: LogLevel = LogLevel.DEBUG;

    /**
     * 设置日志级别(只显示该级别及以上的日志)
     * @example
        LogHelper.setLevel(LogLevel.WARN);  // 只显示 WARN 和 ERROR
     */
    public static setLevel(level: LogLevel) {
        LogHelper.level = level;
    }

    /**
     * 调试日志(DEBUG级别)
     * @param args 任意数量的日志参数
     */
    public static debug(...args: any[]) {
        LogHelper.printWithLevel(LogLevel.DEBUG, "调试", "#808080", ...args);
    }

    /**
     * 信息日志(INFO级别)
     * @param args 任意数量的日志参数
     */
    public static info(...args: any[]) {
        LogHelper.printWithLevel(LogLevel.INFO, "信息", "#000000", ...args);
    }

    /**
     * 警告日志(WARN级别)
     * @param args 任意数量的日志参数
     */
    public static warn(...args: any[]) {
        LogHelper.printWithLevel(LogLevel.WARN, "警告", "#ffd700", ...args);
    }

    /**
     * 错误日志(ERROR级别)
     * @param args 任意数量的日志参数
     */
    public static error(...args: any[]) {
        LogHelper.printWithLevel(LogLevel.ERROR, "错误", "#ff0000", ...args);
    }

    /**
     * 按级别输出日志
     */
    private static printWithLevel(level: LogLevel, levelName: string, color: string, ...args: any[]) {
        // 级别不够,不打印
        if (level < LogHelper.level) {
            return;
        }

        const backLog = console.log || log;
        color = "color:" + color + ";";
        const prefix = `%c${LogHelper.getDateString()}[${levelName}]${LogHelper.stack(4)}:`;
        
        backLog.call(null, prefix, color, ...args);
    }

    private static stack(index: number): string {
        if (typeof CC_DEBUG !== 'undefined' && !CC_DEBUG) return '';
        const e = new Error();
        const lines = e.stack!.split("\n");
        const result: Array<any> = [];
        lines.forEach((line) => {
            line = line.substring(7);
            var lineBreak = line.split(" ");
            if (lineBreak.length < 2) {
                result.push(lineBreak[0]);
            }
            else {
                result.push({ [lineBreak[0]]: lineBreak[1] });
            }
        });

        let list: string[] = [];
        let splitList: Array<string> = [];
        if (index < result.length - 1) {
            let value: string;
            for (let a in result[index]) {
                splitList = a.split(".");

                if (splitList.length == 2) {
                    list = splitList.concat();
                }
                else {
                    value = result[index][a];
                    const start = value!.lastIndexOf("/");
                    const end = value!.lastIndexOf(".");
                    if (start > -1 && end > -1) {
                        const r = value!.substring(start + 1, end);
                        list.push(r);
                    }
                    else {
                        list.push(value);
                    }
                }
            }
        }

        if (list.length == 1) {
            return "[" + list[0] + ".ts]";
        }
        else if (list.length == 2) {
            return "[" + list[0] + ".ts->" + list[1] + "]";
        }
        return "";
    }

    private static getDateString(): string {
        let d = new Date();
        let str = d.getHours().toString();
        let timeStr = "";
        timeStr += (str.length == 1 ? "0" + str : str) + ":";
        str = d.getMinutes().toString();
        timeStr += (str.length == 1 ? "0" + str : str) + ":";
        str = d.getSeconds().toString();
        timeStr += (str.length == 1 ? "0" + str : str) + ":";
        str = d.getMilliseconds().toString();
        if (str.length == 1) str = "00" + str;
        if (str.length == 2) str = "0" + str;
        timeStr += str;

        timeStr = "[" + timeStr + "]";
        return timeStr;
    }
}