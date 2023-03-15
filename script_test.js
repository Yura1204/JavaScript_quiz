const content = document.querySelector('#content');
// содержит все вопросы, кнопку submit и блок для вывода результатов
const slider = document.getElementById('slider');
// При загрузке страницы код ищет все вопросы в контейнере slider и сохраняет их в переменную questions.
const questions = slider.querySelectorAll('.slider-question');
const submitButton = slider.querySelector('#slider-submit-button');
let currentQuestion = 0;
let timeLeft = 30;
let correctAnswers = 0;
let timerId;

// Переменные для progressBar
const progress = document.querySelector('#progress');
const increment = 100 / questions.length; // вычисляем величину инкремента


// Функция startTimer() запускает таймер на 30 секунд и обновляет оставшееся время на экране каждую секунду. 
// Когда время заканчивается, функция переходит к следующему вопросу и начинает новый таймер.
function startTimer() {
  // Проще говоря, эта функция запускает таймер, который уменьшает timeLeft на каждый шаг интервала, пока timeLeft не станет равной нулю. 
  // Если таймер доходит до нуля, он останавливается, timeLeft сбрасывается до 30, и происходит переход к следующему вопросу в опроснике.
  timerId = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft === 0) {
      clearInterval(timerId);//прерывает выполнение функции, которая была запущена ранее с помощью setInterval().
      timeLeft = 30;
      updateTimer();
      goToNextQuestion();
    }
  }, 1000);
}

// Функция updateTimer() обновляет таймер на экране каждую секунду, показывая оставшееся время.
function updateTimer() {
  // Ищет элемент с id "timer" внутри родительского элемента с id "slider".
  const timer = slider.querySelector('#timer');
  // Если элемент найден (условие в строке 2 истинно), то обновляет его содержимое (текст) значением переменной timeLeft.
  if (timer) { //условие if (timer) будет ложным только в том случае, если на странице не найден элемент с id "timer".
    timer.textContent = `Оставшееся время: ${timeLeft}`;
  }
  // Если элемент не найден, то функция не делает ничего.
}

// Функция goToNextQuestion() переходит к следующему вопросу, если он существует, иначе вызывает showResults().
function goToNextQuestion() {
  currentQuestion++; //Увеличивается значение на 1, чтобы перейти к следующему вопросу.
  updateProgress();
  // Затем проверяется, если currentQuestion меньше, чем длина массива questions (то есть, если есть ещё вопросы для показа), 
  // то вызывается функция showCurrentQuestion(), чтобы показать следующий вопрос.
  if (currentQuestion < questions.length) {
    showCurrentQuestion();
  } 
  // Если currentQuestion больше или равен длине массива questions (то есть, если был показан последний вопрос), 
  // то вызывается функция showResults(), чтобы показать результаты теста.
  else {
    showResults();
  }
}

function updateProgress() {
  progress.value += increment; // увеличиваем значение атрибута "value"
}

// Функция showCurrentQuestion() скрывает все вопросы, кроме текущего вопроса, и показывает текущий вопрос на экране.
function showCurrentQuestion() {
  // Начинается перебор всех вопросов с помощью метода forEach.
  questions.forEach((question, index) => {
    // Для каждого вопроса проверяется, равен ли его индекс index индексу текущего вопроса currentQuestion.
    if (index === currentQuestion) { //Если индексы совпадают, то для этого вопроса устанавливается CSS-свойство display равное block, чтобы он отображался на странице.
      question.style.display = 'block';
      // Также вызывается функция startTimer, чтобы начать отсчёт времени для текущего вопроса.
      startTimer();
    } 
    // Если индексы не совпадают, то устанавливается CSS-свойство display равное none, чтобы скрыть этот вопрос на странице.
    else {
      question.style.display = 'none';
    }
  });
}


// Когда пользователь нажимает на кнопку "submit", функция submitAnswer() вызывается, чтобы проверить ответ и перейти к следующему вопросу.
function submitAnswer() {
  // Переменная currentQuestionEl ссылается на текущий элемент вопроса в HTML-документе, который будет проверен на правильность ответа.
  const currentQuestionEl = questions[currentQuestion];
  // Переменная answerInputs ссылается на все элементы формы input, связанные с текущим вопросом, которые были отмечены как выбранные (отмечены как правильные ответы).
  const answerInputs = currentQuestionEl.querySelectorAll('input[type="radio"]:checked');
  // Если был выбран ответ, она проверяет, верный ли ответ был выбран.
  if (answerInputs.length > 0) { //проверяет, есть ли выбранные ответы на данный вопрос. Если ответы есть, то выполняется код внутри блока if.
    // selectedAnswer - выбирает значение выбранного пользователем ответа на текущий вопрос. 
    // Мы берем значение первого выбранного input-элемента, поскольку мы предполагаем, что на каждый вопрос можно выбрать только один ответ (radio-кнопки).
    const selectedAnswer = answerInputs.value;

    // correctAnswer - выбирает правильный ответ на текущий вопрос из атрибута data-answer элемента currentQuestionEl. 
    // Если selectedAnswer и correctAnswer совпадают, значит пользователь выбрал правильный ответ и увеличиваем счетчик правильных ответов correctAnswers.
    const correctAnswer = currentQuestionEl.dataset.answer;
    if (selectedAnswer === correctAnswer) {
      correctAnswers++;
    }
    // Затем функция останавливает таймер, обнуляет время и переходит к следующему вопросу:
    clearInterval(timerId);
    timeLeft = 30;
    updateTimer();
    goToNextQuestion();
  }
  // Если вопрос не был отвечен (т. е. `answerInputs.length === 0`), функция ничего не делает.
}

submitButton.addEventListener('click', submitAnswer);
showCurrentQuestion();

// showResults() - отображает результаты теста на странице
function showResults() {
  // Создается новый элемент div с помощью document.createElement(), который будет хранить результаты теста
  const resultsContainer = document.createElement('div');
  // добавляется класс 'results' к этому элементу:
  resultsContainer.classList.add('results');

  const header = document.createElement('h2');
  header.textContent = 'Результаты теста';
  // Заголовок добавляется в родительский элемент resultsContainer с помощью метода appendChild():
  resultsContainer.appendChild(header);

  // Создается новый элемент ul, в который будут добавляться результаты теста
  const list = document.createElement('ul');
  resultsContainer.appendChild(list);

  // Создается переменная numCorrect, которая будет использоваться для хранения количества правильных ответов.
  let numCorrect = 0;
  // Затем в цикле forEach перебираются все вопросы, которые были заданы в тесте.
  questions.forEach((question, index) => {
    // Выбираются все элементы input с типом radio, которые были выбраны пользователем для текущего вопроса, и сохраняются в переменной answerInputs
    const answerInputs = question.querySelectorAll('input[type="radio"]:checked');
    // Значение выбранного ответа сохраняется в переменной selectedAnswer. Если ни один из вариантов ответа не был выбран, selectedAnswer будет равно null.
    const selectedAnswer = answerInputs.length > 0 ? answerInputs[0].value : null;
    // Правильный ответ на вопрос сохраняется в переменной correctAnswer, которая извлекается из атрибута data-answer вопроса.
    const correctAnswer = question.dataset.answer;
    // Проверяется, был ли выбран правильный ответ, сравнивая значение selectedAnswer и correctAnswer. Результат сравнения сохраняется в переменной isCorrect.
    const isCorrect = selectedAnswer === correctAnswer;

    // Для каждого вопроса теста, проверяется, выбран ли правильный ответ. Если ответ верный, то переменная "numCorrect" увеличивается на 1.
    if(isCorrect){
      numCorrect++;
    }

    // Затем создается новый элемент "p", в который добавляется информация о каждом вопросе и ответе. 
    const listItem = document.createElement('p');
    // Добавляем класс results__item к элементу
    listItem.classList.add('results__item');
    // создает HTML-код для вставки в элемент списка, который включает вопрос и ответ на вопрос
    listItem.innerHTML = `
      <span class="results__question">${index + 1}. ${question.textContent.trim()}</span> <br>
      <span class="results__answer ${isCorrect ? 'results__answer--correct<br>' : 'results__answer--incorrect'}">${isCorrect ? 'Правильный ответ' : `Неправильный ответ. <br>Ваш ответ: ${selectedAnswer}. Правильный ответ: ${correctAnswer}`}<br><br></span>
    `;
    // добавляет элемент списка в список результатов теста
    list.appendChild(listItem);
  });
  // добавляет resultsContainer внутрь элемента с идентификатором content.
  document.getElementById('content').appendChild(resultsContainer);
  // Скрываем таймер
  timer.style.display = 'none';

  // Эта строка кода вычисляет процент правильных ответов на основе количества правильных ответов и общего количества вопросов.
  const percentCorrect = Math.round(numCorrect / questions.length * 100);

  // Эта строка кода вычисляет количество неправильных ответов на основе общего количества вопросов и количества правильных ответов.
  const numIncorrect = questions.length - numCorrect;

  // Вычисление оценки на основе процента правильных ответов. Если процент равен 100, то оценка равна 5. 
  // Если процент между 81 и 99, оценка равна 4. Если процент между 61 и 80, оценка равна 3. 
  // Во всех остальных случаях оценка равна 2.
  const grade = percentCorrect === 100 ? '5' :
                percentCorrect >= 81 ? '4' :
                percentCorrect >= 61 ? '3' :
                '2';

  
  // Эта строка кода создает новый элемент div.              
  const summary = document.createElement('div');
  // Эта строка кода добавляет класс results__summary к элементу summary.
  summary.classList.add('results__summary');

  // Эта строка кода устанавливает HTML-содержимое элемента summary в виде строки, которая содержит оценку, процент правильных ответов и количество неправильных ответов.
  summary.innerHTML = `<b><P>Оценка: ${grade}.</p> ${percentCorrect}% правильных ответов (${numIncorrect} неправильных)</b><br><br>`;
  
  // Эта строка кода добавляет элемент summary внутрь resultsContainer
  resultsContainer.appendChild(summary);

  const content = document.querySelector('.content');
  content.appendChild(resultsContainer);
}
