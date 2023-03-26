import {Ace} from "ace-code";
import {ServiceOptions} from "./language-service";
import * as lsp from "vscode-languageserver-protocol";

export interface IMessageController {
    init(sessionId: string, document: Ace.Document, mode: string, options: any, initCallback: () => void, validationCallback: (annotations: lsp.Diagnostic[]) => void): void;

    doValidation(sessionId: string, callback?: (annotations: lsp.Diagnostic[]) => void)

    doComplete(sessionId: string, position: lsp.Position, callback?: (completionList: lsp.CompletionList | lsp.CompletionItem[] | null) => void);

    doResolve(sessionId: string, completion: lsp.CompletionItem, callback?: (completion: lsp.CompletionItem | null) => void);

    format(sessionId: string, range: lsp.Range, format: lsp.FormattingOptions, callback?: (edits: lsp.TextEdit[]) => void);

    doHover(sessionId: string, position: lsp.Position, callback?: (hover: lsp.Hover) => void);

    change(sessionId: string, deltas: lsp.TextDocumentContentChangeEvent[], document: Ace.Document, callback?: () => void): void;

    changeMode(sessionId: string, value: string, mode: string, callback?: () => void);

    changeOptions(sessionId: string, options: ServiceOptions, callback?: () => void);

    dispose(sessionId: string, callback?: () => void): void;

    setGlobalOptions(serviceName: string, options: any, merge?: boolean): void;

}
