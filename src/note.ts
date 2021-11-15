import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { Disposable, Event, EventEmitter, FileDecoration, FileDecorationProvider, Uri } from "vscode";

/**
 * 备注提示注册器
 */
export class NoteDecorationProvider implements FileDecorationProvider {
    private notes: any = {};
    private static _instance: NoteDecorationProvider;
    private constructor() { }
    public static get instance() {
        return this._instance || (this._instance = new NoteDecorationProvider());
    }

    private _onDidChangeFileDecorations: EventEmitter<Uri | Uri[] | undefined> = new EventEmitter<Uri | Uri[] | undefined>();
    readonly onDidChangeFileDecorations: Event<Uri | Uri[] | undefined> | undefined = this._onDidChangeFileDecorations.event;

    provideFileDecoration(uri: vscode.Uri): vscode.ProviderResult<FileDecoration> {
        let relativePath = this.getRelativePath(uri);
        let txt = this.getNote(relativePath);
        if (!txt) {
            return {
                badge: 'S',
                tooltip: "txt",
                propagate: true,
            };
        } else {
            return {
                badge: 'S',
                tooltip: txt,
                propagate: true,
            };
        }
    }

    getRelativePath(pathUri: vscode.Uri): string {
        let rootPath = vscode.workspace.getWorkspaceFolder(pathUri);
        let basePath = rootPath?.uri.fsPath || "";
        basePath = basePath.slice(0, basePath.length);
        let path = pathUri.fsPath;
        return path.replace(basePath, "").replace(/\\/g, "/");
    }

    getNote(key: string) {
        let settingJsonPath = (vscode.workspace.workspaceFolders || [])[0]?.uri
            .fsPath;
        let url = path.join(settingJsonPath, ".vscode").replace(/\\/g, "/");

        if (fs.existsSync(url)) {
            let jsonPath = path.join(url, "file-notes.json");
            let content =
                fs.readFileSync(jsonPath, {
                    encoding: "utf-8",
                }) || "{}";
            this.notes = JSON.parse(content) || {};
            return this.notes[key];
        } else {
            return null;
        }

    }

}