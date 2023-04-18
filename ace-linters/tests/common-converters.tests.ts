import {expect} from "chai";
import {Range as AceRange} from "ace-code/src/range";
import {
    CompletionItemKind,
} from "vscode-languageserver-protocol";
import {CommonConverter} from "../type-converters/common-converters";


describe('General Converters', () => {
    describe('normalizeRanges', () => {
        it('should correctly normalize the ranges of an array of completions', () => {
            const completions = [
                {value: 'value1', range: {start: {row: 0, column: 0}, end: {row: 1, column: 0}}},
                {value: 'value2', range: {start: {row: 2, column: 0}, end: {row: 3, column: 0}}}
            ];
            const expected = [
                {value: 'value1', range: AceRange.fromPoints({row: 0, column: 0}, {row: 1, column: 0})},
                {value: 'value2', range: AceRange.fromPoints({row: 2, column: 0}, {row: 3, column: 0})}
            ];
            expect(CommonConverter.normalizeRanges(completions)).to.deep.equal(expected);
        });
    });

    describe('cleanHtml', () => {
        it('should clean the HTML string by replacing <a> tags', () => {
            const html = "<a href='www.example.com'>link</a>";
            const expected = "<a target='_blank' href='www.example.com'>link</a>";
            expect(CommonConverter.cleanHtml(html)).to.equal(expected);
        });
    });

    describe('toRange', () => {
        it('should correctly convert a range object to an Ace range', () => {
            const range = {start: {row: 0, column: 0}, end: {row: 1, column: 0}};
            const expected = AceRange.fromPoints({row: 0, column: 0}, {row: 1, column: 0});
            expect(CommonConverter.toRange(range)).to.deep.equal(expected);
        });

        it('should return undefined if the range object is missing start or end properties', () => {
            const range = {start: {row: 0, column: 0}};
            expect(CommonConverter.toRange(range as any)).to.undefined;
        });
    });

    describe('convertKind', () => {
        it('should correctly convert the string representation of a completion item kind', () => {
            const kinds = [
                'function',
                'memberVariable',
                'primitiveType',
                'variable',
                'enum',
                'module',
                'class',
                'interface',
                'warning'
            ];

            const expected = [
                CompletionItemKind.Function,
                CompletionItemKind.Field,
                CompletionItemKind.Keyword,
                CompletionItemKind.Variable,
                CompletionItemKind.Enum,
                CompletionItemKind.Module,
                CompletionItemKind.Class,
                CompletionItemKind.Interface,
                CompletionItemKind.File
            ];

            for (let i = 0; i < kinds.length; i++) {
                expect(CommonConverter.convertKind(kinds[i])).to.equal(expected[i]);
            }
        });

        it('should return CompletionItemKind.Property if the kind string is not recognized', () => {
            const kind = 'unknown';
            const expected = CompletionItemKind.Property;
            expect(CommonConverter.convertKind(kind)).to.equal(expected);
        });
    });

});
