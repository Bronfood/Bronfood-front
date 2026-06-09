import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FieldValues, SubmitHandler, useForm, FormProvider } from 'react-hook-form';
import MealPopup from './MealPopup/MealPopup';
import MealImage from './MealImage/MealImage';
import MealDescription from './MealDescription/MealDescription';
import MealTotal from './MealTotal/MealTotal';
import MealFeatureList from './MealFeatureList/MealFeatureList';
import Preloader from '../../components/Preloader/Preloader';
import { Feature } from '../../utils/api/restaurantsService/restaurantsService';
import { sumBy } from 'lodash';
import { useMeals } from '../../utils/hooks/useMeals/useMeals';
import { useBasketMutations, useGetBasket } from '../../utils/hooks/useBasket/useBasket';
import { useFeatures } from '../../utils/hooks/useFeatures/useFeatures';

function MealPage() {
    const [features, setFeatures] = useState<Feature[]>([]);
    const navigate = useNavigate();
    const params = useParams();
    const restaurantId = parseInt(params.restaurantId ? params.restaurantId : '');
    const mealId = parseInt(params.mealId ? params.mealId : '');
    const { refetch: refetchBasket } = useGetBasket();
    const { addMeal } = useBasketMutations();
    const methods = useForm();
    const { watch } = methods;
    const { data, isSuccess } = useMeals(restaurantId);
    const meal = isSuccess && data.data.filter((meal) => meal.id == mealId)[0];
    const featuresData = useFeatures(restaurantId, mealId);
    const price =
        features.length > 0
            ? sumBy(features, (feature) => {
                  const isChosen = feature.choices.some((choice) => choice.chosen);
                  if (isChosen) {
                      return feature.choices.filter((choice) => choice.chosen)[0].price;
                  } else {
                      return feature.choices.filter((choice) => choice.default)[0].price;
                  }
              })
            : meal
              ? meal.price
              : 0;
    const goBack = () => {
        navigate(`/restaurants/${restaurantId}`);
    };
    useEffect(() => {
        const formValues = watch((value, { name }) => {
            const nextFeatures = features.map((feature: Feature) => {
                if (feature.name === name) {
                    const choices = feature.choices.map((choice) => {
                        return { ...choice, chosen: choice.name === value[name] };
                    });
                    return { ...feature, choices };
                } else return feature;
            });
            setFeatures(nextFeatures);
        });
        return () => formValues.unsubscribe();
    }, [watch, features]);

    useEffect(() => {
        if (featuresData.isSuccess) {
            const initialFeatures = featuresData.data.data.map((feature) => {
                const choices = feature.choices.map((choice) => {
                    return { ...choice, chosen: false };
                });
                return { ...feature, choices };
            });
            setFeatures(initialFeatures);
        } else {
            setFeatures([]);
        }
    }, [featuresData.isSuccess, featuresData.data]);

    if (meal) {
        const onSubmit: SubmitHandler<FieldValues> = async (data) => {
            const newFeatures =
                features.length > 0
                    ? features.map((feature: Feature) => {
                          const { id, name } = feature.choices.filter((choice) => choice.name === data[feature.name])[0];
                          return {
                              featureId: feature.id,
                              featureName: feature.name,
                              choiceId: id,
                              choiceName: name,
                          };
                      })
                    : [];
            await addMeal.mutateAsync({ restaurantId, mealId: meal.id, features: newFeatures });
            refetchBasket();
            goBack();
        };
        return (
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                    <MealPopup goBack={goBack} close={goBack}>
                        <MealImage image={meal.photo} />
                        <MealDescription name={meal.name} description={meal.description} />
                        {features.length > 0 ? <MealFeatureList features={features} /> : <div style={{ flexGrow: '1' }}></div>}
                        <MealTotal price={price} buttonDisabled={addMeal.isPending} />
                        {addMeal.isPending && <Preloader />}
                    </MealPopup>
                </form>
            </FormProvider>
        );
    } else return null;
}

export default MealPage;
