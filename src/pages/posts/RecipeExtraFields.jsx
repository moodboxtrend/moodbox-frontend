import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { Plus, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

function CommaSeparatedItemInput({
  items = [],
  onChange,
  placeholder = 'Type item (comma separated)',
  showIndex = false,
  badgeVariant = 'secondary',
}) {
  const [inputText, setInputText] = useState('');

  const processText = (text) => {
    if (!text) return;
    const parts = text.split(/[,|\n]+/);
    const validParts = parts.map((p) => p.trim()).filter((p) => p.length > 0);

    if (validParts.length > 0) {
      onChange([...items, ...validParts]);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    if (val.includes(',') || val.includes('\n')) {
      const parts = val.split(/[,|\n]+/);
      const trailing = parts.pop() || '';
      processText(parts.join(','));
      setInputText(trailing);
    } else {
      setInputText(val);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === ',' || e.key === 'Enter') {
      e.preventDefault();
      if (inputText.trim()) {
        processText(inputText);
        setInputText('');
      }
    }
  };

  const handleBlur = () => {
    if (inputText.trim()) {
      processText(inputText);
      setInputText('');
    }
  };

  const handleAddClick = () => {
    if (inputText.trim()) {
      processText(inputText);
      setInputText('');
    }
  };

  const removeItem = (indexToRemove) => {
    onChange(items.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={inputText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddClick}
          disabled={!inputText.trim()}
        >
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>

      {items.length > 0 ? (
        <div className="flex flex-wrap gap-2 pt-1 max-h-60 overflow-y-auto p-1">
          {items.map((item, idx) => (
            <Badge
              key={idx}
              variant={badgeVariant}
              className="py-1.5 px-3 text-sm font-normal gap-2 flex items-center max-w-full break-words"
            >
              <span>
                {showIndex && <strong className="mr-1 opacity-75">Step {idx + 1}:</strong>}
                {item}
              </span>
              <button
                type="button"
                onClick={() => removeItem(idx)}
                className="hover:bg-muted p-0.5 rounded-full text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">No items added yet</p>
      )}
    </div>
  );
}

export function RecipeExtraFields({ register, control }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label>Prep Time (min)</Label>
          <Input type="number" {...register('recipeDetails.prepTime')} />
        </div>
        <div className="space-y-1.5">
          <Label>Cook Time (min)</Label>
          <Input type="number" {...register('recipeDetails.cookTime')} />
        </div>
        <div className="space-y-1.5">
          <Label>Servings</Label>
          <Input type="number" {...register('recipeDetails.servings')} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Ingredients (Comma separated)</Label>
        <Controller
          control={control}
          name="recipeDetails.ingredients"
          render={({ field }) => {
            const currentStrings = (field.value || [])
              .map((item) => {
                if (typeof item === 'string') return item;
                if (!item) return '';
                const name = item.name || '';
                const qty = item.quantity || '';
                return qty ? `${qty} ${name}`.trim() : name.trim();
              })
              .filter(Boolean);

            const handleChange = (newStrings) => {
              const formattedIngredients = newStrings.map((str) => ({
                name: str.trim(),
                quantity: '',
              }));
              field.onChange(formattedIngredients);
            };

            return (
              <CommaSeparatedItemInput
                items={currentStrings}
                onChange={handleChange}
                placeholder="Add ingredients separated by commas (e.g. 1 cup flour, 2 eggs, 1 tsp salt)"
                badgeVariant="secondary"
              />
            );
          }}
        />
        <p className="text-xs text-muted-foreground">
          Type ingredients separated by commas (or press Enter after each item).
        </p>
      </div>

      <div className="space-y-1.5">
        <Label>Cooking Steps (Comma separated)</Label>
        <Controller
          control={control}
          name="recipeDetails.steps"
          render={({ field }) => {
            const currentStrings = (field.value || [])
              .map((item) => {
                if (typeof item === 'string') return item;
                return item?.instruction || '';
              })
              .filter(Boolean);

            const handleChange = (newStrings) => {
              const formattedSteps = newStrings.map((str, index) => ({
                step: index + 1,
                instruction: str.trim(),
              }));
              field.onChange(formattedSteps);
            };

            return (
              <CommaSeparatedItemInput
                items={currentStrings}
                onChange={handleChange}
                placeholder="Add cooking steps separated by commas (e.g. Boil water, Add tea leaves, Serve hot)"
                showIndex={true}
                badgeVariant="outline"
              />
            );
          }}
        />
        <p className="text-xs text-muted-foreground">
          Type cooking steps separated by commas (or press Enter after each step).
        </p>
      </div>

      <div className="space-y-1.5">
        <Label>Tips</Label>
        <Textarea rows={2} placeholder="Optional cooking tips" {...register('recipeDetails.tips')} />
      </div>

      <div>
        <Label className="mb-2 block">Nutrition Information (optional)</Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Input placeholder="Calories" {...register('recipeDetails.nutrition.calories')} />
          <Input placeholder="Protein" {...register('recipeDetails.nutrition.protein')} />
          <Input placeholder="Carbs" {...register('recipeDetails.nutrition.carbs')} />
          <Input placeholder="Fat" {...register('recipeDetails.nutrition.fat')} />
        </div>
      </div>
    </div>
  );
}

