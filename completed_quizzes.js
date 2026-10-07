let currentQuizData = [];
let currentQuestionIndex = 0;
let isReviewMode = true; // Tracks if the user is reviewing or taking the quiz

// The 20-item JSON data for HTML Elements
const htmlElementsQuiz = [
  {
    "question": "Which HTML element is used for the largest heading?",
    "correct_answer": "<h1>",
    "wrong_answers": ["<heading>", "<h6>", "<head>"]
  },
  {
    "question": "Which HTML element is used to define a paragraph?",
    "correct_answer": "<p>",
    "wrong_answers": ["<para>", "<paragraph>", "<text>"]
  },
  {
    "question": "Which HTML element is used to insert a line break?",
    "correct_answer": "<br>",
    "wrong_answers": ["<lb>", "<break>", "<newline>"]
  },
  {
    "question": "Which HTML element is used to create a hyperlink?",
    "correct_answer": "<a>",
    "wrong_answers": ["<link>", "<href>", "<nav>"]
  },
  {
    "question": "Which HTML element is used to embed an image?",
    "correct_answer": "<img>",
    "wrong_answers": ["<image>", "<pic>", "<src>"]
  },
  {
    "question": "Which HTML element is used to define an unordered (bulleted) list?",
    "correct_answer": "<ul>",
    "wrong_answers": ["<ol>", "<list>", "<li>"]
  },
  {
    "question": "Which HTML element is used to define an ordered (numbered) list?",
    "correct_answer": "<ol>",
    "wrong_answers": ["<ul>", "<list>", "<nl>"]
  },
  {
    "question": "Which HTML element is used to define a list item?",
    "correct_answer": "<li>",
    "wrong_answers": ["<item>", "<list-item>", "<ul>"]
  },
  {
    "question": "Which HTML element is used to define a table?",
    "correct_answer": "<table>",
    "wrong_answers": ["<grid>", "<tbl>", "<data-table>"]
  },
  {
    "question": "Which HTML element is used to define a table row?",
    "correct_answer": "<tr>",
    "wrong_answers": ["<td>", "<row>", "<table-row>"]
  },
  {
    "question": "Which HTML element is used to define a standard table data cell?",
    "correct_answer": "<td>",
    "wrong_answers": ["<tr>", "<tc>", "<cell>"]
  },
  {
    "question": "Which HTML element is used to define a table header cell?",
    "correct_answer": "<th>",
    "wrong_answers": ["<header>", "<td>", "<thead>"]
  },
  {
    "question": "Which HTML element is used to define text with strong importance (typically rendered in bold)?",
    "correct_answer": "<strong>",
    "wrong_answers": ["<b>", "<bold>", "<heavy>"]
  },
  {
    "question": "Which HTML element is used to define emphasized text (typically rendered in italics)?",
    "correct_answer": "<em>",
    "wrong_answers": ["<i>", "<italic>", "<emphasis>"]
  },
  {
    "question": "Which HTML element is used to create a drop-down list?",
    "correct_answer": "<select>",
    "wrong_answers": ["<dropdown>", "<listbox>", "<option>"]
  },
  {
    "question": "Which HTML element is used to define an option in a drop-down list?",
    "correct_answer": "<option>",
    "wrong_answers": ["<item>", "<choice>", "<select-item>"]
  },
  {
    "question": "Which HTML element is used to define an HTML form for user input?",
    "correct_answer": "<form>",
    "wrong_answers": ["<input>", "<submit>", "<form-group>"]
  },
  {
    "question": "Which HTML element is used to define an input field?",
    "correct_answer": "<input>",
    "wrong_answers": ["<textfield>", "<textbox>", "<text>"]
  },
  {
    "question": "Which HTML element is used to define a clickable button?",
    "correct_answer": "<button>",
    "wrong_answers": ["<btn>", "<submit>", "<action>"]
  },
  {
    "question": "Which HTML element is used as a generic container for flow content?",
    "correct_answer": "<div>",
    "wrong_answers": ["<span>", "<section>", "<container>"]
  }
];

const javaPrintQuiz = [
  {
    "question": "Which command is used to output text to the console in Java without adding a new line?",
    "correct_answer": "System.out.print()",
    "wrong_answers": ["System.out.println()", "Console.print()", "System.print()"]
  },
  {
    "question": "Which method appends a line break automatically after the output?",
    "correct_answer": "System.out.println()",
    "wrong_answers": ["System.out.print()", "System.out.printf()", "Console.println()"]
  },
  {
    "question": "Which method is used for formatted console output in Java?",
    "correct_answer": "System.out.printf()",
    "wrong_answers": ["System.out.format()", "System.out.print()", "System.out.println()"]
  },
  {
    "question": "What is the correct escape sequence to insert a new line in a Java string?",
    "correct_answer": "\\n",
    "wrong_answers": ["\\t", "\\r", "\\l"]
  },
  {
    "question": "What is the correct escape sequence to insert a tab space in a Java string?",
    "correct_answer": "\\t",
    "wrong_answers": ["\\s", "\\n", "\\b"]
  },
  {
    "question": "How do you output a double quote character inside a string literal?",
    "correct_answer": "\\\"",
    "wrong_answers": ["\"\"", "'\"'", "\\'"]
  },
  {
    "question": "How do you output a backslash character inside a Java string?",
    "correct_answer": "\\\\",
    "wrong_answers": ["\\", "//", "\\/"]
  },
  {
    "question": "Which package is automatically imported in Java, granting access to the System class?",
    "correct_answer": "java.lang",
    "wrong_answers": ["java.util", "java.io", "java.system"]
  },
  {
    "question": "In the statement System.out.println(), what does 'out' represent?",
    "correct_answer": "A static member field of the System class representing the standard output stream",
    "wrong_answers": ["A method of the System class", "A local variable", "An instance of the Print class"]
  },
  {
    "question": "What happens when you pass an object to System.out.println()?",
    "correct_answer": "Java implicitly calls the object's toString() method.",
    "wrong_answers": ["Java prints the object's memory address in hexadecimal.", "A compilation error occurs.", "Java prints the class name only."]
  },
  {
    "question": "Which operator is used to concatenate strings inside a print statement?",
    "correct_answer": "+",
    "wrong_answers": ["&", ".", ","]
  },
  {
    "question": "What will System.out.println(5 + 5 + \"5\"); output?",
    "correct_answer": "105",
    "wrong_answers": ["555", "15", "Error"]
  },
  {
    "question": "What will System.out.println(\"5\" + 5 + 5); output?",
    "correct_answer": "555",
    "wrong_answers": ["510", "15", "Error"]
  },
  {
    "question": "Which format specifier is used to output an integer using System.out.printf()?",
    "correct_answer": "%d",
    "wrong_answers": ["%i", "%f", "%s"]
  },
  {
    "question": "Which format specifier is used to output a string using System.out.printf()?",
    "correct_answer": "%s",
    "wrong_answers": ["%c", "%str", "%d"]
  },
  {
    "question": "Which format specifier is used to output a floating-point number using System.out.printf()?",
    "correct_answer": "%f",
    "wrong_answers": ["%d", "%p", "%fl"]
  },
  {
    "question": "How do you limit a floating-point output to two decimal places in printf()?",
    "correct_answer": "%.2f",
    "wrong_answers": ["%2f", "%f.2", "%0.2d"]
  },
  {
    "question": "What is the return type of the System.out.print() method?",
    "correct_answer": "void",
    "wrong_answers": ["String", "int", "boolean"]
  },
  {
    "question": "If System.out.print() is called with no arguments, what happens?",
    "correct_answer": "A compilation error occurs.",
    "wrong_answers": ["It prints a blank line.", "It prints a null character.", "It does nothing."]
  },
  {
    "question": "If System.out.println() is called with no arguments, what happens?",
    "correct_answer": "It prints an empty line.",
    "wrong_answers": ["A compilation error occurs.", "It throws a runtime exception.", "It prints 'null'."]
  }
];

const stacksQueuesQuiz = [
  {
    "question": "Which principle does a Stack follow?",
    "correct_answer": "Last In, First Out (LIFO)",
    "wrong_answers": ["First In, First Out (FIFO)", "First In, Last Out (FILO)", "Random Access"]
  },
  {
    "question": "Which principle does a Queue follow?",
    "correct_answer": "First In, First Out (FIFO)",
    "wrong_answers": ["Last In, First Out (LIFO)", "Last In, Last Out (LILO)", "Random Access"]
  },
  {
    "question": "What is the term for adding an element to the top of a stack?",
    "correct_answer": "Push",
    "wrong_answers": ["Pop", "Enqueue", "Insert"]
  },
  {
    "question": "What is the term for removing an element from the top of a stack?",
    "correct_answer": "Pop",
    "wrong_answers": ["Push", "Dequeue", "Delete"]
  },
  {
    "question": "What is the term for adding an element to the back of a queue?",
    "correct_answer": "Enqueue",
    "wrong_answers": ["Dequeue", "Push", "Inject"]
  },
  {
    "question": "What is the term for removing an element from the front of a queue?",
    "correct_answer": "Dequeue",
    "wrong_answers": ["Enqueue", "Pop", "Eject"]
  },
  {
    "question": "Which stack operation allows you to view the top element without removing it?",
    "correct_answer": "Peek",
    "wrong_answers": ["Pop", "View", "Top"]
  },
  {
    "question": "What condition occurs when you try to pop an element from an empty stack?",
    "correct_answer": "Underflow",
    "wrong_answers": ["Overflow", "NullPointerException", "Segmentation Fault"]
  },
  {
    "question": "What condition occurs when you try to push an element onto a full stack?",
    "correct_answer": "Overflow",
    "wrong_answers": ["Underflow", "IndexOutOfBounds", "MemoryLeak"]
  },
  {
    "question": "Which data structure is best suited for implementing an 'undo' feature in a text editor?",
    "correct_answer": "Stack",
    "wrong_answers": ["Queue", "Tree", "Graph"]
  },
  {
    "question": "Which data structure is best suited for scheduling print jobs in a printer?",
    "correct_answer": "Queue",
    "wrong_answers": ["Stack", "Hash Table", "Array"]
  },
  {
    "question": "In a standard queue, elements are removed from which position?",
    "correct_answer": "Front",
    "wrong_answers": ["Rear", "Middle", "Top"]
  },
  {
    "question": "In a standard queue, new elements are added to which position?",
    "correct_answer": "Rear",
    "wrong_answers": ["Front", "Middle", "Bottom"]
  },
  {
    "question": "What is a circular queue?",
    "correct_answer": "A queue where the last position is connected back to the first position to make a circle.",
    "wrong_answers": ["A queue that only stores circular objects.", "A queue that operates on a LIFO principle.", "A queue that dynamically resizes infinitely."]
  },
  {
    "question": "What is a Double-Ended Queue (Deque)?",
    "correct_answer": "A queue where insertion and deletion can occur at both the front and rear.",
    "wrong_answers": ["A queue that holds exactly two elements.", "A queue where elements can only be accessed from the middle.", "A stack with two tops."]
  },
  {
    "question": "Which algorithm commonly uses a queue data structure?",
    "correct_answer": "Breadth-First Search (BFS)",
    "wrong_answers": ["Depth-First Search (DFS)", "Binary Search", "Quick Sort"]
  },
  {
    "question": "Which algorithm commonly uses a stack data structure?",
    "correct_answer": "Depth-First Search (DFS)",
    "wrong_answers": ["Breadth-First Search (BFS)", "Linear Search", "Merge Sort"]
  },
  {
    "question": "What is the time complexity of pushing an element onto a stack implemented with an array (assuming no resize)?",
    "correct_answer": "O(1)",
    "wrong_answers": ["O(n)", "O(log n)", "O(n^2)"]
  },
  {
    "question": "What is the time complexity of dequeuing an element from a standard array-based queue without circular implementation?",
    "correct_answer": "O(n)",
    "wrong_answers": ["O(1)", "O(log n)", "O(n^2)"]
  },
  {
    "question": "Which of the following is a direct application of stacks?",
    "correct_answer": "Evaluating arithmetic expressions (like postfix).",
    "wrong_answers": ["CPU task scheduling.", "Handling asynchronous requests.", "Breadth traversal in trees."]
  }
];

const bankersAlgoQuiz = [
  {
    "question": "What is the primary purpose of the Banker's Algorithm in operating systems?",
    "correct_answer": "Deadlock avoidance",
    "wrong_answers": ["Deadlock detection", "Deadlock recovery", "Process scheduling"]
  },
  {
    "question": "Who developed the Banker's Algorithm?",
    "correct_answer": "Edsger W. Dijkstra",
    "wrong_answers": ["Alan Turing", "John von Neumann", "Linus Torvalds"]
  },
  {
    "question": "To use the Banker's Algorithm, what must a process declare in advance?",
    "correct_answer": "The maximum number of resources of each type it may need",
    "wrong_answers": ["Its expected execution time", "The exact memory address it will access", "The ID of processes it will communicate with"]
  },
  {
    "question": "In the Banker's Algorithm, what does the 'Available' vector represent?",
    "correct_answer": "The number of available resources of each type in the system",
    "wrong_answers": ["The total number of processes currently running", "The maximum resources required by all processes", "The currently allocated resources"]
  },
  {
    "question": "What does the 'Max' matrix represent in the Banker's Algorithm?",
    "correct_answer": "The maximum demand of each resource by every process",
    "wrong_answers": ["The maximum memory limit of the OS", "The maximum number of processes allowed", "The total resources present in the system"]
  },
  {
    "question": "What does the 'Allocation' matrix represent?",
    "correct_answer": "The number of resources of each type currently allocated to each process",
    "wrong_answers": ["The resources that a process still needs", "The resources that are free to be used", "The memory addresses assigned to processes"]
  },
  {
    "question": "How is the 'Need' matrix calculated in the Banker's Algorithm?",
    "correct_answer": "Max - Allocation",
    "wrong_answers": ["Max + Allocation", "Available - Allocation", "Max - Available"]
  },
  {
    "question": "The Banker's Algorithm keeps the system in what kind of state?",
    "correct_answer": "Safe state",
    "wrong_answers": ["Unsafe state", "Deadlocked state", "Suspended state"]
  },
  {
    "question": "What defines a 'Safe State'?",
    "correct_answer": "There exists a sequence of all processes where each can finish executing with available resources.",
    "wrong_answers": ["No processes are currently executing.", "All processes are blocked waiting for I/O.", "CPU utilization is exactly 100%."]
  },
  {
    "question": "If a system is in an unsafe state, does it mean a deadlock is currently happening?",
    "correct_answer": "No, it just means a deadlock could potentially occur.",
    "wrong_answers": ["Yes, unsafe states are synonymous with deadlocks.", "No, it means the OS is about to crash.", "Yes, one process has already been killed."]
  },
  {
    "question": "When a process requests resources, what is the first condition checked by the algorithm?",
    "correct_answer": "If Request <= Need",
    "wrong_answers": ["If Request <= Allocation", "If Request >= Max", "If Request == Available"]
  },
  {
    "question": "What is the second condition checked if a process requests resources?",
    "correct_answer": "If Request <= Available",
    "wrong_answers": ["If Request <= Need", "If Allocation >= Request", "If Max == Available"]
  },
  {
    "question": "If a process requests resources and Request > Available, what happens?",
    "correct_answer": "The process must wait until resources are released.",
    "wrong_answers": ["The request is immediately granted.", "The process is terminated.", "The system crashes."]
  },
  {
    "question": "If a process requests resources and Request > Need, what happens?",
    "correct_answer": "The system raises an error because the process exceeded its maximum claim.",
    "wrong_answers": ["The process must wait.", "The request is granted.", "The Need matrix is dynamically increased."]
  },
  {
    "question": "What happens in the algorithm's simulation if a request is tentatively granted?",
    "correct_answer": "Available = Available - Request",
    "wrong_answers": ["Available = Available + Request", "Need = Need + Request", "Allocation = Allocation - Request"]
  },
  {
    "question": "If the algorithm simulates granting a request and the resulting state is safe, what occurs next?",
    "correct_answer": "The resources are actually allocated to the process.",
    "wrong_answers": ["The process is placed in a waiting queue.", "The resources are taken back immediately.", "The process is terminated."]
  },
  {
    "question": "What is a major disadvantage of the Banker's Algorithm?",
    "correct_answer": "It requires knowing the maximum resource needs of all processes in advance.",
    "wrong_answers": ["It cannot handle multiple instances of a resource type.", "It guarantees that a deadlock will occur eventually.", "It can only be run on a single-core CPU."]
  },
  {
    "question": "What happens when a process finishes execution in the Banker's Algorithm?",
    "correct_answer": "It releases all its allocated resources back to the Available pool.",
    "wrong_answers": ["It keeps the resources permanently.", "The resources are destroyed.", "The OS reboots."]
  },
  {
    "question": "In the algorithm's safety check loop, a process can finish if:",
    "correct_answer": "Finish[i] == false AND Need[i] <= Work",
    "wrong_answers": ["Finish[i] == true AND Need[i] >= Work", "Allocation[i] > Available", "Max[i] == Allocation[i]"]
  },
  {
    "question": "Why is the Banker's Algorithm rarely implemented in modern general-purpose operating systems like Windows or Linux?",
    "correct_answer": "Processes rarely know their maximum resource needs in advance, making it impractical.",
    "wrong_answers": ["It violates CPU scheduling rules.", "It consumes too much hard drive space.", "Modern OSs do not use resources."]
  }
];

// Initializes the quiz UI
function initQuiz(quizDataArray, mode = 'review') {
    if (!quizDataArray || quizDataArray.length === 0) return;
    
    currentQuizData = quizDataArray;
    currentQuestionIndex = 0;
    isReviewMode = (mode === 'review');
    
    renderQuestion();
    
    document.getElementById('quiz-dashboard-view').classList.add('hidden');
    document.getElementById('quiz-review-view').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Renders the current question
function renderQuestion() {
    const item = currentQuizData[currentQuestionIndex];
    
    // Update Progress Bar
    document.querySelector('.progress-left').textContent = `Item ${currentQuestionIndex + 1} of ${currentQuizData.length}`;
    
    // Get Target Container & Clear Previous Content
    const container = document.getElementById('dynamic-question-container');
    container.innerHTML = ''; 
    
    // Create Question Text
    const qText = document.createElement('p');
    qText.className = 'question-text';
    qText.textContent = item.question;
    container.appendChild(qText);
    
    // Create Options Container
    const optionsGroup = document.createElement('div');
    optionsGroup.className = 'options-group';
    
    let allOptions = [{ text: item.correct_answer, isCorrect: true }];
    item.wrong_answers.forEach(wrong => {
        allOptions.push({ text: wrong, isCorrect: false });
    });
    
    // Shuffle options array randomly
    allOptions.sort(() => Math.random() - 0.5);
    
    // Render Option Rows
    allOptions.forEach((opt) => {
        const label = document.createElement('label');
        label.className = 'option-row';
        
        // Highlight correct answer only in review mode
        if (isReviewMode && opt.isCorrect) {
            label.classList.add('validated-correct-option');
        }
        
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'q_current';
        
        if (isReviewMode) {
            input.disabled = true;
            if (opt.isCorrect) input.checked = true;
        } else {
            input.disabled = false; // Enabled for taking the quiz
        }
        
        const span = document.createElement('span');
        span.className = 'option-text';
        span.textContent = opt.text; 
        
        label.appendChild(input);
        label.appendChild(span);
        optionsGroup.appendChild(label);
    });
    
    container.appendChild(optionsGroup);
    
    // Update Navigation Buttons
    const btnBack = document.querySelector('.btn-back');
    const btnNext = document.querySelector('.btn-next');
    
    if (currentQuestionIndex === 0) {
        btnBack.textContent = isReviewMode ? 'Close Review' : 'Exit Quiz';
        btnBack.onclick = closeReview;
    } else {
        btnBack.innerHTML = '<span aria-hidden="true">&#8249;</span> Back';
        btnBack.onclick = prevQuestion;
    }
    
    if (currentQuestionIndex === currentQuizData.length - 1) {
        btnNext.textContent = isReviewMode ? 'Finish' : 'Submit Quiz';
        btnNext.onclick = closeReview;
    } else {
        btnNext.innerHTML = 'Next <span aria-hidden="true">&#8250;</span>';
        btnNext.onclick = nextQuestion;
    }
}

function nextQuestion() {
    if (currentQuestionIndex < currentQuizData.length - 1) {
        currentQuestionIndex++;
        renderQuestion();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function closeReview() {
    document.getElementById('quiz-review-view').classList.add('hidden');
    document.getElementById('quiz-dashboard-view').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// quizDatabase holds all unique quiz arrays
const quizDatabase = {
    'html-elements': htmlElementsQuiz, // (From the previous generated list)
    'java-print': javaPrintQuiz,
    'stacks-queues': stacksQueuesQuiz,
    'bankers-algo': bankersAlgoQuiz
};

// Handlers for HTML Buttons
function openReview(quizId) {
    const data = quizDatabase[quizId];
    initQuiz(data, 'review');
}

function takeQuiz(quizId) {
    const data = quizDatabase[quizId];
    initQuiz(data, 'take');
}