// ClickGuide Unit Tests (Node.js ESM Test Runner)
import assert from 'assert';
import '../extension/flows.js';
import '../extension/matcher.js';

const flows = globalThis.CLICKGUIDE_FLOWS;
const matcher = globalThis.ClickGuideMatcher;

let passedTests = 0;
let failedTests = 0;

function it(description, fn) {
  try {
    fn();
    console.log(`  ✓ ${description}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ ${description}`);
    console.error(`    ${err.message}`);
    failedTests++;
  }
}

console.log('\n=== RUNNING CLICKGUIDE UNIT TESTS ===\n');

console.log('1. Testing Matcher Keyword Scoring with ≥10 EN & Hinglish Phrasings:');

const testPhrasings = [
  // Flow A: Create Repo (EN + Hinglish)
  { query: 'create a repo', expectedFlow: 'create-repo' },
  { query: 'repository banani hai', expectedFlow: 'create-repo' },
  { query: 'create a new repo', expectedFlow: 'create-repo' },
  { query: 'how to make a repository', expectedFlow: 'create-repo' },
  { query: 'start my first repo on github', expectedFlow: 'create-repo' },
  { query: 'naya repository kaise banaye', expectedFlow: 'create-repo' },
  { query: 'pehla repo banao', expectedFlow: 'create-repo' },
  { query: 'create your first repository', expectedFlow: 'create-repo' },

  // Flow B: Open PR (EN + Hinglish)
  { query: 'open my first pull request', expectedFlow: 'open-pr' },
  { query: 'how to create a PR', expectedFlow: 'open-pr' },
  { query: 'edit readme and commit changes', expectedFlow: 'open-pr' },
  { query: 'pull request kaise bheje', expectedFlow: 'open-pr' },
  { query: 'readme me change karke PR karna hai', expectedFlow: 'open-pr' },
  { query: 'propose changes to project', expectedFlow: 'open-pr' }
];

testPhrasings.forEach(({ query, expectedFlow }) => {
  it(`Maps query "${query}" -> ${expectedFlow}`, () => {
    const res = matcher.matchQuery(query, flows);
    assert.strictEqual(res.matched, true, `Query "${query}" should be matched`);
    assert.strictEqual(res.flowId, expectedFlow, `Query "${query}" should match ${expectedFlow}`);
  });
});

console.log('\n2. Testing Unknown Input & Graceful Fallback:');

const unknownQueries = [
  'order a pepperoni pizza',
  'what is the weather today in mumbai',
  'play some jazz music',
  'book train tickets',
  ''
];

unknownQueries.forEach((query) => {
  it(`Graceful fallback for unknown query: "${query}"`, () => {
    const res = matcher.matchQuery(query, flows);
    assert.strictEqual(res.matched, false, `Unknown query should not match`);
    assert.strictEqual(res.flowId, null);
    assert.strictEqual(res.message, 'I can guide you through these tasks:');
    assert.ok(Array.isArray(res.availableFlows), 'Should return list of available flows');
    assert.strictEqual(res.availableFlows.length, 2, 'Should offer both authored flows');
  });
});

console.log('\n3. Testing Step Player Advance & Retreat Logic:');

class MockStepPlayer {
  constructor(flow) {
    this.flow = flow;
    this.currentIndex = 0;
    this.ended = false;
  }

  next() {
    if (this.currentIndex < this.flow.steps.length - 1) {
      this.currentIndex++;
    } else {
      this.ended = true;
    }
  }

  back() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  getCurrentStep() {
    return this.flow.steps[this.currentIndex];
  }
}

it('Step player starts at step 0 of Flow A', () => {
  const player = new MockStepPlayer(flows['create-repo']);
  assert.strictEqual(player.currentIndex, 0);
  assert.strictEqual(player.getCurrentStep().id, 'step-repo-name');
});

it('Step player advances cleanly through all 5 steps of Flow A', () => {
  const player = new MockStepPlayer(flows['create-repo']);
  // Step 0: step-repo-name
  assert.strictEqual(player.getCurrentStep().id, 'step-repo-name');
  player.next(); // Step 1: step-repo-desc
  assert.strictEqual(player.getCurrentStep().id, 'step-repo-desc');
  player.next(); // Step 2: step-visibility
  assert.strictEqual(player.getCurrentStep().id, 'step-visibility');
  player.next(); // Step 3: step-readme
  assert.strictEqual(player.getCurrentStep().id, 'step-readme');
  player.next(); // Step 4: step-submit
  assert.strictEqual(player.getCurrentStep().id, 'step-submit');
  assert.strictEqual(player.currentIndex, 4);
});

it('Step player retreats cleanly using back button', () => {
  const player = new MockStepPlayer(flows['create-repo']);
  player.next(); // 1
  player.next(); // 2
  assert.strictEqual(player.currentIndex, 2);

  player.back(); // 1
  assert.strictEqual(player.currentIndex, 1);
  assert.strictEqual(player.getCurrentStep().id, 'step-repo-desc');

  player.back(); // 0
  assert.strictEqual(player.currentIndex, 0);

  // Back on step 0 does not retreat below 0
  player.back();
  assert.strictEqual(player.currentIndex, 0);
});

it('Step player completes on final step advance', () => {
  const player = new MockStepPlayer(flows['create-repo']);
  for (let i = 0; i < 5; i++) {
    player.next();
  }
  assert.strictEqual(player.ended, true);
});

console.log('\n4. Testing Complete Silence (Zero Voice Narration / TTS):');
import fs from 'fs';
it('Extension content scripts contain zero speechSynthesis calls', () => {
  const contentCode = fs.readFileSync('extension/content/content.js', 'utf-8');
  assert.ok(!contentCode.includes('speechSynthesis'), 'content.js must not contain speechSynthesis');
  assert.ok(!contentCode.includes('SpeechSynthesisUtterance'), 'content.js must not contain SpeechSynthesisUtterance');
  assert.ok(!contentCode.includes('speakNarration'), 'content.js must not contain speakNarration');
});

console.log(`\n========================================`);
console.log(`UNIT TEST RESULTS: ${passedTests} passed, ${failedTests} failed`);
console.log(`========================================\n`);

if (failedTests > 0) {
  process.exit(1);
}
