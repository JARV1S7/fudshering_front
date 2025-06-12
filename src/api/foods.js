export async function fetchFoods() {
  const response = await fetch('http://localhost:8080/api/foods');
  if (!response.ok) {
    throw new Error('Ошибка загрузки товаров');
  }
  const foods = await response.json();

  // Преобразуем данные под фронтенд
  return foods.map(food => ({
    id: food.id,
    shopId: food.shop?.id || 0,
    categoryId: mapCategory(food.category),
    name: food.name,
    discountedPrice: food.discountPrice,
    originalPrice: food.originalPrice,
    image: mapImage(food.name), // функция сопоставления имени товара и локального пути к картинке
    isVisible: food.isActive,
  }));
}

function mapCategory(categoryEnum) {
  // Пример сопоставления enum с id категории
  const map = {
    BAKERY: 1,
    READY_MEALS: 2,
    DAIRY: 3,
    MEAT: 4,
    VEGETABLES: 5,
    FRUITS: 6,
    OTHER: 9,
  };
  return map[categoryEnum] || 9;
}

function mapImage(productName) {
  // Пример: возвращаем путь к локальному изображению по имени
  const images = {
    'Мексиканский бургер': '/image/burger.png',
    // добавьте остальные соответствия
  };
  return images[productName] || '/image/default.png';
}