import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative mb-6">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
      <Input
        type="text"
        placeholder="Rechercher un produit..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 bg-gray-900 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500"
      />
    </div>
  );
}