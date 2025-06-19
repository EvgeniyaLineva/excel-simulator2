// Маппинг русских функций и параметров на английские
function transformFormula(formula) {
  if (!formula) return '';

  return formula
    .replace(/^=ВПР/i, '=VLOOKUP') // ВПР -> VLOOKUP
    .replace(/;/g, ',')            // ; -> ,
    .replace(/\bИСТИНА\b/gi, 'TRUE')   // ИСТИНА -> TRUE
    .replace(/\bЛОЖЬ\b/gi, 'FALSE');  // ЛОЖЬ -> FALSE
}

window.onload = function () {
  luckysheet.create({
    container: 'luckysheet',
    lang: 'en',
    showtoolbar: false,
    showsheetbar: false,
    showinfobar: false,
    sheetFormulaBar: true,
    allowEdit: true,
    enableAddRow: false,
    enableAddCol: false,
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
    }]
  });

  // Перехват ввода формул
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      const formulaMeta = luckysheet.getCellMeta(5, 1); // B6
      if (formulaMeta && formulaMeta.f && /[а-яА-Я]/.test(formulaMeta.f)) {
        const transformed = transformFormula(formulaMeta.f);
        // Устанавливаем новую формулу
        luckysheet.setCellFormula(5, 1, transformed);
      }
    }
  });
};

function checkAnswer() {
  const cell = luckysheet.getCellMeta(5, 1);
  const value = luckysheet.getCellValue(5, 1);
  const formula = cell && cell.f;

  if (!formula) {
    alert("⛔ Вы не ввели формулу.");
    return;
  }

  if (formula.toUpperCase().includes("VLOOKUP") && value == 60) {
    alert("✅ Отлично! Формула работает корректно.");
  } else if (value == 60) {
    alert("⚠️ Значение правильное, но формула не содержит VLOOKUP.");
  } else {
    alert("❌ Неверно. Попробуйте ещё раз.");
  }
}
