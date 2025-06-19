// Преобразует русскую формулу в английскую
function transformFormula(formula) {
  return formula
    .replace(/^=ВПР/i, '=VLOOKUP')
    .replace(/;/g, ',')
    .replace(/\bИСТИНА\b/gi, 'TRUE')
    .replace(/\bЛОЖЬ\b/gi, 'FALSE');
}

// Проверка ответа
function checkAnswer() {
  const meta = luckysheet.getCellMeta(5, 1);
  const value = luckysheet.getCellValue(5, 1);
  const formula = meta && meta.f;
  if (!formula) return alert("Введите формулу в ячейку B6.");
  if (!formula.toUpperCase().includes("VLOOKUP")) return alert("Используйте ВПР.");
  if (value == 60) alert("✅ Всё верно!");
  else alert("❌ Результат неверен.");
}

// Инициализация
window.onload = () => {
  luckysheet.create({
    container: 'luckysheet',
    lang: 'en',
    sheetFormulaBar: true,
    showtoolbar: false,
    showsheetbar: false,
    showinfobar: false,
    allowEdit: true,
    data: [{
      data: [
        ["Товар","Цена"],
        ["Яблоко",50],
        ["Груша",60],
        ["Апельсин",70],
        [],
        ["Груша",""]
      ],
      config: {},
      name: 'Лист1',
    }]
  });

  // Сразу подсветим B6 и заблокируем остальные
  luckysheet.setCellStyle(5, 1, { background: '#e0ffe0', border: '2px solid green' });
  luckysheet.setCellReadonly(0, { row: [0,1,2,3,4], column: [0,1] });

  // Перехват ввода формулы
  const handler = () => {
    const meta = luckysheet.getCellMeta(5, 1);
    if (meta.f && /[А-Я]/i.test(meta.f)) {
      const newF = transformFormula(meta.f);
      luckysheet.setCellFormula(5, 1, newF);
    }
  };
  luckysheet.luckysheetrefreshgrid(); // обновим сетку
  document.addEventListener('keyup', handler);
};
