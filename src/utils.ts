import * as vscode from "vscode";

// get relative path as note key
export function getRelativePath(pathUri: vscode.Uri): string {
    let rootPath = vscode.workspace.getWorkspaceFolder(pathUri);
    let basePath = rootPath?.uri.fsPath || "";
    basePath = basePath.slice(0, basePath.length);
    let path = pathUri.fsPath;
    return path.replace(basePath, "").replace(/\\/g, "/");
}
