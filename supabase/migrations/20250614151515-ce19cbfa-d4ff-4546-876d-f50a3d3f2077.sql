
-- Step 1: Populate the category_id from the existing itemcategory text field.
-- This ensures existing items are correctly linked to their categories.
UPDATE public.itemmaster i
SET category_id = c.id
FROM public.categories c
WHERE i.itemcategory = c.name AND i.category_id IS NULL;

-- Step 2: Make category_id non-nullable, as every item must have a category.
-- Note: This will fail if there are items where a category could not be found in Step 1.
ALTER TABLE public.itemmaster
ALTER COLUMN category_id SET NOT NULL;

-- Step 3: Remove the redundant itemcategory column to enforce the new structure.
ALTER TABLE public.itemmaster
DROP COLUMN itemcategory;
