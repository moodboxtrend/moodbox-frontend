import { useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export function RecipeExtraFields({ register, control }) {
  const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({
    control, name: 'recipeDetails.ingredients',
  });
  const { fields: stepFields, append: appendStep, remove: removeStep } = useFieldArray({
    control, name: 'recipeDetails.steps',
  });

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

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Ingredients</Label>
          <Button type="button" size="sm" variant="outline" onClick={() => appendIngredient({ name: '', quantity: '' })}>
            <Plus className="h-3.5 w-3.5" /> Add ingredient
          </Button>
        </div>
        <div className="space-y-2">
          {ingredientFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input placeholder="Ingredient name" {...register(`recipeDetails.ingredients.${index}.name`)} className="flex-1" />
              <Input placeholder="Quantity (e.g. 2 cups)" {...register(`recipeDetails.ingredients.${index}.quantity`)} className="w-40" />
              <Button type="button" variant="ghost" size="icon" onClick={() => removeIngredient(index)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
          {ingredientFields.length === 0 && <p className="text-xs text-muted-foreground">No ingredients added yet</p>}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Cooking Steps</Label>
          <Button
            type="button" size="sm" variant="outline"
            onClick={() => appendStep({ step: stepFields.length + 1, instruction: '' })}
          >
            <Plus className="h-3.5 w-3.5" /> Add step
          </Button>
        </div>
        <div className="space-y-2">
          {stepFields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-start">
              <span className="mt-2.5 h-6 w-6 shrink-0 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">
                {index + 1}
              </span>
              <Textarea placeholder="Describe this step…" rows={2} {...register(`recipeDetails.steps.${index}.instruction`)} className="flex-1" />
              <Button type="button" variant="ghost" size="icon" onClick={() => removeStep(index)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
          {stepFields.length === 0 && <p className="text-xs text-muted-foreground">No steps added yet</p>}
        </div>
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
