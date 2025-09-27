import chalk from "chalk";

export function logInfo(msg: string): void {
    console.log(chalk.blue("[INFO]"), msg);
}

export function logSuccess(msg: string): void {
    console.log(chalk.green("[SUCCESS]"), msg);
}

export function logWarn(msg: string): void {
    console.log(chalk.yellow("[WARN]"), msg);
}

export function logError(msg: string): void {
    console.log(chalk.red("[ERROR]"), msg);
}