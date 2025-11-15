export interface ImageItem {
    id: number;
    title: string;
    url: string;
    thumbnailUrl?: string;
    categoryId?: number;
    createdAt?: string;
    description?: string;
}
export type Paged<T> = import('./common').Paged<T>;