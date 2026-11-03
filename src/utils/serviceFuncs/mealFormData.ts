import { CateringMeal, Feature } from '../api/cateringMealService/cateringMealService';
import { dataURLtoFile } from './dataURLtoFile';

export type BuildMealData = Omit<CateringMeal, 'id' | 'photo' | 'base_price'> & {
    id?: number;
    photo?: string | File | null;
    base_price: string | number;
};

const appendTags = (formData: FormData, tags?: { name: string }[]) => {
    if (tags && tags.length > 0) {
        tags.forEach((tag, index) => formData.append(`tags[${index}]name`, tag.name));
    }
};

const appendFeatures = (formData: FormData, features: Feature[] = []) => {
    const validFeatures = features.map((f) => ({ ...f, choices: f.choices.filter((c) => c.name?.trim()) })).filter((f) => f.name?.trim() && f.choices.length > 0);

    validFeatures.forEach((feature, fIndex) => {
        if (feature.id > 0) formData.append(`features[${fIndex}]id`, String(feature.id));
        formData.append(`features[${fIndex}]name`, feature.name);
        formData.append(`features[${fIndex}]selection_type`, feature.selection_type);
        formData.append(`features[${fIndex}]pricing_strategy`, feature.pricing_strategy);

        feature.choices.forEach((choice, cIndex) => {
            if (choice.id > 0) formData.append(`features[${fIndex}]choices[${cIndex}]id`, String(choice.id));
            formData.append(`features[${fIndex}]choices[${cIndex}]name`, choice.name);
            formData.append(`features[${fIndex}]choices[${cIndex}]price`, String(choice.price));
            formData.append(`features[${fIndex}]choices[${cIndex}]is_visible`, String(choice.is_visible));
            formData.append(`features[${fIndex}]choices[${cIndex}]is_default`, String(choice.is_default));
        });
    });
};

export const buildMealFormData = (
    meal: BuildMealData,
    options?: {
        featuresOverride?: Feature[];
        visibleOverride?: boolean;
    }
) => {
    const formData = new FormData();
    formData.append('name', meal.name);
    formData.append('description', meal.description || '');
    formData.append('waiting_time', meal.waiting_time);
    formData.append('base_price', String(meal.base_price));

    const isVisible = options?.visibleOverride ?? meal.is_visible;
    formData.append('is_visible', String(isVisible));

    if (meal.photo) {
        if (typeof meal.photo === 'string' && meal.photo.startsWith('data:')) {
            formData.append('photo', dataURLtoFile(meal.photo, 'photo.jpg'));
        } else if (meal.photo instanceof File) {
            formData.append('photo', meal.photo);
        }
    }

    appendTags(formData, meal.tags);

    const features = options?.featuresOverride ?? meal.features ?? [];
    appendFeatures(formData, features);

    return formData;
};
