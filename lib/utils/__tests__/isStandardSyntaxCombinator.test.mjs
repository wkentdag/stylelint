import isStandardSyntaxCombinator from '../isStandardSyntaxCombinator.js';
import postcss from 'postcss';
import selectorParser from 'postcss-selector-parser';

describe('isStandardSyntaxCombinator', () => {
	it('tag', () => {
		expect(isStandardSyntaxCombinator(postcss.parse('a {}').first)).toBeFalsy();
	});
	it('descendant', () => {
		expect(isStandardSyntaxCombinator(combinator('a b {}'))).toBeTruthy();
	});
	it('descendant tab', () => {
		expect(isStandardSyntaxCombinator(combinator('a\tb {}'))).toBeTruthy();
	});
	it('descendant newline', () => {
		expect(isStandardSyntaxCombinator(combinator('a\nb {}'))).toBeTruthy();
	});
	it('descendant (double child)', () => {
		expect(isStandardSyntaxCombinator(combinator('a >> b {}'))).toBeTruthy();
	});
	it('child', () => {
		expect(isStandardSyntaxCombinator(combinator('a > b {}'))).toBeTruthy();
	});
	it('next sibling', () => {
		expect(isStandardSyntaxCombinator(combinator('a + b {}'))).toBeTruthy();
	});
	it('subsequent-sibling', () => {
		expect(isStandardSyntaxCombinator(combinator('a ~ b {}'))).toBeTruthy();
	});
	it('lowercase reference', () => {
		expect(isStandardSyntaxCombinator(combinator('a /for/ b {}'))).toBeFalsy();
	});
	it('mixedcase reference', () => {
		expect(isStandardSyntaxCombinator(combinator('a /fOr/ b {}'))).toBeFalsy();
	});
	it('uppercase reference', () => {
		expect(isStandardSyntaxCombinator(combinator('a /FOR/ b {}'))).toBeFalsy();
	});
	it('last node is combinator', () => {
		expect(isStandardSyntaxCombinator(combinator('a ~, {}'))).toBeFalsy();
	});
	it('first node is combinator', () => {
		expect(isStandardSyntaxCombinator(combinator('~ b {}'))).toBeFalsy();
	});
	it('last node (in first container) is combinator', () => {
		expect(isStandardSyntaxCombinator(combinator('a ~, b {}'))).toBeFalsy();
	});
	it('first node (in second container) is combinator', () => {
		expect(isStandardSyntaxCombinator(combinator('a, ~ b {}'))).toBeFalsy();
	});
});

function combinator(css) {
	const list = [];

	postcss.parse(css).walkRules((rule) => {
		selectorParser((selectorAST) => {
			selectorAST.walkCombinators((c) => list.push(c));
		}).processSync(rule.selector);
	});

	return list[0];
}
