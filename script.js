// Инициализация таблицы с формой Excel (LuckySheet)
window.onload = function() {
  luckysheet.create({
    container: 'luckysheet',
    lang: 'en',
    showtoolbar: false, // Убираем панель инструментов
    showsheetbar: false, // Убираем строку листа
    sheetFormulaBar: true, // Отображаем строку формул
    data: [{
      name: 'Лист1',
      data: [
        ["Товар", "Цена"],
        ["Яблоко", 50],
        ["Груша", 60],
        ["Апельсин", 70],
        [],
        ["Груша", ""]
      ],
      config: { merge: [] },
      calcChain: []
    }]
  });

  // Подсветка ячейки B6
  luckysheet.setCellValue(5, 1, ""); // Сброс значений в ячейке B6
  luckysheet.setCellStyle(5, 1, { background: '#d3f8d3', border: '2px solid green' }); // Подсветка ячейки B6
};

// Функция проверки формулы
function checkAnswer() {
  const cell = luckysheet.getCellMeta(5, 1); // Ячейка B6 (строка 6, столбец B)
  const value = luckysheet.getCellValue(5, 1);
  const formula = cell && cell.f;

  const feedback = document.getElementById('feedback');

  if (!formula) {
    feedback.textContent = "⛔ Вы не ввели формулу в строку формул или ячейку.";
    feedback.style.color = "orange";
    return;
  }

  const formulaUpper = formula.toUpperCase();
  
  // Проверка на формулу VLOOKUP
  if (formulaUpper.includes("VLOOKUP") && value == 60) {
    feedback.textContent = "✅ Отлично! Формула VLOOKUP сработала верно.";
    feedback.style.color = "green";
  } else if (value == 60) {
    feedback.textContent = "⚠️ Значение правильное, но формула не VLOOKUP.";
    feedback.style.color = "orange";
  } else {
    feedback.textContent = "❌ Неправильно. Убедитесь, что используете VLOOKUP и указали правильный диапазон.";
    feedback.style.color = "red";
  }
}
