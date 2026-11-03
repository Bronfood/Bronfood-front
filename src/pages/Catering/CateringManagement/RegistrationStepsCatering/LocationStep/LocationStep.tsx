import styles from './LocationStep.module.scss';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import FormInputs from '../../../../../components/FormInputs/FormInputs';
import Input from '../../../../../components/Input/Input';
import Textarea from '../../../../../components/Textarea/Textarea';
import { DEBOUNCE_VALUE, INITIAL_CENTER, regexClientName, regexTextBasic } from '../../../../../utils/consts';
import AddressMap from './AddressMap/AdressMap';
import { LngLat } from '@yandex/ymaps3-types';
import { useCallback, useMemo, useRef } from 'react';
import AddressInput from './AddressInput/AddressInput';
import { debounce } from 'lodash';

const LocationStep = () => {
    const { t } = useTranslation();
    const isUpdatingFromInput = useRef(false);

    const {
        register,
        setValue,
        formState: { errors },
        watch,
    } = useFormContext();

    const values = watch();
    const coordinates = useMemo<LngLat>(() => {
        if (values.coordinates?.latitude && values.coordinates?.longitude) {
            return [values.coordinates.longitude, values.coordinates.latitude];
        }
        return INITIAL_CENTER;
    }, [values.coordinates?.latitude, values.coordinates?.longitude]);

    const geocodeAddress = useCallback(
        async (address: string) => {
            if (!address || address.length < 5) return;
            isUpdatingFromInput.current = true;

            try {
                const res = await fetch(`https://geocode-maps.yandex.ru/1.x/?apikey=${import.meta.env.VITE_YNDX_API_KEY}&geocode=${encodeURIComponent(address)}&format=json`);
                if (res.ok) {
                    const result = await res.json();
                    const featureMember = result.response.GeoObjectCollection.featureMember;
                    if (featureMember && featureMember.length > 0) {
                        const pos = featureMember[0].GeoObject.Point.pos;
                        const [lng, lat] = pos.split(' ').map(Number);
                        setValue('coordinates', { latitude: lat, longitude: lng }, { shouldValidate: true });
                    }
                }
            } finally {
                isUpdatingFromInput.current = false;
            }
        },
        [setValue]
    );

    const debouncedGeocode = useMemo(() => debounce((address: string) => geocodeAddress(address), DEBOUNCE_VALUE), [geocodeAddress]);

    const handleAddressChange = (address: string) => {
        setValue('address', address, { shouldValidate: true });
        debouncedGeocode(address);
    };

    const handleMapDragEnd = (newCoordinates: LngLat) => {
        setValue(
            'coordinates',
            {
                longitude: newCoordinates[0],
                latitude: newCoordinates[1],
            },
            { shouldValidate: true }
        );
    };

    return (
        <fieldset className={styles.fieldset}>
            <FormInputs>
                <Input type="text" name="name" placeholder={t('pages.cateringManagement.placeholderName')} nameLabel={t('pages.cateringManagement.nameLabelName')} register={register} errors={errors} pattern={regexClientName} value={values.name} />
                <AddressMap zoom={15} coordinates={coordinates} onDragEnd={handleMapDragEnd} />
                <AddressInput register={register} errors={errors} onChange={handleAddressChange} value={values.address} />
                <Textarea name="description" placeholder={t('pages.cateringManagement.placeholderDescription')} nameLabel={t('pages.cateringManagement.nameLabelDescription')} details={t('pages.cateringManagement.nameLabelDetails')} register={register} errors={errors} pattern={regexTextBasic} value={values.description} />
            </FormInputs>
        </fieldset>
    );
};

export default LocationStep;
