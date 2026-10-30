// Topic data. Add a new key to TOPICS to add a lesson; the engine renders whatever is defined here.
// Test fields: input (lines for input()), prelude (Python run first), expect (exact output lines),
// last (final output line), inOrder (lowercase text that must appear in order), not (text that must NOT appear).
window.TOPICS = { loops: {
  title: 'Python Loops', tagline: "Make the computer repeat work so you don't have to.",
  objectives: ['Use a for loop with range()', 'Loop over the items in a list', 'Write a while loop whose condition can end', 'Stop a loop with break and avoid infinite loops'],
  learn: [
    { h: 'for + range: repeat a set number of times', p: 'Doing 3 push-ups? You know the count in advance, so use a <code>for</code> loop.',
      code: 'for i in range(3):\n    print("Hello", i)', explain: '<code>range(3)</code> gives 0, 1, 2. It starts at 0 and stops <em>before</em> 3. The indented line runs once per value.' },
    { h: 'for + list: visit every item', p: 'Like checking each item on a shopping list.',
      code: 'fruits = ["apple", "mango", "banana"]\nfor fruit in fruits:\n    print("I like", fruit)', explain: 'Each time round, <code>fruit</code> holds the next item in the list.' },
    { h: 'while: repeat until something changes', p: 'Like a phone battery: keep going while there is charge left.',
      code: 'battery = 3\nwhile battery > 0:\n    print("Battery:", battery)\n    battery = battery - 1\nprint("Empty!")', explain: 'Python checks <code>battery > 0</code> before every round. Something inside the loop must change it, or the loop never ends.' },
    { h: 'break and infinite loops', p: '<code>while True</code> never ends by itself. <code>break</code> is the exit door.',
      code: 'count = 0\nwhile True:\n    count += 1\n    if count == 3:\n        break\nprint("Stopped at", count)', explain: 'Forget to change the variable in a while loop and it runs forever. This editor stops your program after 5 seconds.' }
  ],
  challenges: [
    { id: 'ex1', stage: 'practice', title: 'Easy: Count to 5', xp: 10, skills: 'for loops, range()',
      prompt: 'The starter prints 0 to 4. Change it so it prints the numbers <b>1 to 5</b>, one per line.',
      starter: 'for i in range(5):\n    print(i)\n',
      hints: ['range(5) starts at 0. How can you start at 1?', 'range(start, stop) stops before the stop number.', 'You need range(1, 6).'],
      tests: [{ name: 'Prints 1 to 5', expect: ['1', '2', '3', '4', '5'] }], next: 'Try the medium exercise.' },
    { id: 'ex2', stage: 'practice', title: 'Medium: Keep doubling', xp: 20, skills: 'while loops, changing the loop variable',
      prompt: 'Start with <code>n = 1</code>. While n is less than 100, print n and then double it. Run it first: what happens?',
      starter: 'n = 1\nwhile n < 100:\n    print(n)\n    # Change n so the loop can end!\n',
      hints: ['If n never changes, the condition is always True.', 'Doubling means multiplying by 2.', 'Add n = n * 2 after the print.'],
      tests: [{ name: 'Prints 1, 2, 4 ... 64', expect: ['1', '2', '4', '8', '16', '32', '64'] }], next: 'Try the hard exercise.' },
    { id: 'ex3', stage: 'practice', title: 'Hard: Sum the evens', xp: 30, skills: 'while True, break, input, conditions in loops',
      prompt: 'Keep asking for numbers. Stop when the user types <code>stop</code>. Then print the total of the <b>even</b> numbers entered. Put values in the Input box, one per line.',
      starter: 'total = 0\nwhile True:\n    text = input("Number (or stop): ")\n    # Stop the loop when text is "stop"\n    # Otherwise add int(text) to total only if it is even\nprint(total)\n',
      hints: ['Use if text == "stop": break', 'A number n is even when n % 2 == 0.', 'Convert with int(text) before doing maths.'],
      tests: [{ name: '4, 7, 10 gives 14', input: ['4', '7', '10', 'stop'], last: '14' }, { name: 'Only stop gives 0', input: ['stop'], last: '0' }, { name: 'Only odd numbers gives 0', input: ['3', '5', 'stop'], last: '0' }], next: 'Build the guessing game.' },
    { id: 'proj', stage: 'build', title: 'Project: Number Guessing Game', xp: 50, skills: 'loops with input, counters, comparing values',
      prompt: 'The computer picks a secret number. Loop until the player guesses it. After each guess print <code>Too low!</code> or <code>Too high!</code>. When right, print <code>Correct! You needed N guesses</code>. Use <code>random.randint(1, 10)</code> and count the guesses.',
      starter: 'import random\n\nsecret = random.randint(1, 10)\nguesses = 0\n\n# Loop: ask for a guess, count it, then print Too low!, Too high! or Correct!\n',
      hints: ['Use while True and break when the guess is right.', 'Add 1 to guesses every time you ask.', 'Compare int(input(...)) to secret using if / elif / else.'],
      tests: [{ name: 'Low, high, then correct (3 guesses)', prelude: 'import random\nrandom.randint = lambda a, b: 7\n', input: ['3', '9', '7'], inOrder: ['too low', 'too high', 'correct', '3 guesses'] },
              { name: 'Correct on the first try', prelude: 'import random\nrandom.randint = lambda a, b: 7\n', input: ['7'], inOrder: ['correct', '1 guess'], not: ['too'] }], next: 'Take the final challenge.' },
    { id: 'final', stage: 'build', title: 'Final challenge: Lockout', xp: 60, skills: 'limited attempts, loops that end two ways',
      prompt: 'A login allows <b>3 attempts</b>. The password is <code>python</code>. Ask for the password in a loop. On success print <code>Access granted</code> and stop asking. After 3 wrong tries print <code>Locked out</code>.',
      starter: 'PASSWORD = "python"\nMAX_ATTEMPTS = 3\n\n# Use a loop to ask for the password up to MAX_ATTEMPTS times\n',
      hints: ['for attempt in range(MAX_ATTEMPTS) limits the tries.', 'break (or a flag) stops the loop on success.', 'Python for loops have an else: it runs only if no break happened.'],
      tests: [{ name: 'Right on the 3rd try', input: ['a', 'b', 'python'], inOrder: ['access granted'], not: ['locked out'] },
              { name: 'Three wrong tries lock out', input: ['a', 'b', 'c', 'python'], inOrder: ['locked out'], not: ['access granted'] },
              { name: 'Right on the 1st try', input: ['python'], inOrder: ['access granted'], not: ['locked out'] }], next: 'You finished every challenge!' }
  ],
  badges: [
    { id: 'starter', name: 'Loop Starter', icon: '🔁', needs: ['ex1', 'ex2', 'ex3'] },
    { id: 'guesser', name: 'Number Guesser', icon: '🎯', needs: ['proj'] },
    { id: 'guard', name: 'Lockout Guardian', icon: '🔐', needs: ['final'] },
    { id: 'master', name: 'Loop Master', icon: '🏆', needs: ['ex1', 'ex2', 'ex3', 'proj', 'final'] }
  ]
}};
