import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { Disposable, Event, EventEmitter, FileDecoration, FileDecorationProvider, Uri } from "vscode";

/**
 *      note FileDecorationProvider
 */
export class NoteDecorationProvider implements FileDecorationProvider {
    private notes: any = {};
    private dp_fdp: Disposable | undefined;
    private static _instance: NoteDecorationProvider;
    private constructor() {
        let dp_fdp = null;
    }
    public static get instance() {
        return this._instance || (this._instance = new NoteDecorationProvider());
    }

    private _onDidChangeFileDecorations: EventEmitter<Uri | Uri[] | undefined> = new EventEmitter<Uri | Uri[] | undefined>();
    readonly onDidChangeFileDecorations: Event<Uri | Uri[] | undefined> | undefined = this._onDidChangeFileDecorations.event;

    provideFileDecoration(uri: vscode.Uri): vscode.ProviderResult<FileDecoration> {
        let relativePath = this.getRelativePath(uri);
        let note = this.getNote(relativePath);
        if (!note) {
            return {};
        } else {
            return {
                tooltip: note,
                propagate: true,
            };
        }
    }

    // sync notes to file-notes.json
    updateFileDecoration() {
        if (this.dp_fdp) {
            this.dp_fdp.dispose();
        }
        let fdp = NoteDecorationProvider.instance;
        this.dp_fdp = vscode.window.registerFileDecorationProvider(fdp);
    }

    // auto create key of all folders/files in file-notes.json
    createNoteDir() {
    }

    getRelativePath(pathUri: vscode.Uri): string {
        let rootPath = vscode.workspace.getWorkspaceFolder(pathUri);
        let basePath = rootPath?.uri.fsPath || "";
        basePath = basePath.slice(0, basePath.length);
        let path = pathUri.fsPath;
        return path.replace(basePath, "").replace(/\\/g, "/");
    }

    getNote(key: string) {
        // first project's .vscode/file-notes.json
        let settingJsonPath = (vscode.workspace.workspaceFolders || [])[0]?.uri.fsPath;
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