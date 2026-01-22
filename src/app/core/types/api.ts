export interface ApiResponse<T = any> {
    http_code: number;
    status: 'success' | 'error';
    message: string;
    api_data: {
        version: string;
        date_time: string;
    };
    data: T;
    metadata: {
        url: {
            base_url: string;
            get_uri: string[];
        };
    };
}

export interface ValidationError {
    validation: Record<string, string>;
}