  const RelationTypes = {
    strong: { label: "Сильний зв'язок", style: "solid", width: 4 },
    weak: { label: "Слабкий зв'язок", style: "dashed", width: 2 },
    conflict: { label: "Конфлікт", style: "solid", width: 3, color: "#e74c3c" },
    neutral: {
      label: "Нейтральний",
      style: "solid",
      width: 2,
      color: "#7f8c8d",
    },
    positive: {
      label: "Позитивний",
      style: "solid",
      width: 3,
      color: "#2ecc71",
    },
  };

  export default RelationTypes;