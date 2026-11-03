import { Catering } from '../api/cateringService/cateringService';
import { INITIAL_CENTER } from '../consts';
import { dataURLtoFile } from './dataURLtoFile';
import { formatMinutesToTime } from './formatMinutesToTime';

export type BuildCateringData = Omit<Catering, 'id' | 'photo'> & {
    id?: number;
    photo?: string | File | null;
    cancellation_time_limit: string | number;
};

export const buildCateringFormData = (data: BuildCateringData) => {
    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('address', data.address);
    formData.append('description', data.description || '');
    formData.append('type', data.type);

    formData.append('cancellation_time_limit', formatMinutesToTime(data.cancellation_time_limit));

    formData.append('longitude', String(data.coordinates?.longitude ?? INITIAL_CENTER[0]));
    formData.append('latitude', String(data.coordinates?.latitude ?? INITIAL_CENTER[1]));

    formData.append('legal_name', data.legal_name);
    formData.append('legal_bin', data.legal_bin);
    formData.append('legal_address', data.legal_address);
    formData.append('legal_director_fullname', data.legal_director_fullname);

    if (data.photo) {
        if (typeof data.photo === 'string' && data.photo.startsWith('data:')) {
            formData.append('photo', dataURLtoFile(data.photo, 'photo.jpg'));
        } else if (data.photo instanceof File) {
            formData.append('photo', data.photo);
        }
    }

    if (data.tags && data.tags.length > 0) {
        data.tags.forEach((tag, index) => {
            formData.append(`tags[${index}]name`, tag.name);
        });
    }

    if (data.schedule && data.schedule.length > 0) {
        data.schedule.forEach((day, index) => {
            formData.append(`schedule[${index}]weekday`, String(day.weekday));
            formData.append(`schedule[${index}]open_time`, day.open_time || '');
            formData.append(`schedule[${index}]close_time`, day.close_time || '');
        });
    }

    return formData;
};
