import chalk from "chalk";

export function logInfo(msg) {
    console.log(chalk.blue("[INFO]"), msg);
}

export function logSuccess(msg) {
    console.log(chalk.green("[SUCCESS]"), msg);
}

export function logWarn(msg) {
    console.log(chalk.yellow("[WARN]"), msg);
}

export function logError(msg) {
    console.log(chalk.red("[ERROR]"), msg);
}