import styles from './LocationStep.module.scss';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import FormInputs from '../../../../../components/FormInputs/FormInputs';
import Input from '../../../../../components/Input/Input';
import Textarea from '../../../../../components/Textarea/Textarea';
import { DEBOUNCE_VALUE, regexClientName, regexTextBasic } from '../../../../../utils/consts';
import AddressMap from './AddressMap/AdressMap';
import { LngLat } from '@yandex/ymaps3-types';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import AddressInput from './AddressInput/AddressInput';
import { debounce } from 'lodash';

const LocationStep = () => {
    const { t } = useTranslation();
    const isUpdatingFromMap = useRef(false);
    const isUpdatingFromInput = useRef(false);

    const {
        register,
        setValue,
        formState: { errors },
        watch,
    } = useFormContext();

    const values = watch();
    const coordinates: LngLat = values.coordinates?.latitude && values.coordinates?.longitude ? [values.coordinates.longitude, values.coordinates.latitude] : [76.921552, 43.246345];

    const geocodeAddress = useCallback(
        async (address: string) => {
            if ((!address && address.length <= 5) || isUpdatingFromMap.current) return;
            isUpdatingFromInput.current = true;

            try {
                const res = await fetch(`https://geocode-maps.yandex.ru/1.x/?apikey=${import.meta.env.VITE_YNDX_API_KEY}&geocode=${encodeURIComponent(address)}&format=json`);
                if (res.ok) {
                    const result = await res.json();
                    const pos = result.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos;
                    const [lng, lat] = pos.split(' ').map(Number);
                    setValue('coordinates', { latitude: lat, longitude: lng }, { shouldValidate: true });
                }
            } finally {
                isUpdatingFromInput.current = false;
            }
        },
        [setValue]
    );

    const reverseGeocode = useCallback(
        async (coordinates: LngLat) => {
            if (isUpdatingFromInput.current) return;

            isUpdatingFromMap.current = true;
            try {
                const res = await fetch(`https://geocode-maps.yandex.ru/1.x/?apikey=${import.meta.env.VITE_YNDX_API_KEY}&geocode=${coordinates[0]},${coordinates[1]}&format=json`);
                if (res.ok) {
                    const result = await res.json();
                    const address = result.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.text;
                    setValue('address', address, { shouldValidate: true });
                    setValue('coordinates', { longitude: coordinates[0], latitude: coordinates[1] }, { shouldValidate: true });
                }
            } finally {
                isUpdatingFromMap.current = false;
            }
        },
        [setValue]
    );

    useEffect(() => {
        if (values.address && !isUpdatingFromMap.current) {
            geocodeAddress(values.address);
        }
    }, [values.address, geocodeAddress]);

    const handleMarkerPositionChange = useMemo(
        () =>
            debounce((newCoordinates: LngLat) => {
                reverseGeocode(newCoordinates);
            }, DEBOUNCE_VALUE),
        [reverseGeocode]
    );

    const handleAddressChange = (address: string) => {
        setValue('address', address, { shouldValidate: true });
        geocodeAddress(address);
    };

    return (
        <fieldset className={styles.fieldset}>
            <FormInputs>
                <Input type="text" name="name" placeholder={t('pages.cateringManagement.placeholderName')} nameLabel={t('pages.cateringManagement.nameLabelName')} register={register} errors={errors} pattern={regexClientName} value={values.name} />
                <AddressMap zoom={15} coordinates={coordinates} onDragEnd={handleMarkerPositionChange} />
                <AddressInput register={register} errors={errors} onChange={handleAddressChange} value={values.address} />
                <Textarea name="description" placeholder={t('pages.cateringManagement.placeholderDescription')} nameLabel={t('pages.cateringManagement.nameLabelDescription')} details={t('pages.cateringManagement.nameLabelDetails')} register={register} errors={errors} pattern={regexTextBasic} value={values.description} />
            </FormInputs>
        </fieldset>
    );
};

export default LocationStep;
