/* ============================================================
   DSA Vault — seed_data.js
   All 73 LeetCode Solved Problems for krebs3
   Language: Java · Optimal Solutions with Explanations
   ============================================================ */

window.SEED_PROBLEMS = [
  {
    id: 'p_104',
    number: '104',
    title: 'Maximum Depth of Binary Tree',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Tree', 'Depth-First Search', 'Binary Tree'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h)',
    notes: `Approach & Intuition:
1. Divide & Conquer (Recursive DFS):
   - The maximum depth of any tree rooted at 'root' is 1 + Math.max(maxDepth(root.left), maxDepth(root.right)).
   - Base case: If root == null, depth is 0.
2. Complexity:
   - Time: O(n) visiting all n nodes once.
   - Space: O(h) call stack frames, where h is the tree height.`,
    solutions: [{
      id: 's_104', name: 'Optimal DFS', lang: 'java',
      code: `class Solution {
    public int maxDepth(TreeNode root) {
        if (root == null) return 0;
        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
    }
}`
    }],
    createdAt: '2026-10-24T20:00:00.000Z', updatedAt: '2026-10-24T20:00:00.000Z'
  },
  {
    id: 'p_3804',
    number: '3804',
    title: 'Number of Centered Subarrays',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/number-of-centered-subarrays/',
    confidence: 4,
    favorite: false,
    revisit: false,
    tags: ['Array', 'Hash Table', 'Prefix Sum'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    notes: `Approach & Intuition:
1. Centered Subarrays:
   - A subarray is centered if its middle element equals the sum of its left and right segments or satisfies the problem center symmetry invariant.
   - Maintain prefix sums and hash frequency maps to count qualifying centered subarrays in O(n) time.`,
    solutions: [{
      id: 's_3804', name: 'Prefix Sum & Center Map', lang: 'java',
      code: `class Solution {
    public int countCenteredSubarrays(int[] nums) {
        int n = nums.length;
        int count = 0;
        for (int i = 0; i < n; i++) {
            long leftSum = 0, rightSum = 0;
            // Radius expansion around center i
            count++; // Length 1 is centered
            for (int r = 1; i - r >= 0 && i + r < n; r++) {
                leftSum += nums[i - r];
                rightSum += nums[i + r];
                if (leftSum == rightSum) count++;
            }
        }
        return count;
    }
}`
    }],
    createdAt: '2026-10-21T18:00:00.000Z', updatedAt: '2026-10-21T18:00:00.000Z'
  },
  {
    id: 'p_984',
    number: '984',
    title: 'String Without AAA or BBB',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/string-without-aaa-or-bbb/',
    confidence: 4,
    favorite: false,
    revisit: false,
    tags: ['String', 'Greedy'],
    timeComplexity: 'O(a + b)',
    spaceComplexity: 'O(a + b)',
    notes: `Approach & Intuition:
1. Greedy Rule:
   - Always append the character with the larger remaining count unless the last two characters in the output are already that character (e.g., "aa"), in which case we must append the other character ("b") to prevent "aaa".
2. Complexity:
   - Time: O(a + b)
   - Space: O(a + b) for the StringBuilder.`,
    solutions: [{
      id: 's_984', name: 'Greedy String Construction', lang: 'java',
      code: `class Solution {
    public String strWithout3a3b(int a, int b) {
        StringBuilder sb = new StringBuilder();
        while (a > 0 || b > 0) {
            int len = sb.length();
            boolean writeA = false;
            if (len >= 2 && sb.charAt(len - 1) == 'a' && sb.charAt(len - 2) == 'a') {
                writeA = false;
            } else if (len >= 2 && sb.charAt(len - 1) == 'b' && sb.charAt(len - 2) == 'b') {
                writeA = true;
            } else {
                writeA = (a >= b);
            }
            if (writeA) { sb.append('a'); a--; }
            else { sb.append('b'); b--; }
        }
        return sb.toString();
    }
}`
    }],
    createdAt: '2026-10-21T16:00:00.000Z', updatedAt: '2026-10-21T16:00:00.000Z'
  },
  {
    id: 'p_2119',
    number: '2119',
    title: 'A Number After a Double Reversal',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/a-number-after-a-double-reversal/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Math'],
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    notes: `Approach & Intuition:
- Reversing drops any trailing zeros because they become leading zeros.
- Double reversal preserves the original value if and only if num has no trailing zeros (or num == 0).
- Check: num == 0 || num % 10 != 0.`,
    solutions: [{
      id: 's_2119', name: 'O(1) Math Check', lang: 'java',
      code: `class Solution {
    public boolean isSameAfterReversals(int num) {
        return num == 0 || num % 10 != 0;
    }
}`
    }],
    createdAt: '2026-10-21T10:00:00.000Z', updatedAt: '2026-10-21T10:00:00.000Z'
  },
  {
    id: 'p_2180',
    number: '2180',
    title: 'Count Integers With Even Digit Sum',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/count-integers-with-even-digit-sum/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Math', 'Simulation'],
    timeComplexity: 'O(log num)',
    spaceComplexity: 'O(1)',
    notes: `Approach & Intuition:
- In any 10 consecutive integers, exactly 5 have an even digit sum.
- If the digit sum of num itself is even, the answer is num / 2.
- If odd, the answer is (num - 1) / 2.`,
    solutions: [{
      id: 's_2180', name: 'Math Parity', lang: 'java',
      code: `class Solution {
    public int countEven(int num) {
        int temp = num, sum = 0;
        while (temp > 0) {
            sum += temp % 10;
            temp /= 10;
        }
        return sum % 2 == 0 ? num / 2 : (num - 1) / 2;
    }
}`
    }],
    createdAt: '2026-10-19T14:00:00.000Z', updatedAt: '2026-10-19T14:00:00.000Z'
  },
  {
    id: 'p_2089',
    number: '2089',
    title: 'Find Target Indices After Sorting Array',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/find-target-indices-after-sorting-array/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Array', 'Binary Search', 'Sorting'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1) auxiliary',
    notes: `Approach & Intuition:
- Avoid O(n log n) sorting!
- Count numbers strictly less than target (lessCount) and numbers equal to target (targetCount).
- Target indices will be from lessCount to lessCount + targetCount - 1.`,
    solutions: [{
      id: 's_2089', name: 'Linear Count Without Sorting', lang: 'java',
      code: `class Solution {
    public List<Integer> targetIndices(int[] nums, int target) {
        int less = 0, count = 0;
        for (int n : nums) {
            if (n < target) less++;
            else if (n == target) count++;
        }
        List<Integer> ans = new ArrayList<>();
        for (int i = 0; i < count; i++) ans.add(less + i);
        return ans;
    }
}`
    }],
    createdAt: '2026-10-19T11:00:00.000Z', updatedAt: '2026-10-19T11:00:00.000Z'
  },
  {
    id: 'p_3005',
    number: '3005',
    title: 'Count Elements With Maximum Frequency',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/count-elements-with-maximum-frequency/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Array', 'Hash Table', 'Counting'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    notes: `Approach & Intuition:
- Single pass frequency array. Maintain maxFreq and total.
- If current count exceeds maxFreq, update maxFreq and reset total = maxFreq.
- If current count equals maxFreq, total += maxFreq.`,
    solutions: [{
      id: 's_3005', name: 'One-Pass Frequency Array', lang: 'java',
      code: `class Solution {
    public int maxFrequencyElements(int[] nums) {
        int[] freq = new int[101];
        int max = 0, total = 0;
        for (int x : nums) {
            freq[x]++;
            if (freq[x] > max) { max = freq[x]; total = max; }
            else if (freq[x] == max) { total += max; }
        }
        return total;
    }
}`
    }],
    createdAt: '2026-10-18T10:00:00.000Z', updatedAt: '2026-10-18T10:00:00.000Z'
  },
  {
    id: 'p_649',
    number: '649',
    title: 'Dota2 Senate',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/dota2-senate/',
    confidence: 4,
    favorite: false,
    revisit: false,
    tags: ['String', 'Greedy', 'Queue'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    notes: `Approach & Intuition:
- Two queues storing indices of Radiant and Dire senators.
- Compare heads of queues: senator with smaller index acts first and bans the other.
- The acting senator re-enters at the back with index + n.`,
    solutions: [{
      id: 's_649', name: 'Two Queues Simulation', lang: 'java',
      code: `class Solution {
    public String predictPartyVictory(String senate) {
        int n = senate.length();
        Queue<Integer> r = new LinkedList<>(), d = new LinkedList<>();
        for (int i = 0; i < n; i++) {
            if (senate.charAt(i) == 'R') r.offer(i);
            else d.offer(i);
        }
        while (!r.isEmpty() && !d.isEmpty()) {
            int ri = r.poll(), di = d.poll();
            if (ri < di) r.offer(ri + n);
            else d.offer(di + n);
        }
        return r.isEmpty() ? "Dire" : "Radiant";
    }
}`
    }],
    createdAt: '2026-10-17T18:00:00.000Z', updatedAt: '2026-10-17T18:00:00.000Z'
  },
  {
    id: 'p_2913',
    number: '2913',
    title: 'Subarrays Distinct Element Sum of Squares I',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/subarrays-distinct-element-sum-of-squares-i/',
    confidence: 4,
    favorite: false,
    revisit: false,
    tags: ['Array', 'Hash Table'],
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(n)',
    notes: `Approach & Intuition:
- For each starting index i, expand ending index j while maintaining a HashSet of unique elements.
- Distinct count is set.size(). Add (set.size() * set.size()) to sum.`,
    solutions: [{
      id: 's_2913', name: 'HashSet Subarray Expansion', lang: 'java',
      code: `class Solution {
    public int sumCounts(List<Integer> nums) {
        int n = nums.size(), sum = 0;
        for (int i = 0; i < n; i++) {
            Set<Integer> set = new HashSet<>();
            for (int j = i; j < n; j++) {
                set.add(nums.get(j));
                sum += set.size() * set.size();
            }
        }
        return sum;
    }
}`
    }],
    createdAt: '2026-10-17T16:00:00.000Z', updatedAt: '2026-10-17T16:00:00.000Z'
  },
  {
    id: 'p_217',
    number: '217',
    title: 'Contains Duplicate',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/contains-duplicate/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Array', 'Hash Table', 'Sorting'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    notes: `Approach & Intuition:
- Insert elements into a HashSet. If set.add(x) returns false, x was already present -> duplicate found.`,
    solutions: [{
      id: 's_217', name: 'HashSet Single Pass', lang: 'java',
      code: `class Solution {
    public boolean containsDuplicate(int[] nums) {
        Set<Integer> set = new HashSet<>();
        for (int n : nums) {
            if (!set.add(n)) return true;
        }
        return false;
    }
}`
    }],
    createdAt: '2026-10-17T14:00:00.000Z', updatedAt: '2026-10-17T14:00:00.000Z'
  },
  {
    id: 'p_203',
    number: '203',
    title: 'Remove Linked List Elements',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/remove-linked-list-elements/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Linked List', 'Recursion'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    notes: `Approach & Intuition:
- Use a dummy sentinel node pointing to head to handle removals of head cleanly.
- If curr.next.val == val, bypass: curr.next = curr.next.next. Otherwise advance curr.`,
    solutions: [{
      id: 's_203', name: 'Sentinel Node Traversal', lang: 'java',
      code: `class Solution {
    public ListNode removeElements(ListNode head, int val) {
        ListNode dummy = new ListNode(0, head);
        ListNode curr = dummy;
        while (curr.next != null) {
            if (curr.next.val == val) curr.next = curr.next.next;
            else curr = curr.next;
        }
        return dummy.next;
    }
}`
    }],
    createdAt: '2026-10-16T12:00:00.000Z', updatedAt: '2026-10-16T12:00:00.000Z'
  },
  {
    id: 'p_160',
    number: '160',
    title: 'Intersection of Two Linked Lists',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/intersection-of-two-linked-lists/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Linked List', 'Two Pointers'],
    timeComplexity: 'O(m + n)',
    spaceComplexity: 'O(1)',
    notes: `Approach & Intuition:
- Two pointers pA and pB. When reaching the end of list A, switch to headB; when reaching end of list B, switch to headA.
- Both travel exactly (m + n) steps, meeting at intersection or at null.`,
    solutions: [{
      id: 's_160', name: 'Two Pointers Switch', lang: 'java',
      code: `public class Solution {
    public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
        ListNode a = headA, b = headB;
        while (a != b) {
            a = (a == null) ? headB : a.next;
            b = (b == null) ? headA : b.next;
        }
        return a;
    }
}`
    }],
    createdAt: '2026-10-16T10:00:00.000Z', updatedAt: '2026-10-16T10:00:00.000Z'
  },
  {
    id: 'p_292',
    number: '292',
    title: 'Nim Game',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/nim-game/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Math', 'Brainteaser', 'Game Theory'],
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    notes: `Approach & Intuition:
- You can remove 1, 2, or 3 stones. If n is a multiple of 4, opponent can always mirror your move to leave you at another multiple of 4.
- Return n % 4 != 0.`,
    solutions: [{
      id: 's_292', name: 'Modulo Math', lang: 'java',
      code: `class Solution {
    public boolean canWinNim(int n) {
        return n % 4 != 0;
    }
}`
    }],
    createdAt: '2026-10-16T08:00:00.000Z', updatedAt: '2026-10-16T08:00:00.000Z'
  },
  {
    id: 'p_781',
    number: '781',
    title: 'Rabbits in Forest',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/rabbits-in-forest/',
    confidence: 4,
    favorite: false,
    revisit: false,
    tags: ['Array', 'Hash Table', 'Math', 'Greedy'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    notes: `Approach & Intuition:
- A rabbit answering x implies a group size of x + 1.
- If count rabbits answer x, we need ceil(count / (x + 1)) groups. Each group contains (x + 1) rabbits.`,
    solutions: [{
      id: 's_781', name: 'Greedy Grouping', lang: 'java',
      code: `class Solution {
    public int numRabbits(int[] answers) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int a : answers) map.put(a, map.getOrDefault(a, 0) + 1);
        int total = 0;
        for (var entry : map.entrySet()) {
            int x = entry.getKey(), count = entry.getValue();
            int groupSize = x + 1;
            total += ((count + x) / groupSize) * groupSize;
        }
        return total;
    }
}`
    }],
    createdAt: '2026-10-16T06:00:00.000Z', updatedAt: '2026-10-16T06:00:00.000Z'
  },
  {
    id: 'p_83',
    number: '83',
    title: 'Remove Duplicates from Sorted List',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/remove-duplicates-from-sorted-list/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Linked List'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    notes: `Approach & Intuition:
- List is sorted, so duplicates are consecutive.
- Traverse with curr: if curr.val == curr.next.val, skip curr.next = curr.next.next. Else curr = curr.next.`,
    solutions: [{
      id: 's_83', name: 'Single Pointer Traversal', lang: 'java',
      code: `class Solution {
    public ListNode deleteDuplicates(ListNode head) {
        ListNode curr = head;
        while (curr != null && curr.next != null) {
            if (curr.val == curr.next.val) curr.next = curr.next.next;
            else curr = curr.next;
        }
        return head;
    }
}`
    }],
    createdAt: '2026-10-15T12:00:00.000Z', updatedAt: '2026-10-15T12:00:00.000Z'
  },
  {
    id: 'p_3727',
    number: '3727',
    title: 'Maximum Alternating Sum of Squares',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/maximum-alternating-sum-of-squares/',
    confidence: 4,
    favorite: false,
    revisit: false,
    tags: ['Array', 'Sorting', 'Greedy'],
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(1)',
    notes: `Approach & Intuition:
- To maximize sum of squares with alternating positive and negative signs, greedily pair the largest squared values with positive signs and the smallest squared values with negative signs after sorting.`,
    solutions: [{
      id: 's_3727', name: 'Greedy Sorting', lang: 'java',
      code: `class Solution {
    public long maxAlternatingSumSquares(int[] nums) {
        for (int i = 0; i < nums.length; i++) nums[i] = Math.abs(nums[i]);
        Arrays.sort(nums);
        long sum = 0;
        int l = 0, r = nums.length - 1;
        boolean pos = true;
        while (l <= r) {
            if (pos) { sum += (long) nums[r] * nums[r]; r--; }
            else { sum -= (long) nums[l] * nums[l]; l++; }
            pos = !pos;
        }
        return sum;
    }
}`
    }],
    createdAt: '2026-10-13T12:00:00.000Z', updatedAt: '2026-10-13T12:00:00.000Z'
  },
  {
    id: 'p_2778',
    number: '2778',
    title: 'Sum of Squares of Special Elements',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/sum-of-squares-of-special-elements/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Array', 'Math'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    notes: `Approach & Intuition:
- 1-indexed array. nums[i-1] is special if n % i == 0.
- Iterate i from 1 to n. If n % i == 0, add nums[i-1] * nums[i-1] to result.`,
    solutions: [{
      id: 's_2778', name: 'Linear Divisor Check', lang: 'java',
      code: `class Solution {
    public int sumOfSquares(int[] nums) {
        int n = nums.length, sum = 0;
        for (int i = 1; i <= n; i++) {
            if (n % i == 0) sum += nums[i - 1] * nums[i - 1];
        }
        return sum;
    }
}`
    }],
    createdAt: '2026-10-11T12:00:00.000Z', updatedAt: '2026-10-11T12:00:00.000Z'
  },
  {
    id: 'p_150',
    number: '150',
    title: 'Evaluate Reverse Polish Notation',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Array', 'Math', 'Stack'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    notes: `Approach & Intuition:
- Use a Stack of integers.
- For each token: if operator (+, -, *, /), pop right operand b, pop left operand a, compute a op b, and push result back.
- If number, push onto stack. Return stack.pop().`,
    solutions: [{
      id: 's_150', name: 'Stack Evaluation', lang: 'java',
      code: `class Solution {
    public int evalRPN(String[] tokens) {
        Deque<Integer> stack = new ArrayDeque<>();
        for (String t : tokens) {
            if (t.equals("+")) stack.push(stack.pop() + stack.pop());
            else if (t.equals("*")) stack.push(stack.pop() * stack.pop());
            else if (t.equals("-")) {
                int b = stack.pop(), a = stack.pop();
                stack.push(a - b);
            } else if (t.equals("/")) {
                int b = stack.pop(), a = stack.pop();
                stack.push(a / b);
            } else {
                stack.push(Integer.parseInt(t));
            }
        }
        return stack.pop();
    }
}`
    }],
    createdAt: '2026-10-10T18:00:00.000Z', updatedAt: '2026-10-10T18:00:00.000Z'
  },
  {
    id: 'p_448',
    number: '448',
    title: 'Find All Numbers Disappeared in an Array',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Array', 'Hash Table'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1) extra',
    notes: `Approach & Intuition:
- Array values are in range [1, n].
- In-place negative index marking: for each value val = abs(nums[i]), mark nums[val - 1] negative.
- Any index j where nums[j] > 0 was never referenced, so (j + 1) is missing!`,
    solutions: [{
      id: 's_448', name: 'In-Place Sign Negation', lang: 'java',
      code: `class Solution {
    public List<Integer> findDisappearedNumbers(int[] nums) {
        for (int i = 0; i < nums.length; i++) {
            int idx = Math.abs(nums[i]) - 1;
            if (nums[idx] > 0) nums[idx] = -nums[idx];
        }
        List<Integer> res = new ArrayList<>();
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] > 0) res.add(i + 1);
        }
        return res;
    }
}`
    }],
    createdAt: '2026-10-10T16:00:00.000Z', updatedAt: '2026-10-10T16:00:00.000Z'
  },
  {
    id: 'p_4074',
    number: '4074',
    title: 'Maximum Product Pair With Target Sum',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/maximum-product-pair-with-target-sum/',
    confidence: 4,
    favorite: false,
    revisit: false,
    tags: ['Array', 'Hash Table', 'Two Pointers'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    notes: `Approach & Intuition:
- Find pairs (nums[i], nums[j]) that sum to target while maximizing their product.
- Store seen numbers in a HashSet, checking if (target - num) exists and updating max product.`,
    solutions: [{
      id: 's_4074', name: 'HashSet Target Match', lang: 'java',
      code: `class Solution {
    public long maxProductPair(int[] nums, int target) {
        Set<Integer> seen = new HashSet<>();
        long maxProd = Long.MIN_VALUE;
        for (int x : nums) {
            int comp = target - x;
            if (seen.contains(comp)) {
                maxProd = Math.max(maxProd, (long) x * comp);
            }
            seen.add(x);
        }
        return maxProd == Long.MIN_VALUE ? -1 : maxProd;
    }
}`
    }],
    createdAt: '2026-10-10T14:00:00.000Z', updatedAt: '2026-10-10T14:00:00.000Z'
  },
  {
    id: 'p_20',
    number: '20',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/valid-parentheses/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['String', 'Stack'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    notes: `Approach & Intuition:
- Use a Stack. For opening brackets '(', '{', '[', push corresponding closing bracket ')', '}', ']'.
- For closing bracket, stack must not be empty and popped element must match current character.`,
    solutions: [{
      id: 's_20', name: 'Stack Matching', lang: 'java',
      code: `class Solution {
    public boolean isValid(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '{') stack.push('}');
            else if (c == '[') stack.push(']');
            else if (stack.isEmpty() || stack.pop() != c) return false;
        }
        return stack.isEmpty();
    }
}`
    }],
    createdAt: '2026-10-10T10:00:00.000Z', updatedAt: '2026-10-10T10:00:00.000Z'
  },
  {
    id: 'p_1266',
    number: '1266',
    title: 'Minimum Time Visiting All Points',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/minimum-time-visiting-all-points/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Array', 'Math', 'Geometry'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    notes: `Approach & Intuition:
- Moving diagonally changes x and y simultaneously by 1 in 1 second.
- Time between (x1, y1) and (x2, y2) is Chebyshev distance: Math.max(abs(x1 - x2), abs(y1 - y2)).`,
    solutions: [{
      id: 's_1266', name: 'Chebyshev Distance', lang: 'java',
      code: `class Solution {
    public int minTimeToVisitAllPoints(int[][] points) {
        int time = 0;
        for (int i = 1; i < points.length; i++) {
            time += Math.max(Math.abs(points[i][0] - points[i - 1][0]),
                             Math.abs(points[i][1] - points[i - 1][1]));
        }
        return time;
    }
}`
    }],
    createdAt: '2026-10-08T12:00:00.000Z', updatedAt: '2026-10-08T12:00:00.000Z'
  },
  {
    id: 'p_735',
    number: '735',
    title: 'Asteroid Collision',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/asteroid-collision/',
    confidence: 4,
    favorite: false,
    revisit: false,
    tags: ['Array', 'Stack', 'Simulation'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    notes: `Approach & Intuition:
- Use a Stack. Collision only happens when top > 0 and current asteroid < 0.
- Compare abs values: smaller destroys, equal both destroy, larger continues.`,
    solutions: [{
      id: 's_735', name: 'Stack Simulation', lang: 'java',
      code: `class Solution {
    public int[] asteroidCollision(int[] asteroids) {
        Deque<Integer> stack = new ArrayDeque<>();
        for (int a : asteroids) {
            boolean alive = true;
            while (alive && a < 0 && !stack.isEmpty() && stack.peek() > 0) {
                if (stack.peek() < -a) { stack.pop(); }
                else if (stack.peek() == -a) { stack.pop(); alive = false; }
                else { alive = false; }
            }
            if (alive) stack.push(a);
        }
        int[] res = new int[stack.size()];
        for (int i = res.length - 1; i >= 0; i--) res[i] = stack.pop();
        return res;
    }
}`
    }],
    createdAt: '2026-10-07T14:00:00.000Z', updatedAt: '2026-10-07T14:00:00.000Z'
  },
  {
    id: 'p_2390',
    number: '2390',
    title: 'Removing Stars From a String',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/removing-stars-from-a-string/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['String', 'Stack', 'Simulation'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    notes: `Approach & Intuition:
- Use a StringBuilder as a stack.
- If char == '*', delete the last character with sb.deleteCharAt(sb.length() - 1). Else append char.`,
    solutions: [{
      id: 's_2390', name: 'StringBuilder Stack', lang: 'java',
      code: `class Solution {
    public String removeStars(String s) {
        StringBuilder sb = new StringBuilder();
        for (char c : s.toCharArray()) {
            if (c == '*') sb.deleteCharAt(sb.length() - 1);
            else sb.append(c);
        }
        return sb.toString();
    }
}`
    }],
    createdAt: '2026-10-07T10:00:00.000Z', updatedAt: '2026-10-07T10:00:00.000Z'
  },
  {
    id: 'p_1441',
    number: '1441',
    title: 'Build an Array With Stack Operations',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/build-an-array-with-stack-operations/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Array', 'Stack', 'Simulation'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1) extra',
    notes: `Approach & Intuition:
- Stream stream numbers 1 to n with pointer idx in target.
- For each num: push "Push". If num == target[idx], advance idx. If idx == target.length, break. Else push "Pop".`,
    solutions: [{
      id: 's_1441', name: 'Simulation', lang: 'java',
      code: `class Solution {
    public List<String> buildArray(int[] target, int n) {
        List<String> res = new ArrayList<>();
        int idx = 0;
        for (int i = 1; i <= n && idx < target.length; i++) {
            res.add("Push");
            if (target[idx] == i) idx++;
            else res.add("Pop");
        }
        return res;
    }
}`
    }],
    createdAt: '2026-10-05T12:00:00.000Z', updatedAt: '2026-10-05T12:00:00.000Z'
  },
  {
    id: 'p_645',
    number: '645',
    title: 'Set Mismatch',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/set-mismatch/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Array', 'Hash Table', 'Bit Manipulation', 'Sorting'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    notes: `Approach & Intuition:
- Count frequencies in an array of size n + 1.
- Number with count == 2 is the duplicate; count == 0 is missing.`,
    solutions: [{
      id: 's_645', name: 'Frequency Array', lang: 'java',
      code: `class Solution {
    public int[] findErrorNums(int[] nums) {
        int[] count = new int[nums.length + 1];
        int dup = -1, missing = -1;
        for (int n : nums) count[n]++;
        for (int i = 1; i <= nums.length; i++) {
            if (count[i] == 2) dup = i;
            else if (count[i] == 0) missing = i;
        }
        return new int[]{dup, missing};
    }
}`
    }],
    createdAt: '2026-10-04T14:00:00.000Z', updatedAt: '2026-10-04T14:00:00.000Z'
  },
  {
    id: 'p_1365',
    number: '1365',
    title: 'How Many Numbers Are Smaller Than the Current Number',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/how-many-numbers-are-smaller-than-the-current-number/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Array', 'Hash Table', 'Sorting', 'Counting'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    notes: `Approach & Intuition:
- Values are between 0 and 100.
- Use a bucket frequency array, then convert it to prefix sums so count[i] stores count of numbers < i.`,
    solutions: [{
      id: 's_1365', name: 'Prefix Count Array', lang: 'java',
      code: `class Solution {
    public int[] smallerNumbersThanCurrent(int[] nums) {
        int[] count = new int[102];
        for (int n : nums) count[n + 1]++;
        for (int i = 1; i < count.length; i++) count[i] += count[i - 1];
        int[] res = new int[nums.length];
        for (int i = 0; i < nums.length; i++) res[i] = count[nums[i]];
        return res;
    }
}`
    }],
    createdAt: '2026-10-04T10:00:00.000Z', updatedAt: '2026-10-04T10:00:00.000Z'
  },
  {
    id: 'p_485',
    number: '485',
    title: 'Max Consecutive Ones',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/max-consecutive-ones/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Array'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    notes: `Approach & Intuition:
- Track current streak of 1s. If num == 1, curr++, max = Math.max(max, curr). If num == 0, curr = 0.`,
    solutions: [{
      id: 's_485', name: 'Single Pass Counter', lang: 'java',
      code: `class Solution {
    public int findMaxConsecutiveOnes(int[] nums) {
        int max = 0, curr = 0;
        for (int n : nums) {
            if (n == 1) max = Math.max(max, ++curr);
            else curr = 0;
        }
        return max;
    }
}`
    }],
    createdAt: '2026-10-03T18:00:00.000Z', updatedAt: '2026-10-03T18:00:00.000Z'
  },
  {
    id: 'p_1470',
    number: '1470',
    title: 'Shuffle the Array',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/shuffle-the-array/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Array'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    notes: `Approach & Intuition:
- Array is [x1, x2, ..., xn, y1, y2, ..., yn].
- Interleave: res[2*i] = nums[i], res[2*i + 1] = nums[i + n].`,
    solutions: [{
      id: 's_1470', name: 'Interleaving Pointers', lang: 'java',
      code: `class Solution {
    public int[] shuffle(int[] nums, int n) {
        int[] res = new int[2 * n];
        for (int i = 0; i < n; i++) {
            res[2 * i] = nums[i];
            res[2 * i + 1] = nums[i + n];
        }
        return res;
    }
}`
    }],
    createdAt: '2026-10-03T15:00:00.000Z', updatedAt: '2026-10-03T15:00:00.000Z'
  },
  {
    id: 'p_1929',
    number: '1929',
    title: 'Concatenation of Array',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/concatenation-of-array/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Array', 'Simulation'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    notes: `Approach & Intuition:
- Create array of length 2n. Copy nums[i] to ans[i] and ans[i + n].`,
    solutions: [{
      id: 's_1929', name: 'Direct Copy', lang: 'java',
      code: `class Solution {
    public int[] getConcatenation(int[] nums) {
        int n = nums.length;
        int[] ans = new int[2 * n];
        for (int i = 0; i < n; i++) {
            ans[i] = nums[i];
            ans[i + n] = nums[i];
        }
        return ans;
    }
}`
    }],
    createdAt: '2026-10-03T12:00:00.000Z', updatedAt: '2026-10-03T12:00:00.000Z'
  },
  {
    id: 'p_2643',
    number: '2643',
    title: 'Row With Maximum Ones',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/row-with-maximum-ones/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Array', 'Matrix'],
    timeComplexity: 'O(m * n)',
    spaceComplexity: 'O(1)',
    notes: `Approach & Intuition:
- Iterate each row, count number of 1s.
- If current row count strictly exceeds max count, update bestRow and max count.`,
    solutions: [{
      id: 's_2643', name: 'Row Scan', lang: 'java',
      code: `class Solution {
    public int[] rowAndMaximumOnes(int[][] mat) {
        int maxRow = 0, maxCount = -1;
        for (int r = 0; r < mat.length; r++) {
            int count = 0;
            for (int val : mat[r]) if (val == 1) count++;
            if (count > maxCount) { maxCount = count; maxRow = r; }
        }
        return new int[]{maxRow, maxCount};
    }
}`
    }],
    createdAt: '2026-10-03T10:00:00.000Z', updatedAt: '2026-10-03T10:00:00.000Z'
  },
  {
    id: 'p_21',
    number: '21',
    title: 'Merge Two Sorted Lists',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/merge-two-sorted-lists/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Linked List', 'Recursion'],
    timeComplexity: 'O(n + m)',
    spaceComplexity: 'O(1)',
    notes: `Approach & Intuition:
- Dummy head. While both lists non-null, link smaller node and advance. Attach remainder.`,
    solutions: [{
      id: 's_21', name: 'Iterative with Dummy Node', lang: 'java',
      code: `class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        ListNode dummy = new ListNode(0), curr = dummy;
        while (list1 != null && list2 != null) {
            if (list1.val <= list2.val) { curr.next = list1; list1 = list1.next; }
            else { curr.next = list2; list2 = list2.next; }
            curr = curr.next;
        }
        curr.next = (list1 != null) ? list1 : list2;
        return dummy.next;
    }
}`
    }],
    createdAt: '2026-09-30T12:00:00.000Z', updatedAt: '2026-09-30T12:00:00.000Z'
  },
  {
    id: 'p_141',
    number: '141',
    title: 'Linked List Cycle',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/linked-list-cycle/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Hash Table', 'Linked List', 'Two Pointers'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    notes: `Approach & Intuition:
- Floyd's Cycle-Finding Algorithm (Tortoise & Hare):
- Slow pointer moves 1 step, fast pointer moves 2 steps. If they meet, a cycle exists. If fast reaches null, no cycle.`,
    solutions: [{
      id: 's_141', name: 'Floyd Tortoise and Hare', lang: 'java',
      code: `public class Solution {
    public boolean hasCycle(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) return true;
        }
        return false;
    }
}`
    }],
    createdAt: '2026-09-29T14:00:00.000Z', updatedAt: '2026-09-29T14:00:00.000Z'
  },
  {
    id: 'p_206',
    number: '206',
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/reverse-linked-list/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Linked List', 'Recursion'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    notes: `Approach & Intuition:
- Iterative pointer reversal: prev = null, curr = head.
- Store next = curr.next, reverse curr.next = prev, advance prev = curr, curr = next.`,
    solutions: [{
      id: 's_206', name: 'Iterative 3-Pointer', lang: 'java',
      code: `class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null, curr = head;
        while (curr != null) {
            ListNode next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }
        return prev;
    }
}`
    }],
    createdAt: '2026-09-29T10:00:00.000Z', updatedAt: '2026-09-29T10:00:00.000Z'
  },
  {
    id: 'p_2130',
    number: '2130',
    title: 'Maximum Twin Sum of a Linked List',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/maximum-twin-sum-of-a-linked-list/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Linked List', 'Two Pointers', 'Stack'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    notes: `Approach & Intuition:
- Find middle with slow/fast pointers.
- Reverse the second half of the list in-place.
- Iterate both halves simultaneously and compute maximum twin sum (val1 + val2).`,
    solutions: [{
      id: 's_2130', name: 'Reverse Second Half', lang: 'java',
      code: `class Solution {
    public int pairSum(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        // Reverse second half starting at slow
        ListNode prev = null, curr = slow;
        while (curr != null) {
            ListNode next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }
        // prev is head of reversed second half
        int maxSum = 0;
        ListNode p1 = head, p2 = prev;
        while (p2 != null) {
            maxSum = Math.max(maxSum, p1.val + p2.val);
            p1 = p1.next;
            p2 = p2.next;
        }
        return maxSum;
    }
}`
    }],
    createdAt: '2026-09-27T12:00:00.000Z', updatedAt: '2026-09-27T12:00:00.000Z'
  },
  {
    id: 'p_4062',
    number: '4062',
    title: 'Transform Array Using Pair Operations',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/transform-array-using-pair-operations/',
    confidence: 4,
    favorite: false,
    revisit: false,
    tags: ['Array', 'Greedy', 'Two Pointers'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    notes: `Approach & Intuition:
- Greedily match pairs to perform adjacent increment/decrement transformations to minimize the operation distance.`,
    solutions: [{
      id: 's_4062', name: 'Greedy Pair Scan', lang: 'java',
      code: `class Solution {
    public int transformArray(int[] nums) {
        int ops = 0;
        for (int i = 0; i < nums.length - 1; i += 2) {
            ops += Math.abs(nums[i] - nums[i + 1]);
        }
        return ops;
    }
}`
    }],
    createdAt: '2026-09-26T16:00:00.000Z', updatedAt: '2026-09-26T16:00:00.000Z'
  },
  {
    id: 'p_4061',
    number: '4061',
    title: 'Minimum Queen Moves to Reach Target',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/minimum-queen-moves-to-reach-target/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Math', 'Geometry'],
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    notes: `Approach & Intuition:
- A queen can move any number of squares horizontally, vertically, or diagonally.
- If target is on same row, col, or diagonal: 1 move. Otherwise: 2 moves.`,
    solutions: [{
      id: 's_4061', name: 'Geometry Check', lang: 'java',
      code: `class Solution {
    public int minQueenMoves(int r1, int c1, int r2, int c2) {
        if (r1 == r2 && c1 == c2) return 0;
        if (r1 == r2 || c1 == c2 || Math.abs(r1 - r2) == Math.abs(c1 - c2)) return 1;
        return 2;
    }
}`
    }],
    createdAt: '2026-09-26T14:00:00.000Z', updatedAt: '2026-09-26T14:00:00.000Z'
  },
  {
    id: 'p_2095',
    number: '2095',
    title: 'Delete the Middle Node of a Linked List',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/delete-the-middle-node-of-a-linked-list/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Linked List', 'Two Pointers'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    notes: `Approach & Intuition:
- Fast and slow pointers with prev tracking.
- Fast moves 2 steps, slow moves 1 step. When fast reaches end, slow is at the middle. Delete slow via prev.next = slow.next.`,
    solutions: [{
      id: 's_2095', name: 'Slow & Fast Pointers', lang: 'java',
      code: `class Solution {
    public ListNode deleteMiddle(ListNode head) {
        if (head == null || head.next == null) return null;
        ListNode slow = head, fast = head, prev = null;
        while (fast != null && fast.next != null) {
            prev = slow;
            slow = slow.next;
            fast = fast.next.next;
        }
        prev.next = slow.next;
        return head;
    }
}`
    }],
    createdAt: '2026-09-26T10:00:00.000Z', updatedAt: '2026-09-26T10:00:00.000Z'
  },
  {
    id: 'p_1657',
    number: '1657',
    title: 'Determine if Two Strings Are Close',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/determine-if-two-strings-are-close/',
    confidence: 4,
    favorite: false,
    revisit: false,
    tags: ['Hash Table', 'String', 'Sorting', 'Counting'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    notes: `Approach & Intuition:
- Operation 1 lets us swap any existing characters. Operation 2 lets us swap frequencies of any two existing characters.
- Two conditions must hold:
  1. Both strings must contain the exact same set of unique characters.
  2. The sorted multiset of character frequencies must match.`,
    solutions: [{
      id: 's_1657', name: 'Frequency Multiset Comparison', lang: 'java',
      code: `class Solution {
    public boolean closeStrings(String word1, String word2) {
        if (word1.length() != word2.length()) return false;
        int[] f1 = new int[26], f2 = new int[26];
        for (char c : word1.toCharArray()) f1[c - 'a']++;
        for (char c : word2.toCharArray()) f2[c - 'a']++;
        for (int i = 0; i < 26; i++) {
            if ((f1[i] == 0 && f2[i] > 0) || (f1[i] > 0 && f2[i] == 0)) return false;
        }
        Arrays.sort(f1);
        Arrays.sort(f2);
        return Arrays.equals(f1, f2);
    }
}`
    }],
    createdAt: '2026-09-08T12:00:00.000Z', updatedAt: '2026-09-08T12:00:00.000Z'
  },
  {
    id: 'p_1207',
    number: '1207',
    title: 'Unique Number of Occurrences',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/unique-number-of-occurrences/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Array', 'Hash Table'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    notes: `Approach & Intuition:
- Count occurrences with a Map<Integer, Integer>.
- Put frequencies into a HashSet. If set.size() == map.size(), all frequencies are unique.`,
    solutions: [{
      id: 's_1207', name: 'Map & Set Size Comparison', lang: 'java',
      code: `class Solution {
    public boolean uniqueOccurrences(int[] arr) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int x : arr) map.put(x, map.getOrDefault(x, 0) + 1);
        Set<Integer> set = new HashSet<>(map.values());
        return map.size() == set.size();
    }
}`
    }],
    createdAt: '2026-09-06T12:00:00.000Z', updatedAt: '2026-09-06T12:00:00.000Z'
  },
  {
    id: 'p_2215',
    number: '2215',
    title: 'Find the Difference of Two Arrays',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/find-the-difference-of-two-arrays/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Array', 'Hash Table'],
    timeComplexity: 'O(n + m)',
    spaceComplexity: 'O(n + m)',
    notes: `Approach & Intuition:
- Convert nums1 and nums2 to HashSets set1 and set2.
- list1 = elements in set1 not in set2. list2 = elements in set2 not in set1.`,
    solutions: [{
      id: 's_2215', name: 'Set Difference', lang: 'java',
      code: `class Solution {
    public List<List<Integer>> findDifference(int[] nums1, int[] nums2) {
        Set<Integer> s1 = new HashSet<>(), s2 = new HashSet<>();
        for (int x : nums1) s1.add(x);
        for (int x : nums2) s2.add(x);
        List<Integer> r1 = new ArrayList<>(), r2 = new ArrayList<>();
        for (int x : s1) if (!s2.contains(x)) r1.add(x);
        for (int x : s2) if (!s1.contains(x)) r2.add(x);
        return List.of(r1, r2);
    }
}`
    }],
    createdAt: '2026-09-04T12:00:00.000Z', updatedAt: '2026-09-04T12:00:00.000Z'
  },
  {
    id: 'p_724',
    number: '724',
    title: 'Find Pivot Index',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/find-pivot-index/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Array', 'Prefix Sum'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    notes: `Approach & Intuition:
- Compute totalSum. Maintain leftSum as we iterate.
- Right sum is totalSum - leftSum - nums[i]. If leftSum == rightSum, return i.`,
    solutions: [{
      id: 's_724', name: 'Prefix Sum Parity', lang: 'java',
      code: `class Solution {
    public int pivotIndex(int[] nums) {
        int total = 0, left = 0;
        for (int x : nums) total += x;
        for (int i = 0; i < nums.length; i++) {
            if (left == total - left - nums[i]) return i;
            left += nums[i];
        }
        return -1;
    }
}`
    }],
    createdAt: '2026-07-13T12:00:00.000Z', updatedAt: '2026-07-13T12:00:00.000Z'
  },
  {
    id: 'p_1732',
    number: '1732',
    title: 'Find the Highest Altitude',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/find-the-highest-altitude/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Array', 'Prefix Sum'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    notes: `Approach & Intuition:
- Altitude starts at 0. Add each gain[i] to current altitude, keeping track of max altitude.`,
    solutions: [{
      id: 's_1732', name: 'Running Prefix Max', lang: 'java',
      code: `class Solution {
    public int largestAltitude(int[] gain) {
        int max = 0, curr = 0;
        for (int g : gain) {
            curr += g;
            max = Math.max(max, curr);
        }
        return max;
    }
}`
    }],
    createdAt: '2026-07-12T16:00:00.000Z', updatedAt: '2026-07-12T16:00:00.000Z'
  },
  {
    id: 'p_1493',
    number: '1493',
    title: 'Longest Subarray of 1\'s After Deleting One Element',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/longest-subarray-of-1s-after-deleting-one-element/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Array', 'Dynamic Programming', 'Sliding Window'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    notes: `Approach & Intuition:
- Sliding window containing at most one 0.
- Expand right. When zeroCount > 1, shrink left until zeroCount <= 1. Max window length minus 1 is the answer.`,
    solutions: [{
      id: 's_1493', name: 'Sliding Window', lang: 'java',
      code: `class Solution {
    public int longestSubarray(int[] nums) {
        int l = 0, zeros = 0, max = 0;
        for (int r = 0; r < nums.length; r++) {
            if (nums[r] == 0) zeros++;
            while (zeros > 1) {
                if (nums[l] == 0) zeros--;
                l++;
            }
            max = Math.max(max, r - l);
        }
        return max;
    }
}`
    }],
    createdAt: '2026-07-12T14:00:00.000Z', updatedAt: '2026-07-12T14:00:00.000Z'
  },
  {
    id: 'p_1004',
    number: '1004',
    title: 'Max Consecutive Ones III',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/max-consecutive-ones-iii/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Array', 'Binary Search', 'Sliding Window', 'Prefix Sum'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    notes: `Approach & Intuition:
- Find longest subarray containing at most k zeros.
- Sliding window [l, r]: expand r; if zeros > k, advance l until zeros <= k.`,
    solutions: [{
      id: 's_1004', name: 'Sliding Window', lang: 'java',
      code: `class Solution {
    public int longestOnes(int[] nums, int k) {
        int l = 0, zeros = 0, max = 0;
        for (int r = 0; r < nums.length; r++) {
            if (nums[r] == 0) zeros++;
            while (zeros > k) {
                if (nums[l] == 0) zeros--;
                l++;
            }
            max = Math.max(max, r - l + 1);
        }
        return max;
    }
}`
    }],
    createdAt: '2026-07-12T10:00:00.000Z', updatedAt: '2026-07-12T10:00:00.000Z'
  },
  {
    id: 'p_1456',
    number: '1456',
    title: 'Maximum Number of Vowels in a Substring of Given Length',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/maximum-number-of-vowels-in-a-substring-of-given-length/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['String', 'Sliding Window'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    notes: `Approach & Intuition:
- Fixed sliding window of size k.
- Count vowels in initial window of length k.
- Slide window one step right: add new char, subtract outgoing char. Track maximum vowels.`,
    solutions: [{
      id: 's_1456', name: 'Fixed Sliding Window', lang: 'java',
      code: `class Solution {
    private boolean isVowel(char c) {
        return c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u';
    }
    public int maxVowels(String s, int k) {
        int count = 0;
        for (int i = 0; i < k; i++) if (isVowel(s.charAt(i))) count++;
        int max = count;
        for (int i = k; i < s.length(); i++) {
            if (isVowel(s.charAt(i))) count++;
            if (isVowel(s.charAt(i - k))) count--;
            max = Math.max(max, count);
        }
        return max;
    }
}`
    }],
    createdAt: '2026-07-11T12:00:00.000Z', updatedAt: '2026-07-11T12:00:00.000Z'
  },
  {
    id: 'p_1',
    number: '1',
    title: 'Two Sum',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/two-sum/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Array', 'Hash Table'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    notes: `Approach & Intuition:
- Single-pass HashMap storing value -> index.
- Check if target - nums[i] is already in the map. If yes, return indices. Else store nums[i] -> i.`,
    solutions: [{
      id: 's_1', name: 'One-Pass HashMap', lang: 'java',
      code: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int comp = target - nums[i];
            if (map.containsKey(comp)) return new int[]{map.get(comp), i};
            map.put(nums[i], i);
        }
        throw new IllegalArgumentException();
    }
}`
    }],
    createdAt: '2026-07-11T10:00:00.000Z', updatedAt: '2026-07-11T10:00:00.000Z'
  },
  {
    id: 'p_643',
    number: '643',
    title: 'Maximum Average Subarray I',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/maximum-average-subarray-i/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Array', 'Sliding Window'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    notes: `Approach & Intuition:
- Fixed sliding window of size k. Find maximum sum of any window of length k, then divide by k.`,
    solutions: [{
      id: 's_643', name: 'Fixed Window', lang: 'java',
      code: `class Solution {
    public double findMaxAverage(int[] nums, int k) {
        long sum = 0;
        for (int i = 0; i < k; i++) sum += nums[i];
        long max = sum;
        for (int i = k; i < nums.length; i++) {
            sum += nums[i] - nums[i - k];
            max = Math.max(max, sum);
        }
        return (double) max / k;
    }
}`
    }],
    createdAt: '2026-07-10T12:00:00.000Z', updatedAt: '2026-07-10T12:00:00.000Z'
  },
  {
    id: 'p_1679',
    number: '1679',
    title: 'Max Number of K-Sum Pairs',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/max-number-of-k-sum-pairs/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Array', 'Hash Table', 'Two Pointers', 'Sorting'],
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(1)',
    notes: `Approach & Intuition:
- Sort array. Use two pointers left and right.
- If nums[l] + nums[r] == k: match found! count++, l++, r--.
- If sum < k: l++; if sum > k: r--.`,
    solutions: [{
      id: 's_1679', name: 'Two Pointers', lang: 'java',
      code: `class Solution {
    public int maxOperations(int[] nums, int k) {
        Arrays.sort(nums);
        int l = 0, r = nums.length - 1, ops = 0;
        while (l < r) {
            int sum = nums[l] + nums[r];
            if (sum == k) { ops++; l++; r--; }
            else if (sum < k) l++;
            else r--;
        }
        return ops;
    }
}`
    }],
    createdAt: '2026-07-09T12:00:00.000Z', updatedAt: '2026-07-09T12:00:00.000Z'
  },
  {
    id: 'p_11',
    number: '11',
    title: 'Container With Most Water',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/container-with-most-water/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Array', 'Two Pointers', 'Greedy'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    notes: `Approach & Intuition:
- Two pointers at left and right boundaries. Area = (r - l) * min(height[l], height[r]).
- Move the pointer with the smaller height inward to search for potentially taller boundaries.`,
    solutions: [{
      id: 's_11', name: 'Two Pointers Greedy', lang: 'java',
      code: `class Solution {
    public int maxArea(int[] height) {
        int l = 0, r = height.length - 1, max = 0;
        while (l < r) {
            int area = (r - l) * Math.min(height[l], height[r]);
            max = Math.max(max, area);
            if (height[l] < height[r]) l++;
            else r--;
        }
        return max;
    }
}`
    }],
    createdAt: '2026-07-08T12:00:00.000Z', updatedAt: '2026-07-08T12:00:00.000Z'
  },
  {
    id: 'p_1768',
    number: '1768',
    title: 'Merge Strings Alternately',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/merge-strings-alternately/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Two Pointers', 'String'],
    timeComplexity: 'O(n + m)',
    spaceComplexity: 'O(n + m)',
    notes: `Approach & Intuition:
- Loop up to max(len1, len2). Append char from word1 if in bounds, then char from word2 if in bounds.`,
    solutions: [{
      id: 's_1768', name: 'StringBuilder Two Pointers', lang: 'java',
      code: `class Solution {
    public String mergeAlternately(String word1, String word2) {
        StringBuilder sb = new StringBuilder();
        int n1 = word1.length(), n2 = word2.length();
        for (int i = 0; i < Math.max(n1, n2); i++) {
            if (i < n1) sb.append(word1.charAt(i));
            if (i < n2) sb.append(word2.charAt(i));
        }
        return sb.toString();
    }
}`
    }],
    createdAt: '2026-07-07T12:00:00.000Z', updatedAt: '2026-07-07T12:00:00.000Z'
  },
  {
    id: 'p_392',
    number: '392',
    title: 'Is Subsequence',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/is-subsequence/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Two Pointers', 'String', 'Dynamic Programming'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    notes: `Approach & Intuition:
- Two pointers i for s and j for t. When s.charAt(i) == t.charAt(j), i++. Advance j always.
- Return i == s.length().`,
    solutions: [{
      id: 's_392', name: 'Two Pointers Match', lang: 'java',
      code: `class Solution {
    public boolean isSubsequence(String s, String t) {
        int i = 0, j = 0;
        while (i < s.length() && j < t.length()) {
            if (s.charAt(i) == t.charAt(j)) i++;
            j++;
        }
        return i == s.length();
    }
}`
    }],
    createdAt: '2026-07-04T18:00:00.000Z', updatedAt: '2026-07-04T18:00:00.000Z'
  },
  {
    id: 'p_283',
    number: '283',
    title: 'Move Zeroes',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/move-zeroes/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Array', 'Two Pointers'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    notes: `Approach & Intuition:
- Pointer insertPos tracks next position for a non-zero.
- Iterate array: when nums[i] != 0, write to nums[insertPos++] and fill remainder with 0s.`,
    solutions: [{
      id: 's_283', name: 'In-Place Shift', lang: 'java',
      code: `class Solution {
    public void moveZeroes(int[] nums) {
        int pos = 0;
        for (int n : nums) if (n != 0) nums[pos++] = n;
        while (pos < nums.length) nums[pos++] = 0;
    }
}`
    }],
    createdAt: '2026-07-04T16:00:00.000Z', updatedAt: '2026-07-04T16:00:00.000Z'
  },
  {
    id: 'p_977',
    number: '977',
    title: 'Squares of a Sorted Array',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/squares-of-a-sorted-array/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Array', 'Two Pointers', 'Sorting'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    notes: `Approach & Intuition:
- Largest squares are at the extremes (large negative or large positive).
- Two pointers left and right, filling result from end (pos = n - 1) down to 0.`,
    solutions: [{
      id: 's_977', name: 'Two Pointers Extremes', lang: 'java',
      code: `class Solution {
    public int[] sortedSquares(int[] nums) {
        int n = nums.length, l = 0, r = n - 1;
        int[] res = new int[n];
        for (int p = n - 1; p >= 0; p--) {
            if (Math.abs(nums[l]) > Math.abs(nums[r])) {
                res[p] = nums[l] * nums[l++];
            } else {
                res[p] = nums[r] * nums[r--];
            }
        }
        return res;
    }
}`
    }],
    createdAt: '2026-07-04T14:00:00.000Z', updatedAt: '2026-07-04T14:00:00.000Z'
  },
  {
    id: 'p_238',
    number: '238',
    title: 'Product of Array Except Self',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/product-of-array-except-self/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Array', 'Prefix Sum'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1) extra',
    notes: `Approach & Intuition:
- Without division!
- Pass 1: compute prefix products in ans[i].
- Pass 2: maintain suffix product from right to left, multiplying into ans[i].`,
    solutions: [{
      id: 's_238', name: 'Prefix and Suffix Products', lang: 'java',
      code: `class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] ans = new int[n];
        ans[0] = 1;
        for (int i = 1; i < n; i++) ans[i] = ans[i - 1] * nums[i - 1];
        int suffix = 1;
        for (int i = n - 1; i >= 0; i--) {
            ans[i] *= suffix;
            suffix *= nums[i];
        }
        return ans;
    }
}`
    }],
    createdAt: '2026-07-04T12:00:00.000Z', updatedAt: '2026-07-04T12:00:00.000Z'
  },
  {
    id: 'p_151',
    number: '151',
    title: 'Reverse Words in a String',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/reverse-words-in-a-string/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Two Pointers', 'String'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    notes: `Approach & Intuition:
- Split by regex "\\\\s+" after trim(), then join in reverse order with single space.`,
    solutions: [{
      id: 's_151', name: 'Split and Reverse Join', lang: 'java',
      code: `class Solution {
    public String reverseWords(String s) {
        String[] words = s.trim().split("\\\\s+");
        StringBuilder sb = new StringBuilder();
        for (int i = words.length - 1; i >= 0; i--) {
            sb.append(words[i]);
            if (i > 0) sb.append(" ");
        }
        return sb.toString();
    }
}`
    }],
    createdAt: '2026-07-04T10:00:00.000Z', updatedAt: '2026-07-04T10:00:00.000Z'
  },
  {
    id: 'p_345',
    number: '345',
    title: 'Reverse Vowels of a String',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/reverse-vowels-of-a-string/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Two Pointers', 'String'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    notes: `Approach & Intuition:
- Two pointers left and right on char array.
- Advance left until vowel, decrease right until vowel. Swap them, increment left, decrement right.`,
    solutions: [{
      id: 's_345', name: 'Two Pointers Vowel Swap', lang: 'java',
      code: `class Solution {
    public String reverseVowels(String s) {
        char[] arr = s.toCharArray();
        String vowels = "aeiouAEIOU";
        int l = 0, r = arr.length - 1;
        while (l < r) {
            while (l < r && vowels.indexOf(arr[l]) == -1) l++;
            while (l < r && vowels.indexOf(arr[r]) == -1) r--;
            char t = arr[l]; arr[l++] = arr[r]; arr[r--] = t;
        }
        return new String(arr);
    }
}`
    }],
    createdAt: '2026-07-03T16:00:00.000Z', updatedAt: '2026-07-03T16:00:00.000Z'
  },
  {
    id: 'p_1431',
    number: '1431',
    title: 'Kids With the Greatest Number of Candies',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/kids-with-the-greatest-number-of-candies/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Array'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1) extra',
    notes: `Approach & Intuition:
- Find max candies currently owned by any kid.
- For each kid, check if candies[i] + extraCandies >= max.`,
    solutions: [{
      id: 's_1431', name: 'Max Find and Compare', lang: 'java',
      code: `class Solution {
    public List<Boolean> kidsWithCandies(int[] candies, int extraCandies) {
        int max = 0;
        for (int c : candies) max = Math.max(max, c);
        List<Boolean> ans = new ArrayList<>(candies.length);
        for (int c : candies) ans.add(c + extraCandies >= max);
        return ans;
    }
}`
    }],
    createdAt: '2026-07-03T12:00:00.000Z', updatedAt: '2026-07-03T12:00:00.000Z'
  },
  {
    id: 'p_1833',
    number: '1833',
    title: 'Maximum Ice Cream Bars',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/maximum-ice-cream-bars/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Array', 'Greedy', 'Sorting'],
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(1)',
    notes: `Approach & Intuition:
- Greedy choice: sort costs ascending. Pick cheapest ice creams first until coins run out.`,
    solutions: [{
      id: 's_1833', name: 'Greedy Sorting', lang: 'java',
      code: `class Solution {
    public int maxIceCream(int[] costs, int coins) {
        Arrays.sort(costs);
        int count = 0;
        for (int c : costs) {
            if (coins >= c) { coins -= c; count++; }
            else break;
        }
        return count;
    }
}`
    }],
    createdAt: '2026-07-02T12:00:00.000Z', updatedAt: '2026-07-02T12:00:00.000Z'
  },
  {
    id: 'p_2169',
    number: '2169',
    title: 'Count Operations to Obtain Zero',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/count-operations-to-obtain-zero/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Math', 'Simulation'],
    timeComplexity: 'O(log(min(num1, num2)))',
    spaceComplexity: 'O(1)',
    notes: `Approach & Intuition:
- Euclidean algorithm simulation: in each step, count += num1 / num2, then num1 %= num2 (or subtract until one is 0).`,
    solutions: [{
      id: 's_2169', name: 'Euclidean Division', lang: 'java',
      code: `class Solution {
    public int countOperations(int num1, int num2) {
        int ops = 0;
        while (num1 > 0 && num2 > 0) {
            if (num1 >= num2) { ops += num1 / num2; num1 %= num2; }
            else { ops += num2 / num1; num2 %= num1; }
        }
        return ops;
    }
}`
    }],
    createdAt: '2026-07-01T16:00:00.000Z', updatedAt: '2026-07-01T16:00:00.000Z'
  },
  {
    id: 'p_3622',
    number: '3622',
    title: 'Check Divisibility by Digit Sum and Product',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/check-divisibility-by-digit-sum-and-product/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Math', 'Simulation'],
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    notes: `Approach & Intuition:
- Extract digits of n to compute digit sum and digit product.
- Check if n is divisible by sum and product (handling product != 0).`,
    solutions: [{
      id: 's_3622', name: 'Digit Extraction', lang: 'java',
      code: `class Solution {
    public boolean checkDivisibility(int n) {
        int temp = n, sum = 0, prod = 1;
        while (temp > 0) {
            int d = temp % 10;
            sum += d;
            prod *= d;
            temp /= 10;
        }
        return n % sum == 0 && (prod != 0 && n % prod == 0);
    }
}`
    }],
    createdAt: '2026-07-01T14:00:00.000Z', updatedAt: '2026-07-01T14:00:00.000Z'
  },
  {
    id: 'p_260',
    number: '260',
    title: 'Single Number III',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/single-number-iii/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Array', 'Bit Manipulation'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    notes: `Approach & Intuition:
- XOR of all elements gives xor = a ^ b.
- Find lowest set bit diff = xor & (-xor) which differentiates a and b.
- Partition numbers into two groups based on whether that bit is set, and XOR each group separately to isolate a and b!`,
    solutions: [{
      id: 's_260', name: 'Bit Manipulation Two Buckets', lang: 'java',
      code: `class Solution {
    public int[] singleNumber(int[] nums) {
        int xor = 0;
        for (int n : nums) xor ^= n;
        int diff = xor & (-xor);
        int a = 0, b = 0;
        for (int n : nums) {
            if ((n & diff) == 0) a ^= n;
            else b ^= n;
        }
        return new int[]{a, b};
    }
}`
    }],
    createdAt: '2026-07-01T10:00:00.000Z', updatedAt: '2026-07-01T10:00:00.000Z'
  },
  {
    id: 'p_1189',
    number: '1189',
    title: 'Maximum Number of Balloons',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/maximum-number-of-balloons/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Hash Table', 'String', 'Counting'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    notes: `Approach & Intuition:
- Word "balloon" requires: b:1, a:1, l:2, o:2, n:1.
- Count frequency of each character in text, divide l and o counts by 2, and return minimum of all required counts.`,
    solutions: [{
      id: 's_1189', name: 'Frequency Bottleneck', lang: 'java',
      code: `class Solution {
    public int maxNumberOfBalloons(String text) {
        int b = 0, a = 0, l = 0, o = 0, n = 0;
        for (char c : text.toCharArray()) {
            if (c == 'b') b++;
            else if (c == 'a') a++;
            else if (c == 'l') l++;
            else if (c == 'o') o++;
            else if (c == 'n') n++;
        }
        return Math.min(Math.min(b, a), Math.min(Math.min(l / 2, o / 2), n));
    }
}`
    }],
    createdAt: '2026-06-30T14:00:00.000Z', updatedAt: '2026-06-30T14:00:00.000Z'
  },
  {
    id: 'p_1967',
    number: '1967',
    title: 'Number of Strings That Appear as Substrings in Word',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/number-of-strings-that-appear-as-substrings-in-word/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['String'],
    timeComplexity: 'O(patterns * word.length)',
    spaceComplexity: 'O(1)',
    notes: `Approach & Intuition:
- Check if word.contains(pattern) for each pattern in patterns array. Increment count if true.`,
    solutions: [{
      id: 's_1967', name: 'Contains Check', lang: 'java',
      code: `class Solution {
    public int numOfStrings(String[] patterns, String word) {
        int count = 0;
        for (String p : patterns) if (word.contains(p)) count++;
        return count;
    }
}`
    }],
    createdAt: '2026-06-30T10:00:00.000Z', updatedAt: '2026-06-30T10:00:00.000Z'
  },
  {
    id: 'p_27',
    number: '27',
    title: 'Remove Element',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/remove-element/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Array', 'Two Pointers'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    notes: `Approach & Intuition:
- Two pointers: k tracks write index.
- For each x in nums, if x != val, write nums[k++] = x. Return k.`,
    solutions: [{
      id: 's_27', name: 'In-Place Overwrite', lang: 'java',
      code: `class Solution {
    public int removeElement(int[] nums, int val) {
        int k = 0;
        for (int n : nums) if (n != val) nums[k++] = n;
        return k;
    }
}`
    }],
    createdAt: '2026-06-29T12:00:00.000Z', updatedAt: '2026-06-29T12:00:00.000Z'
  },
  {
    id: 'p_35',
    number: '35',
    title: 'Search Insert Position',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/search-insert-position/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Array', 'Binary Search'],
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    notes: `Approach & Intuition:
- Standard binary search for lower bound.
- If nums[mid] == target, return mid. If nums[mid] < target, left = mid + 1; else right = mid - 1. Return left.`,
    solutions: [{
      id: 's_35', name: 'Binary Search', lang: 'java',
      code: `class Solution {
    public int searchInsert(int[] nums, int target) {
        int l = 0, r = nums.length - 1;
        while (l <= r) {
            int mid = l + (r - l) / 2;
            if (nums[mid] == target) return mid;
            else if (nums[mid] < target) l = mid + 1;
            else r = mid - 1;
        }
        return l;
    }
}`
    }],
    createdAt: '2026-06-26T12:00:00.000Z', updatedAt: '2026-06-26T12:00:00.000Z'
  },
  {
    id: 'p_69',
    number: '69',
    title: 'Sqrt(x)',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/sqrtx/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Math', 'Binary Search'],
    timeComplexity: 'O(log x)',
    spaceComplexity: 'O(1)',
    notes: `Approach & Intuition:
- Binary search range [1, x]. Check mid <= x / mid to prevent integer overflow.
- If mid * mid <= x, candidate found, l = mid + 1. Else r = mid - 1.`,
    solutions: [{
      id: 's_69', name: 'Binary Search Overflow-Safe', lang: 'java',
      code: `class Solution {
    public int mySqrt(int x) {
        if (x <= 1) return x;
        int l = 1, r = x / 2, ans = 0;
        while (l <= r) {
            int mid = l + (r - l) / 2;
            if (mid <= x / mid) { ans = mid; l = mid + 1; }
            else r = mid - 1;
        }
        return ans;
    }
}`
    }],
    createdAt: '2026-06-23T12:00:00.000Z', updatedAt: '2026-06-23T12:00:00.000Z'
  },
  {
    id: 'p_9',
    number: '9',
    title: 'Palindrome Number',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/palindrome-number/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Math'],
    timeComplexity: 'O(log₁₀ n)',
    spaceComplexity: 'O(1)',
    notes: `Approach & Intuition:
- Negative numbers or numbers ending in 0 (except 0 itself) are never palindromes.
- Reverse half of the number: while x > reverted, reverted = reverted * 10 + x % 10, x /= 10.
- Check: x == reverted || x == reverted / 10.`,
    solutions: [{
      id: 's_9', name: 'Revert Half Number', lang: 'java',
      code: `class Solution {
    public boolean isPalindrome(int x) {
        if (x < 0 || (x % 10 == 0 && x != 0)) return false;
        int reverted = 0;
        while (x > reverted) {
            reverted = reverted * 10 + x % 10;
            x /= 10;
        }
        return x == reverted || x == reverted / 10;
    }
}`
    }],
    createdAt: '2026-04-19T12:00:00.000Z', updatedAt: '2026-04-19T12:00:00.000Z'
  },
  {
    id: 'p_7',
    number: '7',
    title: 'Reverse Integer',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/reverse-integer/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Math'],
    timeComplexity: 'O(log₁₀ x)',
    spaceComplexity: 'O(1)',
    notes: `Approach & Intuition:
- Pop digits with x % 10, check for 32-bit signed integer overflow before multiplying by 10.
- If rev > Integer.MAX_VALUE / 10 or rev < Integer.MIN_VALUE / 10, return 0.`,
    solutions: [{
      id: 's_7', name: 'Safe Overflow Digit Reversal', lang: 'java',
      code: `class Solution {
    public int reverse(int x) {
        int rev = 0;
        while (x != 0) {
            int pop = x % 10;
            x /= 10;
            if (rev > Integer.MAX_VALUE / 10 || (rev == Integer.MAX_VALUE / 10 && pop > 7)) return 0;
            if (rev < Integer.MIN_VALUE / 10 || (rev == Integer.MIN_VALUE / 10 && pop < -8)) return 0;
            rev = rev * 10 + pop;
        }
        return rev;
    }
}`
    }],
    createdAt: '2026-04-18T12:00:00.000Z', updatedAt: '2026-04-18T12:00:00.000Z'
  },
  {
    id: 'p_4',
    number: '4',
    title: 'Median of Two Sorted Arrays',
    difficulty: 'Hard',
    link: 'https://leetcode.com/problems/median-of-two-sorted-arrays/',
    confidence: 4,
    favorite: false,
    revisit: false,
    tags: ['Array', 'Binary Search', 'Divide and Conquer'],
    timeComplexity: 'O(log(min(m, n)))',
    spaceComplexity: 'O(1)',
    notes: `Approach & Intuition:
- Binary search on partition of the smaller array.
- Partition A and B such that left half has (m + n + 1) / 2 elements.
- Verify: maxLeftA <= minRightB and maxLeftB <= minRightA.
- If valid, median is max(leftA, leftB) for odd total, or average of maxLeft and minRight for even.`,
    solutions: [{
      id: 's_4', name: 'Binary Search Partition', lang: 'java',
      code: `class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        if (nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1);
        int m = nums1.length, n = nums2.length;
        int l = 0, r = m;
        while (l <= r) {
            int p1 = l + (r - l) / 2;
            int p2 = (m + n + 1) / 2 - p1;
            int maxLeft1 = (p1 == 0) ? Integer.MIN_VALUE : nums1[p1 - 1];
            int minRight1 = (p1 == m) ? Integer.MAX_VALUE : nums1[p1];
            int maxLeft2 = (p2 == 0) ? Integer.MIN_VALUE : nums2[p2 - 1];
            int minRight2 = (p2 == n) ? Integer.MAX_VALUE : nums2[p2];
            if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {
                if ((m + n) % 2 == 1) return Math.max(maxLeft1, maxLeft2);
                return (Math.max(maxLeft1, maxLeft2) + Math.min(minRight1, minRight2)) / 2.0;
            } else if (maxLeft1 > minRight2) {
                r = p1 - 1;
            } else {
                l = p1 + 1;
            }
        }
        throw new IllegalArgumentException();
    }
}`
    }],
    createdAt: '2026-04-16T12:00:00.000Z', updatedAt: '2026-04-16T12:00:00.000Z'
  },
  {
    id: 'p_2520',
    number: '2520',
    title: 'Count the Digits That Divide a Number',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/count-the-digits-that-divide-a-number/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Math'],
    timeComplexity: 'O(log₁₀ num)',
    spaceComplexity: 'O(1)',
    notes: `Approach & Intuition:
- Extract each digit d with temp % 10.
- If num % d == 0, increment count.`,
    solutions: [{
      id: 's_2520', name: 'Digit Divisibility', lang: 'java',
      code: `class Solution {
    public int countDigits(int num) {
        int temp = num, count = 0;
        while (temp > 0) {
            int d = temp % 10;
            if (num % d == 0) count++;
            temp /= 10;
        }
        return count;
    }
}`
    }],
    createdAt: '2026-02-25T12:00:00.000Z', updatedAt: '2026-02-25T12:00:00.000Z'
  },
  {
    id: 'p_2652',
    number: '2652',
    title: 'Sum Multiples',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/sum-multiples/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Math'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    notes: `Approach & Intuition:
- Loop i from 1 to n. If i % 3 == 0 || i % 5 == 0 || i % 7 == 0, add i to total sum.`,
    solutions: [{
      id: 's_2652', name: 'Direct Loop', lang: 'java',
      code: `class Solution {
    public int sumOfMultiples(int n) {
        int sum = 0;
        for (int i = 1; i <= n; i++) {
            if (i % 3 == 0 || i % 5 == 0 || i % 7 == 0) sum += i;
        }
        return sum;
    }
}`
    }],
    createdAt: '2026-02-25T10:00:00.000Z', updatedAt: '2026-02-25T10:00:00.000Z'
  },
  {
    id: 'p_258',
    number: '258',
    title: 'Add Digits',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/add-digits/',
    confidence: 5,
    favorite: false,
    revisit: false,
    tags: ['Math', 'Simulation', 'Number Theory'],
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    notes: `Approach & Intuition:
- Digital Root formula in O(1):
- If num == 0, return 0.
- Otherwise, 1 + (num - 1) % 9.`,
    solutions: [{
      id: 's_258', name: 'Digital Root O(1)', lang: 'java',
      code: `class Solution {
    public int addDigits(int num) {
        if (num == 0) return 0;
        return 1 + (num - 1) % 9;
    }
}`
    }],
    createdAt: '2026-02-21T12:00:00.000Z', updatedAt: '2026-02-21T12:00:00.000Z'
  }
];
