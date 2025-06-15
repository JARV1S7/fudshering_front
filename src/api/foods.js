export async function fetchFoods() {
  const response = await fetch('http://localhost:8080/api/foods');
  if (!response.ok) {
    throw new Error('Ошибка загрузки товаров');
  }
  const foods = await response.json();

  return foods.map(food => ({
    id: food.id,
    shopId: food.shop?.id || 0,
    categoryId: mapCategory(food.category),
    name: food.name,
    discountedPrice: food.discountPrice,
    originalPrice: food.originalPrice,
    image: mapImage(food.name),
    isVisible: food.isActive,
  }));
}

function mapCategory(categoryEnum) {
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
  const images = {
    'Мексиканский бургер': '/image/burger.png',
  };
  return images[productName] || '/image/default.png';
}