import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { Disposable, Event, EventEmitter, FileDecoration, FileDecorationProvider, Uri } from "vscode";
import { getRelativePath } from "./utils";


/**
 *      note FileDecorationProvider
 */
export class NoteDecorationProvider implements FileDecorationProvider {

    private notes: any = {}; // json -> key: relativePath, value: note
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
        let note = this.getNote(uri);
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

    inputNote(uri: vscode.Uri) {
        if (!uri) {
            return vscode.window.showErrorMessage(
                "Please right click file in explorer view to select context menu [Set Note for file ...]"
            );
        }
        let key = getRelativePath(uri);
        let val = this.getNote(uri);
        vscode.window
            .showInputBox({ title: "Input note text:", value: val })
            .then((txt = "") => {
                this.saveNote(uri, txt);
            });
    }

    getNote(uri: vscode.Uri) {
        let key = getRelativePath(uri);
        let settingJsonPath = '';
        // first project's .vscode/file-notes.json
        const wsFolder = vscode.workspace.getWorkspaceFolder(uri);
        if (!wsFolder) {
            let msg = `$(alert) <outside workspace> → ${uri.fsPath}`;
            vscode.window.showInformationMessage(msg);
        } else {
            settingJsonPath = wsFolder.uri.fsPath;
        }
        // let settingJsonPath = (vscode.workspace.workspaceFolders || [])[0]?.uri.fsPath;
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

    saveNote(uri: vscode.Uri, val: string) {
        let key = getRelativePath(uri);
        this.notes[key] = val;

        let settingJsonPath = '';
        // first project's .vscode/file-notes.json
        const wsFolder = vscode.workspace.getWorkspaceFolder(uri);
        if (!wsFolder) {
            let msg = `$(alert) <outside workspace> → ${uri.fsPath}`;
            vscode.window.showInformationMessage(msg);
        } else {
            settingJsonPath = wsFolder.uri.fsPath;
        }

        // let settingJsonPath = (vscode.workspace.workspaceFolders || [])[0]?.uri.fsPath;
        let url = path.join(settingJsonPath, ".vscode");
        fs.writeFileSync(
            path.join(url, "file-notes.json"),
            JSON.stringify(this.notes, null, "\t")
        );
    }

    // auto create key of all folders/files in file-notes.json
    createNoteDir() {
    }

}


