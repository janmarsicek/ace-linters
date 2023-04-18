import {LanguageService as VSLanguageService} from "vscode-html-languageservice";
import {HTMLFormatConfiguration} from "vscode-html-languageservice/lib/umd/htmlLanguageTypes";
import {BaseService} from "../base-service";
import * as lsp from "vscode-languageserver-protocol";
import {HTMLHint} from 'htmlhint';

import * as htmlService from 'vscode-html-languageservice';
import {mergeObjects} from "../../utils";
import {HtmlServiceOptions, LanguageService} from "../../types";

export class HtmlService extends BaseService<HtmlServiceOptions> implements LanguageService {
    $service: VSLanguageService;

    defaultValidationOptions = {
        "attr-no-duplication": true,
        "body-no-duplicates": true,
        "head-body-descendents-html": true,
        "head-no-duplicates": true,
        "head-valid-children": true,
        "html-no-duplicates": true,
        "html-root-node": true,
        "html-valid-children": true,
        "html-valid-children-order": true,
        "img-src-required": true,
        "invalid-attribute-char": true,
        "nested-paragraphs": true,
        "spec-char-escape": true,
        "src-not-empty": true,
        "tag-pair": true
    }

    $defaultFormatOptions: HTMLFormatConfiguration = {
        wrapAttributes: "auto",
        wrapAttributesIndentSize: 120
    }

    constructor(mode: string) {
        super(mode);
        this.$service = htmlService.getLanguageService();
    }

    getFormattingOptions(options: HTMLFormatConfiguration): HTMLFormatConfiguration {
        this.$defaultFormatOptions.tabSize = options.tabSize;
        this.$defaultFormatOptions.insertSpaces = options.insertSpaces;
        return mergeObjects(this.globalOptions?.formatOptions, this.$defaultFormatOptions);
    }

    format(document: lsp.TextDocumentIdentifier, range: lsp.Range, options: HTMLFormatConfiguration): lsp.TextEdit[] {
        let fullDocument = this.getDocument(document.uri);
        if (!fullDocument)
            return [];

        return this.$service.format(fullDocument, range, this.getFormattingOptions(options));
    }

    async doHover(document: lsp.TextDocumentIdentifier, position: lsp.Position): Promise<lsp.Hover | null> {
        let fullDocument = this.getDocument(document.uri);
        if (!fullDocument)
            return null;

        let htmlDocument = this.$service.parseHTMLDocument(fullDocument);
        return this.$service.doHover(fullDocument, position, htmlDocument);
    }

    async doValidation(document: lsp.TextDocumentIdentifier): Promise<lsp.Diagnostic[]> {
        let fullDocument = this.getDocument(document.uri);
        if (!fullDocument) {
            return [];
        }
        let options = this.getOption(document.uri, "validationOptions") ?? this.defaultValidationOptions;
        return HTMLHint.verify(fullDocument.getText(), options).map(el => {
            return {
                range: {
                    start: {
                        line: el.line - 1,
                        character: el.col - 1
                    },
                    end: {
                        line: el.line - 1,
                        character: el.col - 1
                    }
                },
                severity: el.type === "error" ? 1 : el.type === "warning" ? 2 : 3,
                message: el.message
            }
        });
    }

    async doComplete(document: lsp.TextDocumentIdentifier, position: lsp.Position): Promise<lsp.CompletionItem[] | lsp.CompletionList | null> {
        let fullDocument = this.getDocument(document.uri);
        if (!fullDocument)
            return null;

        let htmlDocument = this.$service.parseHTMLDocument(fullDocument);
        return this.$service.doComplete(fullDocument, position, htmlDocument);
    }

    async doResolve(item: lsp.CompletionItem): Promise<lsp.CompletionItem> {
        return item;
    }

    async findDocumentHighlights(document: lsp.TextDocumentIdentifier, position: lsp.Position): Promise<lsp.DocumentHighlight[]> {
        let fullDocument = this.getDocument(document.uri);
        if (!fullDocument)
            return [];
        let htmlDocument = this.$service.parseHTMLDocument(fullDocument);
        return this.$service.findDocumentHighlights(fullDocument, position, htmlDocument);
    }
}
