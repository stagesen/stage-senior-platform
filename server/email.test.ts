import assert from 'assert';
import { escapeHtml } from './email';

console.log('Running HTML escaping tests...\n');

let passedTests = 0;
let failedTests = 0;

function runTest(testName: string, input: string, expected: string) {
  try {
    const result = escapeHtml(input);
    assert.strictEqual(result, expected);
    console.log(`✓ ${testName}`);
    console.log(`  Input:    "${input}"`);
    console.log(`  Expected: "${expected}"`);
    console.log(`  Got:      "${result}"\n`);
    passedTests++;
  } catch (error) {
    console.error(`✗ ${testName}`);
    console.error(`  Input:    "${input}"`);
    console.error(`  Expected: "${expected}"`);
    console.error(`  Got:      "${escapeHtml(input)}"`);
    console.error(`  Error:    ${error instanceof Error ? error.message : String(error)}\n`);
    failedTests++;
  }
}

// Test case 1: Script tag injection
runTest(
  'Test 1: Script tag with XSS attempt',
  `<script>alert('xss')</script>`,
  `&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;`
);

// Test case 2: Image tag with onerror attribute
runTest(
  'Test 2: Image tag with onerror handler',
  `<img src=x onerror="alert(1)">`,
  `&lt;img src=x onerror=&quot;alert(1)&quot;&gt;`
);

// Test case 3: Quotes and apostrophes
runTest(
  'Test 3: Quotes and apostrophes',
  `"quotes" and 'apostrophes'`,
  `&quot;quotes&quot; and &#39;apostrophes&#39;`
);

// Test case 4: Anchor tag phishing attempt
runTest(
  'Test 4: Anchor tag phishing attempt',
  `<a href="http://evil.com">phishing</a>`,
  `&lt;a href=&quot;http://evil.com&quot;&gt;phishing&lt;/a&gt;`
);

// Additional edge cases
runTest(
  'Test 5: Ampersand escaping',
  `Tom & Jerry`,
  `Tom &amp; Jerry`
);

runTest(
  'Test 6: All special characters combined',
  `<>&"'`,
  `&lt;&gt;&amp;&quot;&#39;`
);

runTest(
  'Test 7: Null input',
  null as any,
  ``
);

runTest(
  'Test 8: Undefined input',
  undefined as any,
  ``
);

// Print summary
console.log('='.repeat(50));
console.log(`Test Summary:`);
console.log(`  Passed: ${passedTests}`);
console.log(`  Failed: ${failedTests}`);
console.log(`  Total:  ${passedTests + failedTests}`);
console.log('='.repeat(50));

if (failedTests > 0) {
  console.error(`\n❌ TESTS FAILED`);
  process.exit(1);
} else {
  console.log(`\n✅ ALL TESTS PASSED`);
  process.exit(0);
}
