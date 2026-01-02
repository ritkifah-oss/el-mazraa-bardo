import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { getCategorieNames } from '@/lib/storage';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryFilter({
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    const cats = getCategorieNames();
    setCategories(cats);
  };

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button
        variant={selectedCategory === 'all' ? 'default' : 'outline'}
        onClick={() => onSelectCategory('all')}
        className={
          selectedCategory === 'all'
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : 'border-gray-700 bg-gray-900 text-gray-300 hover:bg-gray-800 hover:text-green-400'
        }
      >
        Tous
      </Button>
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? 'default' : 'outline'}
          onClick={() => onSelectCategory(category)}
          className={
            selectedCategory === category
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'border-gray-700 bg-gray-900 text-gray-300 hover:bg-gray-800 hover:text-green-400'
          }
        >
          {category}
        </Button>
      ))}
    </div>
  );
}